import { useState, useEffect, useCallback } from 'react'
import { Navbar } from './components/Navbar'
import { CategoryFilter } from './components/CategoryFilter'
import { Feed } from './components/Feed'
import { LoadingScreen } from './components/LoadingScreen'
import { ToastContainer, ToastMessage } from './components/ToastContainer'
import { Article } from './data/mockArticles'
import { fetchRedditNews } from './services/redditService'
import { categorizeHeadline, categorizeHeadlines } from './services/openRouterService'
import { getFirstThreeSentences } from './services/contentService'
import { getCachedArticle, saveToCache, saveBatchToCache } from './services/cacheService'
import { AnimatePresence, motion } from 'framer-motion'

function App() {
    const [articles, setArticles] = useState<Article[]>([])
    const [activeCategory, setActiveCategory] = useState('Alle')
    const [isDark, setIsDark] = useState(false)
    const [likedCategories, setLikedCategories] = useState<Record<string, number>>({})
    const [likedArticles, setLikedArticles] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingProgress, setLoadingProgress] = useState('News werden geladen...')
    const [toasts, setToasts] = useState<ToastMessage[]>([])
    const [after, setAfter] = useState<string | null>(null)
    const [isFetchingMore, setIsFetchingMore] = useState(false)
    const [isAnalyzingMore, setIsAnalyzingMore] = useState(false)
    const [currentFont, setCurrentFont] = useState<'serif' | 'sans'>('serif')
    const [fontWeight, setFontWeight] = useState<number>(500)
    const [isAllCaps, setIsAllCaps] = useState<boolean>(true)
    const addToast = useCallback((message: string, title?: string, type: 'error' | 'warning' | 'info' = 'error') => {
        const id = Math.random().toString(36).substring(2, 9);

        setToasts(prev => {
            // Wir gruppieren nun nach dem Titel (Kategorie)
            const existingIndex = title
                ? prev.findIndex(t => t.title === title)
                : -1;

            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    message: message, // Immer die neuste Nachricht anzeigen
                    count: (updated[existingIndex].count || 1) + 1,
                    timestamp: Date.now()
                };
                return updated;
            }

            return [...prev, { id, title, message, type, count: 1 }];
        });
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // Initial load
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true)
            setLoadingProgress('Reddit Schlagzeilen werden abgerufen...')
            try {
                const { articles: newFromReddit, nextAfter } = await fetchRedditNews()
                setAfter(nextAfter);

                // Zuerst Cache anwenden
                const processedArticles = newFromReddit.map((article: Article) => {
                    const cached = getCachedArticle(article.id);
                    if (cached) {
                        return { ...article, category: cached.category, catcher: cached.catcher };
                    }
                    return article;
                });

                setArticles(processedArticles);

                // Nur Artikel anreichern, die noch NICHT im Cache sind
                const firstBatch = processedArticles.slice(0, 20);
                const needsEnrichment = firstBatch.filter((a: Article) => a.category === 'Laden...');

                if (needsEnrichment.length > 0) {
                    setLoadingProgress(`${needsEnrichment.length} neue Artikel werden analysiert...`);
                    await enrichArticlesBatch(needsEnrichment);
                }

                setLoading(false)
            } catch (err: any) {
                addToast(err.message, 'Lade-Fehler');
                setLoading(false);
            }
        }

        const savedLikes = localStorage.getItem('lecta_likes')
        const savedArticles = localStorage.getItem('lecta_liked_articles')
        const savedFont = localStorage.getItem('lecta_font') as 'serif' | 'sans'
        const savedWeight = localStorage.getItem('lecta_weight')
        const savedCaps = localStorage.getItem('lecta_caps')
        if (savedLikes) setLikedCategories(JSON.parse(savedLikes))
        if (savedArticles) setLikedArticles(JSON.parse(savedArticles))
        if (savedFont) setCurrentFont(savedFont)
        if (savedWeight) setFontWeight(Number(savedWeight))
        if (savedCaps !== null) setIsAllCaps(savedCaps === 'true')

        loadInitialData()
    }, [addToast])

    const toggleFont = () => {
        const next = currentFont === 'serif' ? 'sans' : 'serif'
        setCurrentFont(next)
        localStorage.setItem('lecta_font', next)
    }

    useEffect(() => {
        document.documentElement.style.setProperty('--font-weight-main', fontWeight.toString());
    }, [fontWeight]);

    const fetchMoreFromReddit = async () => {
        if (isFetchingMore || isAnalyzingMore || !after) return;
        setIsFetchingMore(true);
        try {
            const { articles: newArticles, nextAfter } = await fetchRedditNews(after);
            setAfter(nextAfter);

            const processed = newArticles.map((article: Article) => {
                const cached = getCachedArticle(article.id);
                if (cached) {
                    return { ...article, category: cached.category, catcher: cached.catcher };
                }
                return article;
            });

            // Wir fügen die neuen Artikel dem State hinzu
            setArticles(prev => [...prev, ...processed]);

            // Jetzt starten wir die ANALYSE für die ersten 20 neuen (ungecachten) Artikel
            const needsEnrichment = processed.slice(0, 20).filter(a => a.category === 'Laden...');
            if (needsEnrichment.length > 0) {
                setIsAnalyzingMore(true);
                await enrichArticlesBatch(needsEnrichment);
            }
        } catch (error) {
            console.error("Fehler beim Nachladen von Reddit", error);
        } finally {
            setIsFetchingMore(false);
            setIsAnalyzingMore(false);
        }
    };

    const enrichArticlesBatch = async (articlesToEnrich: Article[]) => {
        if (articlesToEnrich.length === 0) return;

        try {
            // 1. Kategorien im Batch von der KI holen
            const headlines = articlesToEnrich.map(a => a.headline);
            const categories = await categorizeHeadlines(headlines);

            // 2. Inhalts-Scraping (muss weiterhin einzeln pro URL sein, aber wir machen es parallel)
            const contentPromises = articlesToEnrich.map(a => getFirstThreeSentences(a.url));
            const contentResults = await Promise.allSettled(contentPromises);

            // 3. Cache aktualisieren und State setzen
            const cacheUpdates: Record<string, { category: string, catcher: string }> = {};

            setArticles(prev => {
                const next = [...prev];
                articlesToEnrich.forEach((article, index) => {
                    const articleIndex = next.findIndex(a => a.id === article.id);
                    if (articleIndex !== -1) {
                        const category = categories[index] || 'Panorama';
                        let catcher = '';

                        if (contentResults[index].status === 'fulfilled') {
                            const val = (contentResults[index] as PromiseFulfilledResult<string | null>).value;
                            catcher = val || ''; // Leer lassen statt Fehlermeldung
                        } else {
                            catcher = '';
                        }

                        const update = { category, catcher };
                        cacheUpdates[article.id] = update;

                        next[articleIndex] = {
                            ...next[articleIndex],
                            ...update
                        };
                    }
                });
                return next;
            });

            // Batch-Save in LocalStorage
            saveBatchToCache(cacheUpdates);
        } catch (error: any) {
            addToast(`Batch-Fehler: ${error.message}`, 'KI-Fehler');
            console.error("General batch enrichment error", error);
        }
    };

    const enrichArticleSync = async (id: string, headline: string, url: string) => {
        // Zuerst Cache prüfen
        const cached = getCachedArticle(id);
        if (cached) {
            setArticles(prev => prev.map(a => a.id === id ? { ...a, category: cached.category, catcher: cached.catcher } : a));
            return;
        }

        try {
            // Wir führen sie parallel aus, aber fangen Fehler individuell ab
            const results = await Promise.allSettled([
                categorizeHeadline(headline),
                getFirstThreeSentences(url)
            ]);

            let category = 'Panorama';
            let catcher = '';

            if (results[0].status === 'fulfilled') {
                category = (results[0] as PromiseFulfilledResult<string>).value;
            } else {
                addToast(`${headline.substring(0, 30)}...: ${results[0].reason.message}`, 'KI-Fehler');
            }

            if (results[1].status === 'fulfilled') {
                const val = (results[1] as PromiseFulfilledResult<string | null>).value;
                catcher = val || '';
            } else {
                catcher = '';
            }

            // In Cache speichern
            saveToCache(id, category, catcher);

            setArticles(prev => prev.map(a => a.id === id ? { ...a, category, catcher } : a));
        } catch (error: any) {
            console.error("General enrichment error", error);
        }
    }

    const handleLike = (id: string, category: string) => {
        const isCurrentlyLiked = likedArticles.includes(id)
        let newLikedArticles: string[]
        let newLikedCategories: Record<string, number>

        if (isCurrentlyLiked) {
            newLikedArticles = likedArticles.filter(aid => aid !== id)
            newLikedCategories = { ...likedCategories, [category]: Math.max(0, (likedCategories[category] || 1) - 1) }
        } else {
            newLikedArticles = [...likedArticles, id]
            newLikedCategories = { ...likedCategories, [category]: (likedCategories[category] || 0) + 1 }
        }

        setLikedArticles(newLikedArticles)
        setLikedCategories(newLikedCategories)
        localStorage.setItem('lecta_liked_articles', JSON.stringify(newLikedArticles))
        localStorage.setItem('lecta_likes', JSON.stringify(newLikedCategories))
    }

    const getBackupCode = () => {
        const data = { likedCategories, likedArticles }
        return btoa(JSON.stringify(data))
    }

    const restoreFromCode = (code: string) => {
        try {
            const decoded = JSON.parse(atob(code))
            setLikedCategories(decoded.likedCategories || {})
            setLikedArticles(decoded.likedArticles || [])
            localStorage.setItem('lecta_likes', JSON.stringify(decoded.likedCategories))
            localStorage.setItem('lecta_liked_articles', JSON.stringify(decoded.likedArticles))
            alert('Profil erfolgreich wiederhergestellt!')
        } catch (e) {
            alert('Ungültiger Code!')
        }
    }

    const getSortedArticles = () => {
        let baseArticles = activeCategory === 'Alle'
            ? articles
            : articles.filter(a => a.category === activeCategory)

        if (activeCategory === 'Alle') {
            return [...baseArticles].sort((a, b) => {
                const scoreA = likedCategories[a.category] || 0
                const scoreB = likedCategories[b.category] || 0
                return scoreB - scoreA
            })
        }
        return baseArticles
    }

    return (
        <div
            className="app-container"
            data-theme={isDark ? 'dark' : 'light'}
            data-font={currentFont}
            style={{
                '--font-weight-main': fontWeight,
                '--text-transform': isAllCaps ? 'uppercase' : 'none'
            } as any}
        >
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            <AnimatePresence mode="wait">
                {loading && <LoadingScreen key="loader" progress={loadingProgress} />}
            </AnimatePresence>

            {!loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <Navbar
                        isDark={isDark}
                        onToggleDark={() => setIsDark(!isDark)}
                        onGetBackup={() => alert(`Dein Wiederherstellungs-Code:\n\n${getBackupCode()}`)}
                        onRestore={() => {
                            const code = prompt('Wiederherstellungs-Code eingeben:')
                            if (code) restoreFromCode(code)
                        }}
                        currentFont={currentFont}
                        onToggleFont={toggleFont}
                        fontWeight={fontWeight}
                        onWeightChange={(w) => {
                            setFontWeight(w);
                            localStorage.setItem('lecta_weight', w.toString());
                        }}
                        isAllCaps={isAllCaps}
                        onToggleCaps={() => {
                            const next = !isAllCaps;
                            setIsAllCaps(next);
                            localStorage.setItem('lecta_caps', next.toString());
                        }}
                    />
                    <main style={{ paddingTop: '70px' }}>
                        <CategoryFilter
                            activeCategory={activeCategory}
                            onCategoryChange={(cat) => {
                                setActiveCategory(cat);
                                window.scrollTo(0, 0);
                            }}
                        />
                        <Feed
                            articles={getSortedArticles()}
                            likedArticles={likedArticles}
                            onLike={handleLike}
                            onCategoryChange={(cat) => {
                                setActiveCategory(cat);
                                window.scrollTo(0, 0);
                            }}
                            onEnrich={enrichArticleSync}
                            onBatchEnrich={enrichArticlesBatch}
                            onLoadMoreFromSource={fetchMoreFromReddit}
                            isAnalyzingMore={isAnalyzingMore}
                        />
                    </main>
                </motion.div>
            )}
        </div>
    )
}

export default App
