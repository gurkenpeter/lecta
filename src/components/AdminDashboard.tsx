import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, X, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { FilterRule, getStoredRules, saveRules, RuleType } from '../services/categorizationService';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

export const AdminDashboard = ({ onClose }: { onClose: () => void }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rules, setRules] = useState<FilterRule[]>([]);
    const [activeCategory, setActiveCategory] = useState('Politik');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setRules(getStoredRules());
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Falsches Passwort');
        }
    };

    const handleAddRule = () => {
        const newRule: FilterRule = {
            id: Math.random().toString(36).substr(2, 9),
            category: activeCategory,
            type: 'AND',
            keywords: ['']
        };
        setRules([...rules, newRule]);
    };

    const handleUpdateRule = (id: string, updates: Partial<FilterRule>) => {
        setRules(rules.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const handleKeywordChange = (id: string, index: number, value: string) => {
        setRules(rules.map(r => {
            if (r.id === id) {
                const newKeywords = [...r.keywords];
                newKeywords[index] = value;
                return { ...r, keywords: newKeywords };
            }
            return r;
        }));
    };

    const handleAddKeyword = (id: string) => {
        setRules(rules.map(r => r.id === id ? { ...r, keywords: [...r.keywords, ''] } : r));
    };

    const handleRemoveKeyword = (id: string, index: number) => {
        setRules(rules.map(r => r.id === id ? { ...r, keywords: r.keywords.filter((_, i) => i !== index) } : r));
    };

    const handleDeleteRule = (id: string) => {
        setRules(rules.filter(r => r.id !== id));
    };

    const handleSave = () => {
        saveRules(rules);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
    };

    if (!isAuthenticated) {
        return (
            <div style={{
                position: 'fixed', inset: 0, backgroundColor: 'var(--bg-color)', zIndex: 3000,
                display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
            }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}
                >
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{
                            width: '80px', height: '80px', backgroundColor: 'var(--text-primary)',
                            borderRadius: '50%', display: 'flex', justifyContent: 'center',
                            alignItems: 'center', color: 'var(--bg-color)', margin: '0 auto 20px auto'
                        }}>
                            <Lock size={32} />
                        </div>
                        <h2 style={{ fontSize: '28px', fontWeight: 900 }}>Admin Login</h2>
                        <p style={{ opacity: 0.6 }}>Zugang nur für autorisierte Administratoren</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input
                            type="password"
                            placeholder="Passwort eingeben"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                padding: '18px', borderRadius: '15px', border: '2px solid var(--divider-color)',
                                backgroundColor: 'transparent', color: 'inherit', fontSize: '18px', textAlign: 'center'
                            }}
                        />
                        {error && <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: 700 }}>{error}</div>}
                        <button style={{
                            padding: '18px', borderRadius: '15px', backgroundColor: 'var(--text-primary)',
                            color: 'var(--bg-color)', border: 'none', fontWeight: 900, fontSize: '16px',
                            cursor: 'pointer'
                        }}>ANSCHALTEN</button>
                        <button type="button" onClick={onClose} style={{
                            padding: '10px', background: 'none', border: 'none', color: 'inherit', opacity: 0.5, fontWeight: 700
                        }}>Abbrechen</button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'var(--bg-color)', zIndex: 3000,
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
            <header style={{
                padding: '20px', borderBottom: '1px solid var(--divider-color)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: 'var(--bg-color)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>Filter Dashboard</h2>
                    {success && <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 800 }}>
                        <CheckCircle2 size={14} /> GESPEICHERT
                    </motion.div>}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleSave} style={{
                        padding: '10px 20px', borderRadius: '10px', backgroundColor: 'var(--text-primary)',
                        color: 'var(--bg-color)', border: 'none', fontWeight: 800, fontSize: '13px',
                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                    }}>
                        <Save size={16} /> Speichern
                    </button>
                    <button onClick={onClose} style={{
                        padding: '10px', borderRadius: '10px', background: 'rgba(0,0,0,0.05)',
                        border: 'none', color: 'inherit', cursor: 'pointer'
                    }}>
                        <X size={20} />
                    </button>
                </div>
            </header>

            <main style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 900 }}>Regeln verwalten</h3>
                            <button onClick={handleAddRule} style={{
                                padding: '8px 15px', borderRadius: '20px', border: '2px solid var(--text-primary)',
                                background: 'transparent', color: 'inherit', fontWeight: 800, fontSize: '12px',
                                display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'
                            }}>
                                <Plus size={14} /> Neue Regel
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {rules.map((rule) => (
                                <div key={rule.id} style={{
                                    padding: '20px', borderRadius: '20px', backgroundColor: 'rgba(0,0,0,0.02)',
                                    border: '1.5px solid var(--divider-color)', display: 'flex', flexDirection: 'column', gap: '15px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <select
                                                value={rule.category}
                                                onChange={(e) => handleUpdateRule(rule.id, { category: e.target.value })}
                                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--divider-color)', fontWeight: 800 }}
                                            >
                                                {['Politik', 'Wirtschaft', 'Panorama', 'Sport', 'Kultur', 'Technik', 'Gesundheit', 'Wissenschaft', 'Lifestyle', 'Lokales'].map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            <div style={{ display: 'flex', padding: '4px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '8px', gap: '4px' }}>
                                                <button
                                                    onClick={() => handleUpdateRule(rule.id, { type: 'OR' })}
                                                    style={{
                                                        padding: '4px 10px', borderRadius: '6px', border: 'none',
                                                        backgroundColor: rule.type === 'OR' ? 'var(--text-primary)' : 'transparent',
                                                        color: rule.type === 'OR' ? 'var(--bg-color)' : 'inherit',
                                                        fontSize: '11px', fontWeight: 900, cursor: 'pointer'
                                                    }}
                                                >OR</button>
                                                <button
                                                    onClick={() => handleUpdateRule(rule.id, { type: 'AND' })}
                                                    style={{
                                                        padding: '4px 10px', borderRadius: '6px', border: 'none',
                                                        backgroundColor: rule.type === 'AND' ? 'var(--text-primary)' : 'transparent',
                                                        color: rule.type === 'AND' ? 'var(--bg-color)' : 'inherit',
                                                        fontSize: '11px', fontWeight: 900, cursor: 'pointer'
                                                    }}
                                                >AND</button>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteRule(rule.id)} style={{
                                            padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer'
                                        }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                                        {rule.keywords.map((kw, idx) => (
                                            <div key={idx} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    value={kw}
                                                    onChange={(e) => handleKeywordChange(rule.id, idx, e.target.value)}
                                                    placeholder="Keyword..."
                                                    style={{
                                                        padding: '8px 30px 8px 12px', borderRadius: '8px', border: '1px solid var(--divider-color)',
                                                        fontSize: '13px', width: '120px'
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleRemoveKeyword(rule.id, idx)}
                                                    style={{ position: 'absolute', right: '5px', background: 'none', border: 'none', opacity: 0.3, cursor: 'pointer' }}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        <button onClick={() => handleAddKeyword(rule.id)} style={{
                                            padding: '8px', borderRadius: '8px', border: '1px dashed var(--divider-color)',
                                            background: 'transparent', cursor: 'pointer', opacity: 0.5
                                        }}>
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <div style={{ fontSize: '11px', opacity: 0.5, fontStyle: 'italic' }}>
                                        {rule.type === 'OR' ? 'Triggert wenn EINES der Wörter vorkommt.' : 'Triggert nur wenn ALLE Wörter im Titel vorkommen.'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
