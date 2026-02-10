import { ArticleCard } from './ArticleCard'
import { Article } from '../data/mockArticles'
import { useState, useEffect, useRef } from 'react'
import { SkeletonFeed } from './SkeletonFeed'

interface FeedProps {
    articles: Article[];
    likedArticles: string[];
    onLike: (id: string, category: string) => void;
    onCategoryChange: (category: string) => void;
    onEnrich: (id: string, headline: string, url: string) => Promise<void>;
    onBatchEnrich: (articles: Article[]) => Promise<void>;
    onLoadMoreFromSource: () => Promise<void>;
    isAnalyzingMore: boolean;
}

export const Feed = ({
    articles,
    likedArticles,
    onLike,
    onCategoryChange,
    onEnrich,
    onBatchEnrich,
    onLoadMoreFromSource,
    isAnalyzingMore
}: FeedProps) => {
    const [displayArticles, setDisplayArticles] = useState<Article[]>([])
    const [loadingVisible, setLoadingVisible] = useState(false)

    // Initial load or category change
    useEffect(() => {
        setDisplayArticles(prev => {
            const currentCount = prev.length > 0 ? prev.length : 20;
            return articles.slice(0, Math.max(currentCount, 20));
        });
    }, [articles])

    const handleLoadMore = async () => {
        if (loadingVisible || isAnalyzingMore) return;
        setLoadingVisible(true);

        const currentLength = displayArticles.length;
        const nextBatchSize = 5;

        // Wenn wir am Ende der verfügbaren Liste sind, neue von Quelle laden
        if (currentLength + nextBatchSize >= articles.length) {
            await onLoadMoreFromSource();
        }

        // Lokales Limit für die Anzeige erhöhen
        setDisplayArticles(articles.slice(0, currentLength + nextBatchSize));
        setLoadingVisible(false);
    }

    return (
        <div style={{ padding: '40px 20px', maxWidth: '850px', margin: '0 auto' }}>
            {displayArticles.map((article) => (
                <ArticleCard
                    key={article.id}
                    article={article}
                    isLiked={likedArticles.includes(article.id)}
                    onLike={onLike}
                    onCategoryChange={onCategoryChange}
                />
            ))}

            {isAnalyzingMore && <SkeletonFeed count={3} />}

            <div style={{
                padding: '60px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
            }}>
                {!isAnalyzingMore && displayArticles.length < articles.length + 50 && (
                    <button
                        onClick={handleLoadMore}
                        disabled={loadingVisible}
                        style={{
                            fontSize: '14px',
                            fontWeight: 900,
                            color: 'var(--text-primary)',
                            backgroundColor: 'transparent',
                            border: '2px solid var(--text-primary)',
                            padding: '16px 40px',
                            borderRadius: '16px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 0 var(--text-primary)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 0 var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 0 var(--text-primary)';
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.transform = 'translateY(2px)';
                            e.currentTarget.style.boxShadow = '0 0px 0 var(--text-primary)';
                        }}
                    >
                        {loadingVisible ? 'Lade...' : 'Mehr Artikel laden'}
                    </button>
                )}
            </div>

            <style>{`
                .loading-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(0,0,0,0.1);
                    borderTop: 2px solid #000;
                    borderRadius: '50%';
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
