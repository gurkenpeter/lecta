// Native fetch has better compatibility in some strict mobile environments
import { Article } from '../data/mockArticles';

const FALLBACK_URL = 'https://lectanews.vercel.app/';

export const fetchRedditNews = async (after?: string): Promise<{ articles: Article[], nextAfter: string | null }> => {
    const fetchFromUrl = async (targetUrl: string, isFallback: boolean = false) => {
        const url = new URL(targetUrl);
        if (after) url.searchParams.append('after', after);
        url.searchParams.append('limit', '40');
        url.searchParams.append('raw_json', '1');

        const response = await fetch(url.toString(), {
            method: 'GET',
            mode: 'cors',
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.data || !data.data.children) {
            return { articles: [], nextAfter: null };
        }

        const children = data.data.children;
        const nextAfter = data.data.after;

        const articles = children.map((child: any) => {
            const articleData = child.data;
            if (!articleData) return null;

            return {
                id: articleData.id,
                source: articleData.domain || 'Reddit',
                headline: articleData.title || 'Untitled',
                catcher: articleData.selftext || '',
                category: 'News',
                url: articleData.url,
                imageUrl: articleData.thumbnail && articleData.thumbnail.startsWith('http')
                    ? articleData.thumbnail
                    : `https://picsum.photos/seed/${articleData.id}/800/600`,
                timestamp: articleData.created_utc
                    ? new Date(articleData.created_utc * 1000).toLocaleDateString('en-US')
                    : 'Unknown',
            };
        }).filter((a: any) => a !== null) as Article[];

        return { articles, nextAfter };
    };

    try {
        // Try Primary Reddit URL first
        return await fetchFromUrl('https://www.reddit.com/r/news.json');
    } catch (primaryError) {
        console.warn('Primary fetch failed, trying fallback...', primaryError);
        try {
            // Try Fallback URL
            return await fetchFromUrl(FALLBACK_URL, true);
        } catch (fallbackError) {
            console.error('Fallback fetch also failed:', fallbackError);
            throw fallbackError;
        }
    }
};
