import { motion, AnimatePresence } from 'framer-motion'
import { Type, Moon, Sun, X, Download, Key, ShieldCheck } from 'lucide-react'

interface MobileSettingsSheetProps {
    isOpen: boolean;
    onClose: () => void;
    isDark: boolean;
    onToggleDark: () => void;
    currentFont: 'serif' | 'sans';
    onToggleFont: () => void;
    fontWeight: number;
    onWeightChange: (weight: number) => void;
    isAllCaps: boolean;
    onToggleCaps: () => void;
    onGetBackup: () => void;
    onRestore: () => void;
}

export const MobileSettingsSheet = ({
    isOpen,
    onClose,
    isDark,
    onToggleDark,
    currentFont,
    onToggleFont,
    fontWeight,
    onWeightChange,
    isAllCaps,
    onToggleCaps,
    onGetBackup,
    onRestore
}: MobileSettingsSheetProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 2000,
                            backdropFilter: 'blur(5px)'
                        }}
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'var(--bg-color)',
                            borderTopLeftRadius: '30px',
                            borderTopRightRadius: '30px',
                            padding: '30px',
                            zIndex: 2001,
                            maxHeight: '85vh',
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--text-primary)', opacity: 0.2, borderRadius: '2px', margin: '0 auto 20px auto' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: 0 }}>Settings</h2>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'inherit' }}><X size={24} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            {/* Appearance */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 900, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '15px', display: 'block' }}>Appearance</label>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button
                                        onClick={onToggleDark}
                                        style={{
                                            flex: 1, padding: '20px', borderRadius: '20px', border: '2px solid var(--divider-color)',
                                            backgroundColor: !isDark ? 'var(--text-primary)' : 'transparent',
                                            color: !isDark ? 'var(--bg-color)' : 'var(--text-primary)',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', fontWeight: 800
                                        }}
                                    >
                                        <Sun size={20} /> Light
                                    </button>
                                    <button
                                        onClick={onToggleDark}
                                        style={{
                                            flex: 1, padding: '20px', borderRadius: '20px', border: '2px solid var(--divider-color)',
                                            backgroundColor: isDark ? 'var(--text-primary)' : 'transparent',
                                            color: isDark ? 'var(--bg-color)' : 'var(--text-primary)',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', fontWeight: 800
                                        }}
                                    >
                                        <Moon size={20} /> Dark
                                    </button>
                                </div>
                            </div>

                            {/* Font Style */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 900, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '15px', display: 'block' }}>Font Family</label>
                                <button
                                    onClick={onToggleFont}
                                    style={{
                                        width: '100%', padding: '20px', borderRadius: '20px', border: '2.5px solid var(--text-primary)',
                                        backgroundColor: 'transparent', color: 'inherit', fontWeight: 900, fontSize: '18px',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}
                                >
                                    <span>{currentFont === 'serif' ? 'Classic (Serif)' : 'Modern (Sans)'}</span>
                                    <Type size={20} />
                                </button>
                            </div>

                            {/* Font Weight */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 900, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Font Weight</label>
                                    <span style={{ fontSize: '18px', fontWeight: 900 }}>{fontWeight}</span>
                                </div>
                                <input
                                    type="range" min="100" max="900" step="100" value={fontWeight}
                                    onChange={(e) => onWeightChange(parseInt(e.target.value))}
                                    style={{ width: '100%', height: '40px', accentColor: 'var(--text-primary)' }}
                                />
                            </div>

                            {/* All Caps Toggle */}
                            <button
                                onClick={onToggleCaps}
                                style={{
                                    width: '100%', padding: '20px', borderRadius: '20px', border: '2px solid var(--divider-color)',
                                    backgroundColor: isAllCaps ? 'var(--text-primary)' : 'transparent',
                                    color: isAllCaps ? 'var(--bg-color)' : 'var(--text-primary)',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 900
                                }}
                            >
                                <span>ALL CAPS</span>
                                <div style={{ opacity: 0.6 }}>{isAllCaps ? 'ON' : 'OFF'}</div>
                            </button>


                            {/* Data */}
                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <button onClick={onGetBackup} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '15px', borderRadius: '15px', backgroundColor: 'rgba(0,0,0,0.05)', border: 'none', fontWeight: 800 }}>
                                    <Download size={18} /> Backup
                                </button>
                                <button onClick={onRestore} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '15px', borderRadius: '15px', backgroundColor: 'rgba(0,0,0,0.05)', border: 'none', fontWeight: 800 }}>
                                    <Key size={18} /> Restore
                                </button>
                            </div>
                        </div>

                        <div style={{ height: '40px' }} />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
