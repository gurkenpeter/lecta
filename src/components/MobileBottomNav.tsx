import { Home, Heart, Settings, Search } from 'lucide-react'
import { motion } from 'framer-motion'

interface MobileBottomNavProps {
    onOpenSettings: () => void;
    activeCategory: string;
    onResetCategory: () => void;
}

export const MobileBottomNav = ({ onOpenSettings, activeCategory, onResetCategory }: MobileBottomNavProps) => {
    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '75px',
            backgroundColor: 'var(--bg-color)',
            borderTop: '1.5px solid var(--divider-color)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 'env(safe-area-inset-bottom)',
            zIndex: 1000,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
        }}>
            <button
                onClick={onResetCategory}
                style={{
                    background: 'none', border: 'none', color: activeCategory === 'All' ? 'var(--text-primary)' : 'rgba(0,0,0,0.3)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                }}
            >
                <Home size={24} strokeWidth={activeCategory === 'All' ? 2.5 : 2} />
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>Home</span>
            </button>

            <div style={{
                width: '50px', height: '50px', backgroundColor: 'var(--text-primary)', borderRadius: '50%',
                display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--bg-color)',
                marginTop: '-30px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}>
                <Search size={24} strokeWidth={3} />
            </div>

            <button
                onClick={onOpenSettings}
                style={{
                    background: 'none', border: 'none', color: 'var(--text-primary)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                }}
            >
                <Settings size={24} strokeWidth={2} />
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>Setup</span>
            </button>
        </nav>
    )
}
