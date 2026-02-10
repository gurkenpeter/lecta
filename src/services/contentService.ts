import axios from 'axios';

export const getFirstThreeSentences = async (url: string): Promise<string | null> => {
    try {
        // Jina Reader liefert den Textinhalt einer Webseite
        const response = await axios.get(`https://r.jina.ai/${url}`);
        const text = response.data;

        // Wir suchen nach längeren Textabschnitten (Paragraphs)
        const paragraphs = text.split('\n')
            .map((p: string) => p.trim())
            .filter((p: string) => p.length > 60); // Kurze Zeilen wie Menüpunkte ignorieren

        // Den ersten richtigen Textblock nehmen
        const mainText = paragraphs[0] || "";

        // In Sätze zerlegen (einfache Regex für Punkt, Ausrufezeichen, Fragezeichen)
        const sentences = mainText.match(/[^.!?]+[.!?]+/g) || [];

        if (sentences.length === 0) return null;

        return sentences.slice(0, 3).join(' ').trim();
    } catch (error: any) {
        console.error("Scraping error for", url, error.message);
        return null;
    }
};
