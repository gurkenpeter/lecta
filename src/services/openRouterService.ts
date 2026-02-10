import axios from 'axios';
import { categories as ALL_CATEGORIES } from '../data/mockArticles';

const OPENROUTER_API_KEY = (import.meta as any).env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const CATEGORIES = ALL_CATEGORIES.filter(c => c !== 'Alle');

export const categorizeHeadline = async (headline: string): Promise<string> => {
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'dein_key_hier') {
        return 'Panorama';
    }

    let retries = 0;
    const maxRetries = 1;

    while (retries <= maxRetries) {
        try {
            const response = await axios.post(
                OPENROUTER_URL,
                {
                    model: 'nvidia/nemotron-3-nano-30b-a3b:free',
                    messages: [
                        {
                            role: 'system',
                            content: `Du bist ein Klassifizierer für News-Überschriften. 
                            Antworte NUR mit genau einem Wort aus dieser Liste: ${CATEGORIES.join(', ')}.
                            Keine Erklärung, kein Satz, nur das Wort.`,
                        },
                        {
                            role: 'user',
                            content: `Überschrift: "${headline}"\nKategorie:`,
                        },
                    ],
                    temperature: 0.1, // Sehr niedrige Temperatur für präzise Ergebnisse
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                        'HTTP-Referer': 'http://localhost:5173',
                        'X-Title': 'Lecta App',
                        'Content-Type': 'application/json',
                    },
                }
            );

            const rawCategory = response.data.choices[0].message.content.trim().replace(/[.!?]/g, '');

            // Wir suchen nach dem genauen Match in unserer Liste (Case Insensitive)
            const matched = CATEGORIES.find(c =>
                rawCategory.toLowerCase().includes(c.toLowerCase()) ||
                c.toLowerCase().includes(rawCategory.toLowerCase())
            );

            return matched || 'Panorama';
        } catch (error: any) {
            if (error.response?.status === 429 && retries < maxRetries) {
                retries++;
                await new Promise(res => setTimeout(res, 2000));
                continue;
            }

            const errorMessage = error.response
                ? `KI Fehler (${error.response.status}): ${JSON.stringify(error.response.data.error?.message || error.message)}`
                : `KI Verbindungsfehler: ${error.message}`;

            throw new Error(errorMessage);
        }
    }
    throw new Error('Kategorisierung fehlgeschlagen (Rate Limit)');
};
export const categorizeHeadlines = async (headlines: string[]): Promise<string[]> => {
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'dein_key_hier') {
        return headlines.map(() => 'Panorama');
    }

    if (headlines.length === 0) return [];

    let retries = 0;
    const maxRetries = 1;

    while (retries <= maxRetries) {
        try {
            const response = await axios.post(
                OPENROUTER_URL,
                {
                    model: 'nvidia/nemotron-3-nano-30b-a3b:free',
                    messages: [
                        {
                            role: 'system',
                            content: `Du bist ein Klassifizierer für News-Überschriften. 
Ich sende dir eine Liste von Überschriften. 
Antworte NUR mit einem JSON-Array von Wörtern aus dieser Liste: ${CATEGORIES.join(', ')}.
Das Array muss genau so viele Elemente enthalten wie die Eingabeliste.
Beispiel Antwort: ["Panorama", "Politik", "Sport"]
Keine Erklärung, kein Satz, nur das JSON-Array.`,
                        },
                        {
                            role: 'user',
                            content: `Überschriften:\n${headlines.map((h, i) => `${i + 1}. ${h}`).join('\n')}`,
                        },
                    ],
                    temperature: 0.1,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                        'HTTP-Referer': 'http://localhost:5173',
                        'X-Title': 'Lecta App',
                        'Content-Type': 'application/json',
                    },
                }
            );

            const content = response.data.choices[0].message.content.trim();
            try {
                // Versuche das JSON-Array zu extrahieren, falls die KI Text drumherum geschrieben hat
                const jsonMatch = content.match(/\[.*\]/s);
                const categories = JSON.parse(jsonMatch ? jsonMatch[0] : content);

                if (Array.isArray(categories)) {
                    return categories.map(cat => {
                        const matched = CATEGORIES.find(c =>
                            cat.toLowerCase().includes(c.toLowerCase()) ||
                            c.toLowerCase().includes(cat.toLowerCase())
                        );
                        return matched || 'Panorama';
                    });
                }
            } catch (e) {
                console.error("Fehler beim Parsen der KI-Antwort:", content);
            }

            // Fallback: Einzeln versuchen wenn Batch fehlschlägt (optional)
            return headlines.map(() => 'Panorama');
        } catch (error: any) {
            if (error.response?.status === 429 && retries < maxRetries) {
                retries++;
                await new Promise(res => setTimeout(res, 2000));
                continue;
            }
            throw error;
        }
    }
    return headlines.map(() => 'Panorama');
};
