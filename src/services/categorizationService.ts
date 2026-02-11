export type RuleType = 'OR' | 'AND';

export interface FilterRule {
    id: string;
    category: string;
    type: RuleType;
    keywords: string[];
}

// Standard-Regeln (ehemals die statische Liste)
const DEFAULT_RULES: FilterRule[] = [
    { id: '1', category: 'Politik', type: 'OR', keywords: ['government', 'parliament', 'election', 'minister', 'senate', 'congress', 'president', 'chancellor', 'party', 'coalition', 'legislation', 'law', 'bill', 'diplomat', 'policy', 'vote', 'campaign', 'opposition', 'democracy', 'referendum', 'epstein', 'trump'] },
    { id: '2', category: 'Wirtschaft', type: 'OR', keywords: ['stock', 'MARKET', 'shares', 'corporation', 'company', 'CEO', 'profit', 'loss', 'revenue', 'GDP', 'inflation', 'recession', 'trade', 'export', 'import', 'investment', 'merger', 'acquisition', 'employment', 'unemployment', 'interest rate', 'central bank', 'economy', 'industry'] },
    { id: '3', category: 'Panorama', type: 'OR', keywords: ['accident', 'incident', 'crime', 'police', 'court', 'trial', 'victim', 'witness', 'disaster', 'emergency', 'rescue', 'fire', 'flood', 'weather', 'community', 'people', 'daily life', 'society'] },
    { id: '4', category: 'Sport', type: 'OR', keywords: ['football', 'soccer', 'basketball', 'tennis', 'championship', 'league', 'tournament', 'match', 'game', 'player', 'athlete', 'coach', 'team', 'goal', 'score', 'win', 'defeat', 'Olympic', 'World Cup', 'medal', 'training'] },
    { id: '5', category: 'Kultur', type: 'OR', keywords: ['art', 'artist', 'exhibition', 'museum', 'theater', 'film', 'movie', 'cinema', 'actor', 'director', 'music', 'concert', 'festival', 'book', 'author', 'literature', 'performance', 'culture', 'heritage', 'gallery'] },
    { id: '6', category: 'Technik', type: 'OR', keywords: ['software', 'hardware', 'smartphone', 'app', 'digital', 'internet', 'computer', 'AI', 'artificial intelligence', 'data', 'cybersecurity', 'innovation', 'startup', 'tech company', 'platform', 'cloud', 'algorithm', 'programming', 'device'] },
    { id: '7', category: 'Gesundheit', type: 'OR', keywords: ['hospital', 'doctor', 'patient', 'disease', 'treatment', 'medical', 'medicine', 'vaccine', 'virus', 'pandemic', 'healthcare', 'clinic', 'surgery', 'therapy', 'mental health', 'diagnosis', 'symptoms', 'pharmaceutical', 'prevention'] },
    { id: '8', category: 'Wissenschaft', type: 'OR', keywords: ['research', 'study', 'scientist', 'university', 'laboratory', 'discovery', 'experiment', 'theory', 'climate', 'environment', 'space', 'NASA', 'physics', 'chemistry', 'biology', 'data', 'findings', 'journal', 'publication'] },
    { id: '9', category: 'Lifestyle', type: 'OR', keywords: ['fashion', 'beauty', 'travel', 'food', 'recipe', 'wellness', 'fitness', 'home', 'design', 'shopping', 'trends', 'style', 'relationship', 'family', 'parenting', 'hobby', 'leisure'] },
    { id: '10', category: 'Lokales', type: 'OR', keywords: ['city council', 'mayor', 'neighborhood', 'district', 'local community', 'town', 'municipal', 'regional', 'resident', 'downtown', 'suburb', 'county', 'township', 'borough'] }
];

export const getStoredRules = (): FilterRule[] => {
    const saved = localStorage.getItem('lecta_filter_rules');
    if (saved) return JSON.parse(saved);
    return DEFAULT_RULES;
};

export const saveRules = (rules: FilterRule[]) => {
    localStorage.setItem('lecta_filter_rules', JSON.stringify(rules));
};

export const categorizeHeadlineLocal = (headline: string, customRules?: FilterRule[]): string => {
    const lowerHeadline = headline.toLowerCase();
    const rules = customRules || getStoredRules();

    for (const rule of rules) {
        if (rule.type === 'OR') {
            // OR Logik: Eines der Keywords muss vorkommen
            for (const keyword of rule.keywords) {
                const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i');
                if (regex.test(lowerHeadline)) {
                    return rule.category;
                }
            }
        } else if (rule.type === 'AND') {
            // AND Logik: ALLE Keywords müssen vorkommen
            const allMatch = rule.keywords.every(keyword => {
                const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i');
                return regex.test(lowerHeadline);
            });
            if (allMatch && rule.keywords.length > 0) {
                return rule.category;
            }
        }
    }

    return 'Panorama';
};

export const categorizeHeadlinesLocal = (headlines: string[], customRules?: FilterRule[]): string[] => {
    const rules = customRules || getStoredRules();
    return headlines.map(h => categorizeHeadlineLocal(h, rules));
};
