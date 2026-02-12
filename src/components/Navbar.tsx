import { Search, User, Bell, Moon, Sun, Key, Download, Type, Settings, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavbarProps {
    isDark: boolean;
    onToggleDark: () => void;
    onGetBackup: () => void;
    onRestore: () => void;
    currentFont: 'serif' | 'sans';
    onToggleFont: () => void;
    fontWeight: number;
    onWeightChange: (weight: number) => void;
    isAllCaps: boolean;
    onToggleCaps: () => void;
}

export const Navbar = ({
    isDark,
    onToggleDark,
    onGetBackup,
    onRestore,
    currentFont,
    onToggleFont,
    fontWeight,
    onWeightChange,
    isAllCaps,
    onToggleCaps
}: NavbarProps) => {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <nav className="glass" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 'var(--navbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--content-padding-h)',
            zIndex: 1000,
            borderBottom: '1px solid var(--divider-color)',
            backgroundColor: 'var(--bg-color)',
            color: 'var(--text-primary)'
        }}>
            <div style={{ fontSize: '24px', fontWeight: 900, fontFamily: 'var(--font-heading)', letterSpacing: '-1px' }}>
                KAIROS
            </div>

            <div style={{ display: 'flex', gap: 'clamp(10px, 3vw, 20px)', alignItems: 'center' }}>

                {/* Font Settings Trigger */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        title="Font Settings"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            backgroundColor: showSettings ? 'rgba(0,0,0,0.1)' : 'transparent',
                            transition: 'background-color 0.2s ease'
                        }}
                    >
                        <Type size={20} />
                        <Settings size={14} style={{ opacity: 0.5 }} />
                    </button>

                    <AnimatePresence>
                        {showSettings && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    marginTop: '12px',
                                    right: 0,
                                    backgroundColor: 'var(--bg-color)',
                                    border: '1px solid var(--divider-color)',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    width: '280px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px',
                                    zIndex: 1001
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: 900, opacity: 0.5 }}>Font Style</label>
                                    <button
                                        onClick={onToggleFont}
                                        style={{
                                            padding: '12px',
                                            borderRadius: '10px',
                                            border: '1.5px solid var(--divider-color)',
                                            backgroundColor: 'transparent',
                                            color: 'inherit',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <span>{currentFont === 'serif' ? 'Serif' : 'Sans Serif'}</span>
                                        <Type size={16} />
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: 900, opacity: 0.5 }}>Case</label>
                                    <button
                                        onClick={onToggleCaps}
                                        style={{
                                            padding: '12px',
                                            borderRadius: '10px',
                                            border: '1.5px solid var(--divider-color)',
                                            backgroundColor: isAllCaps ? 'var(--text-primary)' : 'transparent',
                                            color: isAllCaps ? 'var(--bg-color)' : 'inherit',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <span>{isAllCaps ? 'ALL CAPS' : 'Normal'}</span>
                                        <div style={{ fontSize: '10px', opacity: 0.7 }}>{isAllCaps ? 'ON' : 'OFF'}</div>
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label style={{ fontSize: '11px', fontWeight: 900, opacity: 0.5 }}>Font Weight</label>
                                        <span style={{ fontSize: '12px', fontWeight: 700 }}>{fontWeight}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="100"
                                        max="900"
                                        step="100"
                                        value={fontWeight}
                                        onChange={(e) => onWeightChange(parseInt(e.target.value))}
                                        style={{
                                            width: '100%',
                                            accentColor: 'var(--text-primary)',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    onClick={onToggleDark}
                    title="Toggle Dark Mode"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button
                    onClick={onGetBackup}
                    title="Generate Backup Code"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}
                >
                    <Download size={20} />
                </button>
                <button
                    onClick={onRestore}
                    title="Restore Profile"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}
                >
                    <Key size={20} />
                </button>
                <Search size={20} strokeWidth={2} />
                <Bell size={20} strokeWidth={2} />
            </div>
        </nav>
    )
}
