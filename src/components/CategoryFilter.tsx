import { motion } from 'framer-motion'
import { categoryColors, categories } from '../data/mockArticles'

interface CategoryFilterProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
    return (
        <div style={{
            position: 'sticky',
            top: '70px',
            zIndex: 900,
            backgroundColor: 'var(--bg-color)',
            opacity: 0.95,
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            padding: '12px 20px',
            display: 'flex',
            gap: '8px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
        }} className="no-scrollbar">
            {categories.map((category) => {
                const isActive = activeCategory === category;
                const color = categoryColors[category] || '#000';

                return (
                    <motion.button
                        key={category}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCategoryChange(category)}
                        style={{
                            padding: '8px 18px',
                            border: 'none',
                            backgroundColor: isActive ? 'var(--text-primary)' : 'transparent',
                            color: isActive ? 'var(--bg-color)' : 'var(--text-primary)',
                            fontSize: '14px',
                            fontWeight: 800, // Very bold
                            cursor: 'pointer',
                            borderRadius: '30px',
                            transition: 'all 0.3s ease',
                            fontFamily: 'Inter, sans-serif',
                            textTransform: 'var(--text-transform)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {!isActive && (
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: color
                            }} />
                        )}
                        {category}
                    </motion.button>
                );
            })}
        </div>
    )
}
