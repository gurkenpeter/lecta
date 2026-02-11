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
import { categorizeHeadlineLocal } from './services/categorizationService'
import { getCachedArticle, saveToCache } from './services/cacheService'
import { AnimatePresence, motion } from 'framer-motion'

function App() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingProgress, setLoadingProgress] = useState('Loading data...')
    const [activeCategory, setActiveCategory] = useState('All')
    const [isDark, setIsDark] = useState(false)
    const [likedArticles, setLikedArticles] = useState<string[]>([])
    const [likedCategories, setLikedCategories] = useState<Record<string, number>>({})
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
        const timestamp = Date.now();

        setToasts(prev => {
            const existing = prev.find(t => t.message === message && t.type === type);
            if (existing) {
                return prev.map(t =>
                    t.id === existing.id
                        ? { ...t, count: (t.count || 1) + 1, timestamp }
                        : t
                );
            }
            return [...prev, { id, title, message, type, count: 1, timestamp }];
        });
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const savedLiked = localStorage.getItem('lecta_liked')
        const savedCategories = localStorage.getItem('lecta_categories')
        const savedTheme = localStorage.getItem('lecta_theme')
        const savedFont = localStorage.getItem('lecta_font')
        const savedWeight = localStorage.getItem('lecta_weight')
        const savedCaps = localStorage.getItem('lecta_caps')

        try {
            if (savedLiked) setLikedArticles(JSON.parse(savedLiked))
            if (savedCategories) setLikedCategories(JSON.parse(savedCategories))
        } catch (e) {
            console.error("Error restoring liked articles/categories:", e);
        }

        if (savedTheme) setIsDark(savedTheme === 'dark')
        if (savedFont) setCurrentFont(savedFont as 'serif' | 'sans')
        if (savedWeight) setFontWeight(parseInt(savedWeight) || 500)
        if (savedCaps) setIsAllCaps(savedCaps === 'true')

        const loadData = async () => {
            try {
                setLoadingProgress('Fetching news...');
                const { articles: redditArticles, nextAfter } = await fetchRedditNews();

                if (!redditArticles || redditArticles.length === 0) {
                    addToast('No articles received.', 'Info', 'info');
                    setArticles([]);
                    setLoading(false);
                    return;
                }

                setAfter(nextAfter);

                const processedArticles = redditArticles.map((article: Article) => {
                    const cached = getCachedArticle(article.id);
                    if (cached) {
                        return { ...article, category: cached.category, catcher: cached.catcher };
                    }
                    return article;
                });

                // Sofort lokal kategorisieren
                const fullyProcessed = processedArticles.map((a: Article) => ({
                    ...a,
                    category: categorizeHeadlineLocal(a.headline)
                }));

                setArticles(fullyProcessed);
                setLoading(false)
            } catch (err: any) {
                console.error("Critical load error:", err);
                addToast(err.message || 'An unknown error occurred', 'Load Error');
                setLoading(false)
            }
        }
        loadData()
    }, [addToast])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
        localStorage.setItem('lecta_theme', isDark ? 'dark' : 'light')
    }, [isDark])

    const toggleFont = () => {
        const next = currentFont === 'serif' ? 'sans' : 'serif'
        setCurrentFont(next)
        localStorage.setItem('lecta_font', next)
    }

    useEffect(() => {
        document.documentElement.setAttribute('data-font', currentFont);
    }, [currentFont]);

    useEffect(() => {
        document.documentElement.style.setProperty('--font-weight-main', fontWeight.toString());
    }, [fontWeight]);

    useEffect(() => {
        document.documentElement.style.setProperty('--text-transform', isAllCaps ? 'uppercase' : 'none');
    }, [isAllCaps]);

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
            console.error("Error loading more news", error);
        } finally {
            setIsFetchingMore(false);
        }
    };

    const refreshCategories = useCallback(() => {
        setArticles(prev => prev.map(a => ({
            ...a,
            category: categorizeHeadlineLocal(a.headline)
        })));
    }, []);

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
        localStorage.setItem('lecta_liked', JSON.stringify(newLikedArticles))
        localStorage.setItem('lecta_categories', JSON.stringify(newLikedCategories))
    }

    const getSortedArticles = () => {
        let filtered = activeCategory === 'All'
            ? articles
            : articles.filter(a => a.category === activeCategory)

        if (activeCategory === 'Alle' && Object.keys(likedCategories).length > 0) {
            return [...filtered].sort((a, b) => {
                const scoreA = likedCategories[a.category] || 0
                const scoreB = likedCategories[b.category] || 0
                return scoreB - scoreA
            })
        }
        return filtered
    }

    const getBackupCode = () => {
        const data = {
            liked: likedArticles,
            categories: likedCategories,
            theme: isDark ? 'dark' : 'light',
            font: currentFont,
            weight: fontWeight,
            caps: isAllCaps
        }
        return btoa(JSON.stringify(data))
    }

    const restoreFromCode = (code: string) => {
        try {
            const data = JSON.parse(atob(code))
            if (data.liked) setLikedArticles(data.liked)
            if (data.categories) setLikedCategories(data.categories)
            if (data.theme) setIsDark(data.theme === 'dark')
            if (data.font) setCurrentFont(data.font)
            if (data.weight) setFontWeight(data.weight)
            if (data.caps) setIsAllCaps(data.caps)
            addToast('Profile successfully restored!', 'Success', 'info')
        } catch (e) {
            addToast('Invalid backup code', 'Error')
        }
    }

    return (
        <div className="app-container">
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {loading ? (
                <LoadingScreen progress={loadingProgress} />
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {!isMobile && (
                        <Navbar
                            isDark={isDark}
                            onToggleDark={() => setIsDark(!isDark)}
                            onGetBackup={() => alert(`Your backup code:\n\n${getBackupCode()}`)}
                            onRestore={() => {
                                const code = prompt('Enter backup code:')
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
                            onResetCategory={() => setActiveCategory('All')}
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
                        onGetBackup={() => alert(`Your backup code:\n\n${getBackupCode()}`)}
                        onRestore={() => {
                            const code = prompt('Enter backup code:')
                            if (code) restoreFromCode(code)
                        }}
                    />
                </motion.div>
            )}
        </div>
    )
}

export default App
