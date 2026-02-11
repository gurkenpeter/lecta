import axios from 'axios';
import { Article } from '../data/mockArticles';

const REDDIT_NEWS_URL = 'https://www.reddit.com/r/news.json';

export const fetchRedditNews = async (after?: string): Promise<{ articles: Article[], nextAfter: string | null }> => {
    try {
        const url = after ? `${REDDIT_NEWS_URL}?after=${after}` : REDDIT_NEWS_URL;
        const response = await axios.get(url, {
            timeout: 10000, // 10 Sekunden Timeout
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.data || !response.data.data || !response.data.data.children) {
            console.error('Ungültige Reddit-API-Struktur:', response.data);
            return { articles: [], nextAfter: null };
        }

        const children = response.data.data.children;
        const nextAfter = response.data.data.after;

        const articles = children.map((child: any) => {
            const data = child.data;
            if (!data) return null;

            return {
                id: data.id,
                source: data.domain || 'Reddit',
                headline: data.title || 'Ohne Titel',
                catcher: data.selftext || '',
                category: 'Panorama',
                url: data.url,
                imageUrl: data.thumbnail && data.thumbnail.startsWith('http')
                    ? data.thumbnail
                    : `https://picsum.photos/seed/${data.id}/800/600`,
                timestamp: data.created_utc
                    ? new Date(data.created_utc * 1000).toLocaleDateString('de-DE')
                    : 'Unbekannt',
            };
        }).filter((a: any) => a !== null) as Article[];

        return { articles, nextAfter };
    } catch (error: any) {
        console.error('Detaillierter Reddit-Fehler:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        return { articles: [], nextAfter: null };
    }
};
