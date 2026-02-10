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

export const categories = ['Alle', 'Politik', 'Wirtschaft', 'Panorama', 'Sport', 'Kultur', 'Technik', 'Gesundheit', 'Wissenschaft', 'Lifestyle', 'Lokales'];

export const categoryColors: Record<string, string> = {
    'Politik': '#ef4444',
    'Wirtschaft': '#06b6d4',
    'Panorama': '#8b5cf6',
    'Sport': '#3b82f6',
    'Kultur': '#ec4899',
    'Technik': '#10b981',
    'Gesundheit': '#f43f5e',
    'Wissenschaft': '#6366f1',
    'Lifestyle': '#f59e0b',
    'Lokales': '#78350f',
    'Alle': '#000000'
};

export const mockArticles: Article[] = [
    {
        id: '1',
        source: 'TechDaily',
        headline: 'Die Zukunft der KI ist da',
        catcher: 'Wie generative Modelle unseren Alltag in den nächsten fünf Jahren radikal verändern werden.',
        category: 'Technik',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
        timestamp: 'Vor 2 Std.',
        url: 'https://example.com/1'
    },
    {
        id: '2',
        source: 'EcoWorld',
        headline: 'Solarenergie bricht Rekorde',
        catcher: 'Warum der Ausbau von Photovoltaik schneller voranschreitet als von Experten vorhergesagt.',
        category: 'Umwelt',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800',
        timestamp: 'Vor 4 Std.',
        url: 'https://example.com/2'
    },
    {
        id: '3',
        source: 'Lifestyle Mag',
        headline: 'Minimalismus im Home Office',
        catcher: 'Weniger Ablenkung, mehr Fokus: So gestaltest du deinen Arbeitsplatz für maximale produktivität.',
        category: 'Lifestyle',
        imageUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800',
        timestamp: 'Vor 6 Std.',
        url: 'https://example.com/3'
    },
    {
        id: '4',
        source: 'Global Politics',
        headline: 'Neue Handelsabkommen unterzeichnet',
        catcher: 'Was die neuesten Verträge für die europäische Wirtschaft und den globalen Markt bedeuten.',
        category: 'Politik',
        imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800',
        timestamp: 'Vor 8 Std.',
        url: 'https://example.com/4'
    },
    {
        id: '5',
        source: 'Health Hub',
        headline: 'Die Magie des Schlafes',
        catcher: 'Neue Studien zeigen, wie wichtig die Tiefschlafphase für unsere kognitive Regeneration wirklich ist.',
        category: 'Gesundheit',
        imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800',
        timestamp: 'Vor 10 Std.',
        url: 'https://example.com/5'
    },
    {
        id: '6',
        source: 'Future Finance',
        headline: 'Bitcoin erreicht neues Allzeithoch',
        catcher: 'Analysten diskutieren, ob dies der Beginn eines neuen Bullenmarktes oder eine Spekulationsblase ist.',
        category: 'Wirtschaft',
        imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800',
        timestamp: 'Vor 12 Std.',
        url: 'https://example.com/6'
    }
];
