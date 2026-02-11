
interface CachedArticle {
    category: string;
    catcher: string;
    timestamp: number;
}

const CACHE_KEY = 'lecta_article_cache';
const CACHE_EXPIRY = 1000 * 60 * 60 * 24 * 7; // 7 days validity

let articleCache: Record<string, CachedArticle> = {};

// Load cache on start
const loadInitialCache = () => {
    try {
        const saved = localStorage.getItem(CACHE_KEY);
        if (saved) {
            articleCache = JSON.parse(saved);

            // Cleanup: Remove old entries
            const now = Date.now();
            let cleaned = false;
            Object.keys(articleCache).forEach(id => {
                if (now - articleCache[id].timestamp > CACHE_EXPIRY) {
                    delete articleCache[id];
                    cleaned = true;
                }
            });
            if (cleaned) {
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify(articleCache));
                } catch (e) { /* ignore quota errors */ }
            }
        }
    } catch (e) {
        console.error("Error loading cache", e);
    }
};

loadInitialCache();

export const getCachedArticle = (id: string) => {
    return articleCache[id] || null;
};

export const saveToCache = (id: string, category: string, catcher: string) => {
    articleCache[id] = {
        category,
        catcher,
        timestamp: Date.now()
    };
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(articleCache));
    } catch (e) {
        console.warn("Could not save to localStorage (quota exceeded or access denied)");
    }
};

export const saveBatchToCache = (results: Record<string, { category: string, catcher: string }>) => {
    const now = Date.now();
    Object.entries(results).forEach(([id, data]) => {
        articleCache[id] = {
            ...data,
            timestamp: now
        };
    });
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(articleCache));
    } catch (e) {
        console.warn("Could not save batch to localStorage");
    }
};
