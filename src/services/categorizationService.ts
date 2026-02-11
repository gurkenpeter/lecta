const categoryKeywords: Record<string, string[]> = {
    'Politik': [
        'government', 'parliament', 'election', 'minister', 'senate', 'congress',
        'president', 'chancellor', 'party', 'coalition', 'legislation', 'law',
        'bill', 'diplomat', 'policy', 'vote', 'campaign', 'opposition', 'democracy', 'referendum', "epstein", "trump"
    ],
    'Wirtschaft': [
        'stock', 'MARKET', 'shares', 'corporation', 'company', 'CEO', 'profit', 'loss',
        'revenue', 'GDP', 'inflation', 'recession', 'trade', 'export', 'import',
        'investment', 'merger', 'acquisition', 'employment', 'unemployment',
        'interest rate', 'central bank', 'economy', 'industry'
    ],
    'Panorama': [
        'accident', 'incident', 'crime', 'police', 'court', 'trial', 'victim',
        'witness', 'disaster', 'emergency', 'rescue', 'fire', 'flood', 'weather',
        'community', 'people', 'daily life', 'society',
    ],
    'Sport': [
        'football', 'soccer', 'basketball', 'tennis', 'championship', 'league',
        'tournament', 'match', 'game', 'player', 'athlete', 'coach', 'team',
        'goal', 'score', 'win', 'defeat', 'Olympic', 'World Cup', 'medal', 'training'
    ],
    'Kultur': [
        'art', 'artist', 'exhibition', 'museum', 'theater', 'film', 'movie', 'cinema',
        'actor', 'director', 'music', 'concert', 'festival', 'book', 'author',
        'literature', 'performance', 'culture', 'heritage', 'gallery'
    ],
    'Technik': [
        'software', 'hardware', 'smartphone', 'app', 'digital', 'internet', 'computer',
        'AI', 'artificial intelligence', 'data', 'cybersecurity', 'innovation',
        'startup', 'tech company', 'platform', 'cloud', 'algorithm', 'programming', 'device'
    ],
    'Gesundheit': [
        'hospital', 'doctor', 'patient', 'disease', 'treatment', 'medical', 'medicine',
        'vaccine', 'virus', 'pandemic', 'healthcare', 'clinic', 'surgery', 'therapy',
        'mental health', 'diagnosis', 'symptoms', 'pharmaceutical', 'prevention'
    ],
    'Wissenschaft': [
        'research', 'study', 'scientist', 'university', 'laboratory', 'discovery',
        'experiment', 'theory', 'climate', 'environment', 'space', 'NASA', 'physics',
        'chemistry', 'biology', 'data', 'findings', 'journal', 'publication'
    ],
    'Lifestyle': [
        'fashion', 'beauty', 'travel', 'food', 'recipe', 'wellness', 'fitness',
        'home', 'design', 'shopping', 'trends', 'style', 'relationship', 'family',
        'parenting', 'hobby', 'leisure'
    ],
    'Lokales': [
        'city council', 'mayor', 'neighborhood', 'district', 'local community',
        'town', 'municipal', 'regional', 'resident', 'downtown', 'suburb',
        'county', 'township', 'borough'
    ]
};

export const categorizeHeadlineLocal = (headline: string): string => {
    const lowerHeadline = headline.toLowerCase();

    // Wir priorisieren die Kategorien in der Reihenfolge der Definition
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        for (const keyword of keywords) {
            // Regex mit Word Borders (\b) um "Art" in "Start" (False Positives) zu vermeiden
            const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i');
            if (regex.test(lowerHeadline)) {
                return category;
            }
        }
    }

    return 'Panorama';
};

export const categorizeHeadlinesLocal = (headlines: string[]): string[] => {
    return headlines.map(categorizeHeadlineLocal);
};
