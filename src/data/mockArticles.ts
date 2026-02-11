export interface Article {
    id: string;
    source: string;
    headline: string;
    catcher: string;
    category: string;
    imageUrl: string;
    timestamp: string;
    url: string;
}

export const categories = ['All', 'Politics', 'Business', 'News', 'Sports', 'Culture', 'Tech', 'Health', 'Science', 'Lifestyle', 'Local'];

export const categoryColors: Record<string, string> = {
    'Politics': '#ef4444',
    'Business': '#06b6d4',
    'News': '#8b5cf6',
    'Sports': '#3b82f6',
    'Culture': '#ec4899',
    'Tech': '#10b981',
    'Health': '#f43f5e',
    'Science': '#6366f1',
    'Lifestyle': '#f59e0b',
    'Local': '#78350f',
    'All': '#000000'
};

export const mockArticles: Article[] = [
    {
        id: '1',
        source: 'TechDaily',
        headline: 'The Future of AI is Here',
        catcher: 'How generative models will radically transform our daily lives over the next five years.',
        category: 'Tech',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
        timestamp: '2h ago',
        url: 'https://example.com/1'
    },
    {
        id: '2',
        source: 'EcoWorld',
        headline: 'Solar Energy Breaks Records',
        catcher: 'Why photovoltaic expansion is progressing faster than experts predicted.',
        category: 'Science',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800',
        timestamp: '4h ago',
        url: 'https://example.com/2'
    },
    {
        id: '3',
        source: 'Lifestyle Mag',
        headline: 'Minimalism in the Home Office',
        catcher: 'Less distraction, more focus: How to design your workspace for maximum productivity.',
        category: 'Lifestyle',
        imageUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800',
        timestamp: '6h ago',
        url: 'https://example.com/3'
    },
    {
        id: '4',
        source: 'Global Politics',
        headline: 'New Trade Agreements Signed',
        catcher: 'What recent treaties mean for the European economy and the global market.',
        category: 'Politics',
        imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800',
        timestamp: '8h ago',
        url: 'https://example.com/4'
    },
    {
        id: '5',
        source: 'Health Hub',
        headline: 'The Magic of Sleep',
        catcher: 'New studies show how vital deep sleep phases really are for our cognitive regeneration.',
        category: 'Health',
        imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800',
        timestamp: '10h ago',
        url: 'https://example.com/5'
    },
    {
        id: '6',
        source: 'Future Finance',
        headline: 'Bitcoin Reaches New All-Time High',
        catcher: 'Analysts discuss whether this is the start of a new bull market or a speculative bubble.',
        category: 'Business',
        imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800',
        timestamp: '12h ago',
        url: 'https://example.com/6'
    }
];
