import axios from 'axios';
import { Article } from '../data/mockArticles';

const REDDIT_NEWS_URL = 'https://www.reddit.com/r/news.json';

export const fetchRedditNews = async (after?: string): Promise<{ articles: Article[], nextAfter: string | null }> => {
    try {
        const url = after ? `${REDDIT_NEWS_URL}?after=${after}` : REDDIT_NEWS_URL;
        const response = await axios.get(url);
        const children = response.data.data.children;
        const nextAfter = response.data.data.after;

        const articles = children.map((child: any) => {
            const data = child.data;

            return {
                id: data.id,
                source: data.domain || 'Reddit',
                headline: data.title,
                catcher: 'Inhalt wird geladen...',
                category: 'Laden...',
                url: data.url,
                imageUrl: data.thumbnail && data.thumbnail.startsWith('http')
                    ? data.thumbnail
                    : `https://picsum.photos/seed/${data.id}/800/600`,
                timestamp: new Date(data.created_utc * 1000).toLocaleDateString('de-DE'),
            };
        });

        return { articles, nextAfter };
    } catch (error) {
        console.error('Fehler beim Abrufen der Reddit-News:', error);
        return { articles: [], nextAfter: null };
    }
};
