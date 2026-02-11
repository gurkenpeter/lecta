// Native fetch has better compatibility in some strict mobile environments
import { Article } from '../data/mockArticles';

const REDDIT_NEWS_URL = 'https://www.reddit.com/r/news.json';

export const fetchRedditNews = async (after?: string): Promise<{ articles: Article[], nextAfter: string | null }> => {
    try {
        const url = new URL('https://www.reddit.com/r/news.json');
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
    } catch (error: any) {
        console.error('Fetch error:', error);
        throw error;
    }
};
