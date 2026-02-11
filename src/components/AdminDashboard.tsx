import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, X, CheckCircle2, RotateCcw } from 'lucide-react';
import { FilterRule, getStoredRules, saveRules, DEFAULT_RULES } from '../services/categorizationService';

interface AdminDashboardProps {
    onClose: () => void;
    onRulesChanged?: () => void;
}

export const AdminDashboard = ({ onClose, onRulesChanged }: AdminDashboardProps) => {
    const [rules, setRules] = useState<FilterRule[]>([]);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setRules(getStoredRules());
    }, []);

    const handleAddRule = () => {
        const newRule: FilterRule = {
            id: Math.random().toString(36).substr(2, 9),
            category: 'Politik',
            type: 'OR',
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

    const handleReset = () => {
        if (window.confirm('Möchtest du alle Regeln auf die Standardeinstellungen zurücksetzen?')) {
            setRules(DEFAULT_RULES);
        }
    };

    const handleSave = () => {
        saveRules(rules);
        setSuccess(true);
        if (onRulesChanged) onRulesChanged();
        setTimeout(() => setSuccess(false), 2000);
    };

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
                        <CheckCircle2 size={14} /> AKTUALISIERT
                    </motion.div>}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleReset} style={{
                        padding: '10px', borderRadius: '10px', background: 'rgba(0,0,0,0.05)',
                        border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
                    }} title="Zurücksetzen">
                        <RotateCcw size={18} />
                    </button>
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
                            <h3 style={{ fontSize: '18px', fontWeight: 900 }}>Filter-Regeln</h3>
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
                                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--divider-color)', fontWeight: 800, background: 'var(--bg-color)', color: 'inherit' }}
                                            >
                                                {['Politik', 'Wirtschaft', 'Panorama', 'Sport', 'Kultur', 'Technik', 'Gesundheit', 'Wissenschaft', 'Lifestyle', 'Lokales'].map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            <div style={{ display: 'flex', padding: '4px', backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: '8px', gap: '4px' }}>
                                                <button
                                                    onClick={() => handleUpdateRule(rule.id, { type: 'OR' })}
                                                    style={{
                                                        padding: '4px 12px', borderRadius: '6px', border: 'none',
                                                        backgroundColor: rule.type === 'OR' ? 'var(--text-primary)' : 'transparent',
                                                        color: rule.type === 'OR' ? 'var(--bg-color)' : 'inherit',
                                                        fontSize: '11px', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s'
                                                    }}
                                                >OR</button>
                                                <button
                                                    onClick={() => handleUpdateRule(rule.id, { type: 'AND' })}
                                                    style={{
                                                        padding: '4px 12px', borderRadius: '6px', border: 'none',
                                                        backgroundColor: rule.type === 'AND' ? 'var(--text-primary)' : 'transparent',
                                                        color: rule.type === 'AND' ? 'var(--bg-color)' : 'inherit',
                                                        fontSize: '11px', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s'
                                                    }}
                                                >AND</button>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteRule(rule.id)} style={{
                                            padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7
                                        }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                                        {rule.keywords.map((kw, idx) => (
                                            <div key={idx} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    value={kw}
                                                    onChange={(e) => handleKeywordChange(rule.id, idx, e.target.value)}
                                                    placeholder="Keyword..."
                                                    style={{
                                                        padding: '10px 35px 10px 15px', borderRadius: '12px', border: '1.5px solid var(--divider-color)',
                                                        fontSize: '14px', width: '150px', backgroundColor: 'var(--bg-color)', color: 'inherit'
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleRemoveKeyword(rule.id, idx)}
                                                    style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', opacity: 0.4, cursor: 'pointer' }}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button onClick={() => handleAddKeyword(rule.id)} style={{
                                            padding: '10px 15px', borderRadius: '12px', border: '1.5px dashed var(--divider-color)',
                                            background: 'transparent', cursor: 'pointer', opacity: 0.6, color: 'inherit'
                                        }}>
                                            <Plus size={18} />
                                        </button>
                                    </div>

                                    <div style={{ fontSize: '12px', opacity: 0.4, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
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
