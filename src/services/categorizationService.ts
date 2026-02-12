// Utility to escape regex special characters
const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export type RuleType = 'OR' | 'AND';

export interface FilterRule {
    id: string;
    category: string;
    type: RuleType;
    keywords: string[];
}

export const categories = ['All', 'Politics', 'Business', 'News', 'Sports', 'Culture', 'Tech', 'Health', 'Science', 'Lifestyle', 'Local'];

export const DEFAULT_RULES: FilterRule[] = [
    { id: '1', category: 'Politics', type: 'OR', keywords: ["immigration", "detention", 'government', 'parliament', 'election', 'minister', 'senate', 'congress', 'president', 'chancellor', 'party', 'coalition', 'legislation', 'law', 'bill', 'diplomat', 'policy', 'vote', 'campaign', 'opposition', 'democracy', 'referendum', 'epstein', 'trump'] },
    { id: '2', category: 'Business', type: 'OR', keywords: ['stock', 'MARKET', 'shares', 'corporation', 'company', 'CEO', 'profit', 'loss', 'revenue', 'GDP', 'inflation', 'recession', 'trade', 'export', 'import', 'investment', 'merger', 'acquisition', 'employment', 'unemployment', 'interest rate', 'central bank', 'economy', 'industry'] },
    { id: '3', category: 'News', type: 'OR', keywords: ['accident', 'incident', 'crime', 'police', 'court', 'trial', 'victim', 'witness', 'disaster', 'emergency', 'rescue', 'fire', 'flood', 'weather', 'community', 'people', 'daily life', 'society'] },
    { id: '4', category: 'Sports', type: 'OR', keywords: ['football', 'soccer', 'basketball', 'tennis', 'championship', 'league', 'tournament', 'match', 'game', 'player', 'athlete', 'coach', 'team', 'goal', 'score', 'win', 'defeat', 'Olympic', 'World Cup', 'medal', 'training'] },
    { id: '5', category: 'Culture', type: 'OR', keywords: ['art', 'artist', 'exhibition', 'museum', 'theater', 'film', 'movie', 'cinema', 'actor', 'director', 'music', 'concert', 'festival', 'book', 'author', 'literature', 'performance', 'culture', 'heritage', 'gallery'] },
    { id: '6', category: 'Tech', type: 'OR', keywords: ['software', 'hardware', 'smartphone', 'app', 'digital', 'internet', 'computer', 'AI', 'artificial intelligence', 'data', 'cybersecurity', 'innovation', 'startup', 'tech company', 'platform', 'cloud', 'algorithm', 'programming', 'device'] },
    { id: '7', category: 'Health', type: 'OR', keywords: ['hospital', 'doctor', 'patient', 'disease', 'treatment', 'medical', 'medicine', 'vaccine', 'virus', 'pandemic', 'healthcare', 'clinic', 'surgery', 'therapy', 'mental health', 'diagnosis', 'symptoms', 'pharmaceutical', 'prevention'] },
    { id: '8', category: 'Science', type: 'OR', keywords: ['research', 'study', 'scientist', 'university', 'laboratory', 'discovery', 'experiment', 'theory', 'climate', 'environment', 'space', 'NASA', 'physics', 'chemistry', 'biology', 'data', 'findings', 'journal', 'publication'] },
    { id: '9', category: 'Lifestyle', type: 'OR', keywords: ['fashion', 'beauty', 'travel', 'food', 'recipe', 'wellness', 'fitness', 'home', 'design', 'shopping', 'trends', 'style', 'relationship', 'family', 'parenting', 'hobby', 'leisure'] },
    { id: '10', category: 'Local', type: 'OR', keywords: ['city council', 'mayor', 'neighborhood', 'district', 'local community', 'town', 'municipal', 'regional', 'resident', 'downtown', 'suburb', 'county', 'township', 'borough'] }
];

export const getStoredRules = (): FilterRule[] => {
    try {
        const saved = localStorage.getItem('kairos_filter_rules');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {
        console.error("Filter rules parse error:", e);
    }
    return DEFAULT_RULES;
};

export const saveRules = (rules: FilterRule[]) => {
    localStorage.setItem('kairos_filter_rules', JSON.stringify(rules));
};

export const categorizeHeadlineLocal = (headline: string, customRules?: FilterRule[]): string => {
    if (!headline) return 'News';

    const lowerHeadline = headline.toLowerCase();
    const rules = customRules || DEFAULT_RULES;

    if (!Array.isArray(rules)) return 'News';

    for (const rule of rules) {
        if (!rule || !rule.keywords || !Array.isArray(rule.keywords)) continue;

        if (rule.type === 'OR') {
            for (const keyword of rule.keywords) {
                if (!keyword) continue;
                try {
                    const escapedKeyword = escapeRegExp(keyword.toLowerCase());
                    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
                    if (regex.test(lowerHeadline)) {
                        return rule.category;
                    }
                } catch (e) {
                    console.error("Invalid regex for keyword:", keyword);
                }
            }
        } else if (rule.type === 'AND') {
            const validKeywords = rule.keywords.filter(k => !!k);
            if (validKeywords.length === 0) continue;

            try {
                const allMatch = validKeywords.every(keyword => {
                    const escapedKeyword = escapeRegExp(keyword.toLowerCase());
                    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
                    return regex.test(lowerHeadline);
                });
                if (allMatch) {
                    return rule.category;
                }
            } catch (e) {
                console.error("Invalid regex in AND rule:", rule.keywords);
            }
        }
    }

    return 'News';
};

export const categorizeHeadlinesLocal = (headlines: string[], customRules?: FilterRule[]): string[] => {
    const rules = customRules || getStoredRules();
    return headlines.map(h => categorizeHeadlineLocal(h, rules));
};
