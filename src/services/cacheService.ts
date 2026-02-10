
interface CachedArticle {
    category: string;
    catcher: string;
    timestamp: number;
}

const CACHE_KEY = 'lecta_article_cache';
const CACHE_EXPIRY = 1000 * 60 * 60 * 24 * 7; // 7 Tage Gültigkeit

let articleCache: Record<string, CachedArticle> = {};

// Cache beim Start laden
try {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
        articleCache = JSON.parse(saved);

        // Aufräumen: Alte Einträge entfernen
        const now = Date.now();
        let cleaned = false;
        Object.keys(articleCache).forEach(id => {
            if (now - articleCache[id].timestamp > CACHE_EXPIRY) {
                delete articleCache[id];
                cleaned = true;
            }
        });
        if (cleaned) {
            localStorage.setItem(CACHE_KEY, JSON.stringify(articleCache));
        }
    }
} catch (e) {
    console.error("Fehler beim Laden des Caches", e);
}

export const getCachedArticle = (id: string) => {
    return articleCache[id] || null;
};

export const saveToCache = (id: string, category: string, catcher: string) => {
    articleCache[id] = {
        category,
        catcher,
        timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(articleCache));
};

export const saveBatchToCache = (results: Record<string, { category: string, catcher: string }>) => {
    const now = Date.now();
    Object.entries(results).forEach(([id, data]) => {
        articleCache[id] = {
            ...data,
            timestamp: now
        };
    });
    localStorage.setItem(CACHE_KEY, JSON.stringify(articleCache));
};
