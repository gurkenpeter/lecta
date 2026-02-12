export default async function handler(req, res) {
    const { after } = req.query;
    const url = after
        ? `https://www.reddit.com/r/news.json?limit=40&raw_json=1&after=${after}`
        : `https://www.reddit.com/r/news.json?limit=40&raw_json=1`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'web:kairosnews:v1.0 (by /u/kairosnews_dev)'
            }
        });

        if (!response.ok) {
            throw new Error(`Reddit API responded with ${response.status}`);
        }

        const data = await response.json();

        // Cache for 5 minutes to be polite to Reddit
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        res.status(200).json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Failed to fetch news', details: error.message });
    }
}
