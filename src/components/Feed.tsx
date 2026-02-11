import { ArticleCard } from './ArticleCard'
import { Article } from '../data/mockArticles'
import { useState, useEffect, useRef, useCallback } from 'react'

interface FeedProps {
    articles: Article[];
    likedArticles: string[];
    onLike: (id: string, category: string) => void;
    onCategoryChange: (category: string) => void;
    onLoadMoreFromSource: () => Promise<void>;
}

export const Feed = ({
    articles,
    likedArticles,
    onLike,
    onCategoryChange,
    onLoadMoreFromSource
}: FeedProps) => {
    const [displayArticles, setDisplayArticles] = useState<Article[]>([])
    const [loadingVisible, setLoadingVisible] = useState(false)
    const observer = useRef<IntersectionObserver | null>(null);

    // Filter und Limit Logic
    useEffect(() => {
        // Initial 20 Artikel anzeigen
        setDisplayArticles(articles.slice(0, 20));
    }, [articles]);

    const handleLoadMore = useCallback(async () => {
        if (loadingVisible) return;
        setLoadingVisible(true);

        const currentLength = displayArticles.length;
        const nextBatchSize = 10;

        // Wenn wir am Ende der verfügbaren Liste sind, neue von Quelle laden
        if (currentLength + nextBatchSize >= articles.length) {
            await onLoadMoreFromSource();
        }

        // Lokales Limit für die Anzeige erhöhen
        setDisplayArticles(articles.slice(0, currentLength + nextBatchSize));
        setLoadingVisible(false);
    }, [displayArticles.length, articles, loadingVisible, onLoadMoreFromSource]);

    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loadingVisible) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                handleLoadMore();
            }
        });

        if (node) observer.current.observe(node);
    }, [loadingVisible, handleLoadMore]);

    return (
        <div style={{ padding: 'var(--content-padding-v) var(--content-padding-h)', maxWidth: '850px', margin: '0 auto' }}>
            <div id="feed-start" />

            {displayArticles.length === 0 ? (
                <div style={{ padding: '100px 20px', textAlign: 'center', opacity: 0.5 }}>
                    <p style={{ fontSize: '18px', fontWeight: 700 }}>No articles found in this category.</p>
                    <p style={{ fontSize: '14px' }}>Try another category or refresh the page.</p>
                </div>
            ) : (
                displayArticles.map((article, index) => {
                    const isLast = index === displayArticles.length - 1;
                    return (
                        <div key={article.id} ref={isLast ? lastElementRef : null}>
                            <ArticleCard
                                article={article}
                                isLiked={likedArticles.includes(article.id)}
                                onLike={onLike}
                                onCategoryChange={onCategoryChange}
                            />
                        </div>
                    );
                })
            )}

            <div style={{
                padding: '60px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {loadingVisible && (
                    <div className="loading-spinner" />
                )}
            </div>

            <style>{`
                .loading-spinner {
                    width: 30px;
                    height: 30px;
                    border: 3.5px solid rgba(0,0,0,0.05);
                    borderTop: 3.5px solid var(--text-primary);
                    borderRadius: 50%;
                    animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
