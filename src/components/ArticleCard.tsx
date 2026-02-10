import { motion } from 'framer-motion'
import { Bookmark, Share2, Heart } from 'lucide-react'
import { Article, categoryColors } from '../data/mockArticles'

interface ArticleCardProps {
    article: Article;
    isLiked: boolean;
    onLike: (id: string, category: string) => void;
    onCategoryChange: (category: string) => void;
}

export const ArticleCard = ({ article, isLiked, onLike, onCategoryChange }: ArticleCardProps) => {
    const categoryColor = categoryColors[article.category] || '#777';

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
                width: '100%',
                padding: '60px 0',
                borderBottom: 'var(--divider-width) solid var(--divider-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                color: 'var(--text-primary)'
            }}
        >
            {/* Header: Source & Category Pills */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: 'Inter, sans-serif'
            }}>
                <div style={{
                    backgroundColor: 'var(--text-primary)',
                    color: 'var(--bg-color)',
                    padding: '4px 12px',
                    fontSize: '11px',
                    fontWeight: 900,
                    textTransform: 'var(--text-transform)',
                    letterSpacing: '0.1em'
                }}>
                    {article.source}
                </div>
                <button
                    onClick={() => onCategoryChange(article.category)}
                    style={{
                        border: `1.5px solid ${categoryColor}`,
                        padding: '3px 14px',
                        borderRadius: '20px',
                        fontSize: '10px',
                        fontWeight: 800,
                        color: categoryColor,
                        backgroundColor: 'transparent',
                        textTransform: 'var(--text-transform)',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {article.category}
                </button>
            </div>

            {/* Content Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{
                    fontSize: '52px',
                    lineHeight: 1.1,
                    fontWeight: 'calc(var(--font-weight-main) + 300)',
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--text-primary)',
                    margin: 0
                }}>
                    {article.headline}
                </h2>
                {article.catcher &&
                    article.catcher !== 'Inhalt wird geladen...' &&
                    !article.catcher.includes('Inhalt nicht verfügbar') &&
                    !article.catcher.toLowerCase().includes('scraping') &&
                    !article.catcher.toLowerCase().includes('blocked') && (
                        <p style={{
                            fontSize: '21px',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.5,
                            maxWidth: '95%',
                            fontFamily: 'var(--font-main)',
                            fontWeight: 'var(--font-weight-main)',
                            margin: 0
                        }}>
                            {article.catcher}
                        </p>
                    )}
            </div>

            {/* Meta - Minimal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '8px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Inter, sans-serif', opacity: 0.7 }}>{article.timestamp}</div>

                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        fontSize: '12px',
                        fontWeight: 900,
                        color: 'var(--bg-color)',
                        backgroundColor: 'var(--text-primary)',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        textTransform: 'var(--text-transform)',
                        letterSpacing: '0.05em',
                        textDecoration: 'none',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
                        display: 'inline-block'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 0 rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 0 rgba(0,0,0,0.2)';
                    }}
                    onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'translateY(2px)';
                        e.currentTarget.style.boxShadow = '0 2px 0 rgba(0,0,0,0.2)';
                    }}
                    onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 0 rgba(0,0,0,0.2)';
                    }}
                >
                    Artikel lesen
                </a>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginLeft: 'auto' }}>
                    <button
                        onClick={() => onLike(article.id, article.category)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: 'inherit' }}
                    >
                        <Heart
                            size={20}
                            strokeWidth={2.5}
                            fill={isLiked ? "#ef4444" : "none"}
                            color={isLiked ? "#ef4444" : "currentColor"}
                        />
                    </button>
                    <Bookmark size={20} strokeWidth={2.5} style={{ cursor: 'pointer', opacity: 0.7 }} />
                    <Share2 size={20} strokeWidth={2.5} style={{ cursor: 'pointer', opacity: 0.7 }} />
                </div>
            </div>
        </motion.div>
    )
}
