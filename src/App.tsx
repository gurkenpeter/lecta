import { useState, useEffect, useCallback } from 'react'
import { Navbar } from './components/Navbar'
import { CategoryFilter } from './components/CategoryFilter'
import { Feed } from './components/Feed'
import { LoadingScreen } from './components/LoadingScreen'
import { ToastContainer, ToastMessage } from './components/ToastContainer'
import { MobileBottomNav } from './components/MobileBottomNav'
import { MobileSettingsSheet } from './components/MobileSettingsSheet'
import { Article } from './data/mockArticles'
import { fetchRedditNews } from './services/redditService'
import { categorizeHeadlineLocal, categorizeHeadlinesLocal } from './services/categorizationService'
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
    const [currentFont, setCurrentFont] = useState<'serif' | 'sans'>('serif')
    const [fontWeight, setFontWeight] = useState<number>(500)
    const [isAllCaps, setIsAllCaps] = useState<boolean>(true)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const [showMobileSettings, setShowMobileSettings] = useState(false)
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

                // Alles sofort kategorisieren (da lokal & synchron)
                const fullyProcessed = processedArticles.map((a: Article) => {
                    if (a.category === 'Laden...' || a.category === 'Panorama') {
                        return { ...a, category: categorizeHeadlineLocal(a.headline) };
                    }
                    return a;
                });

                setArticles(fullyProcessed);
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

        const handleResize = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', handleResize)

        loadInitialData()
        return () => window.removeEventListener('resize', handleResize)
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
        if (isFetchingMore || !after) return;
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

            // Sofort lokal kategorisieren
            const fullyProcessed = processed.map((a: Article) => ({
                ...a,
                category: categorizeHeadlineLocal(a.headline)
            }));

            setArticles(prev => [...prev, ...fullyProcessed]);
        } catch (error) {
            console.error("Fehler beim Nachladen von Reddit", error);
        } finally {
            setIsFetchingMore(false);
        }
    };

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
                    {!isMobile && (
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
                    )}

                    {isMobile && (
                        <div style={{
                            position: 'fixed', top: 0, left: 0, right: 0, height: 'var(--navbar-height)',
                            backgroundColor: 'var(--bg-color)', zIndex: 1000, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', borderBottom: '1px solid var(--divider-color)'
                        }}>
                            <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>LECTA</div>
                        </div>
                    )}

                    <main style={{ paddingTop: 'var(--navbar-height)', paddingBottom: isMobile ? '80px' : 0 }}>
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
                            onLoadMoreFromSource={fetchMoreFromReddit}
                        />
                    </main>

                    {isMobile && (
                        <MobileBottomNav
                            onOpenSettings={() => setShowMobileSettings(true)}
                            activeCategory={activeCategory}
                            onResetCategory={() => setActiveCategory('Alle')}
                        />
                    )}

                    <MobileSettingsSheet
                        isOpen={showMobileSettings}
                        onClose={() => setShowMobileSettings(false)}
                        isDark={isDark}
                        onToggleDark={() => setIsDark(!isDark)}
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
                        onGetBackup={() => alert(`Dein Wiederherstellungs-Code:\n\n${getBackupCode()}`)}
                        onRestore={() => {
                            const code = prompt('Wiederherstellungs-Code eingeben:')
                            if (code) restoreFromCode(code)
                        }}
                    />
                </motion.div>
            )}
        </div>
    )
}

export default App
