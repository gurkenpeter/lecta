import { motion } from 'framer-motion'
import { Bookmark, Share2, Heart, ExternalLink } from 'lucide-react'
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
                padding: 'var(--content-padding-v) 0',
                borderBottom: 'var(--divider-width) solid var(--divider-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                color: 'var(--text-primary)'
            }}
        >
            <div className="max-width-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Header: Source & Category Pills */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            backgroundColor: 'var(--text-primary)',
                            color: 'var(--bg-color)',
                            padding: '4px 10px',
                            fontSize: '10px',
                            fontWeight: 900,
                            textTransform: 'var(--text-transform)',
                            letterSpacing: '0.1em'
                        }}>
                            {article.source}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 700, opacity: 0.5 }}>• {article.timestamp}</div>
                    </div>

                    <button
                        onClick={() => onCategoryChange(article.category)}
                        style={{
                            border: `none`,
                            padding: '4px 0',
                            fontSize: '11px',
                            fontWeight: 900,
                            color: categoryColor,
                            backgroundColor: 'transparent',
                            textTransform: 'var(--text-transform)',
                            letterSpacing: '0.05em',
                            cursor: 'pointer'
                        }}
                    >
                        #{article.category}
                    </button>
                </div>

                {/* Content Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <h2 style={{
                        fontSize: 'var(--headline-size)',
                        lineHeight: 1.15,
                        fontWeight: 'calc(var(--font-weight-main) + 300)',
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--text-primary)',
                        margin: 0,
                        letterSpacing: '-0.02em',
                        textTransform: 'var(--text-transform)'
                    }}>
                        {article.headline}
                    </h2>
                    {article.catcher && (
                        <p style={{
                            fontSize: 'var(--body-size)',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.5,
                            maxWidth: '100%',
                            fontFamily: 'var(--font-main)',
                            fontWeight: 'var(--font-weight-main)',
                            margin: 0,
                            textTransform: 'var(--text-transform)'
                        }}>
                            {article.catcher}
                        </p>
                    )}
                </div>

                {/* Actions Section */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '10px'
                }}>
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontSize: '13px',
                            fontWeight: 900,
                            color: 'var(--bg-color)',
                            backgroundColor: 'var(--text-primary)',
                            padding: '14px 28px',
                            borderRadius: '14px',
                            textTransform: 'var(--text-transform)',
                            letterSpacing: '0.05em',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: '0 4px 0 rgba(0,0,0,0.15)'
                        }}
                    >
                        <span>READ</span>
                        <ExternalLink size={16} />
                    </a>

                    <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                        <button
                            onClick={() => onLike(article.id, article.category)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 10, color: 'inherit' }}
                        >
                            <Heart
                                size={22}
                                strokeWidth={2.5}
                                fill={isLiked ? "#ef4444" : "none"}
                                color={isLiked ? "#ef4444" : "currentColor"}
                            />
                        </button>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 10 }}>
                            <Share2 size={22} strokeWidth={2.5} style={{ opacity: 0.7 }} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
