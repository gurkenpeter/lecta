import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

export interface ToastMessage {
    id: string;
    title?: string;
    message: string;
    type: 'error' | 'warning' | 'info';
    count?: number;
    timestamp?: number;
}

interface ToastContainerProps {
    toasts: ToastMessage[];
    onRemove: (id: string) => void;
}

const ToastItem = ({ toast, onRemove }: { toast: ToastMessage, onRemove: (id: string) => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLong = toast.message.length > 60;
    const count = toast.count || 1;

    useEffect(() => {
        if (!isExpanded) {
            const timer = setTimeout(() => {
                onRemove(toast.id);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [isExpanded, toast.id, onRemove, toast.timestamp]);

    return (
        <div style={{ position: 'relative' }}>
            {/* Visual Stack Effect (Hintergrund-Karten) */}
            {count > 1 && (
                <>
                    <div style={{
                        position: 'absolute',
                        bottom: '-4px',
                        left: '4px',
                        right: '4px',
                        height: '100%',
                        backgroundColor: toast.type === 'error' ? '#d32f2f' : '#4f46e5',
                        borderRadius: '12px',
                        zIndex: -1,
                        opacity: 0.4,
                        border: '1px solid rgba(255,255,255,0.1)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-8px',
                        left: '8px',
                        right: '8px',
                        height: '100%',
                        backgroundColor: toast.type === 'error' ? '#b71c1c' : '#3730a3',
                        borderRadius: '12px',
                        zIndex: -2,
                        opacity: 0.2,
                        border: '1px solid rgba(255,255,255,0.1)'
                    }} />
                </>
            )}

            <motion.div
                layout
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                style={{
                    pointerEvents: 'auto',
                    backgroundColor: toast.type === 'error' ? '#ff4d4f' : '#6366f1',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    minWidth: '300px',
                    maxWidth: '450px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />

                    <div style={{ flex: 1, fontSize: '13px', fontFamily: 'Inter, sans-serif', lineHeight: '1.4' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '4px'
                        }}>
                            <div style={{
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                fontSize: '10px',
                                letterSpacing: '0.1em',
                                opacity: 0.8
                            }}>
                                {toast.title || (toast.type === 'error' ? 'Error' : 'Info')}
                            </div>

                            {count > 1 && (
                                <div style={{
                                    backgroundColor: 'rgba(255,255,255,0.25)',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    fontSize: '10px',
                                    fontWeight: 800,
                                    border: '1px solid rgba(255,255,255,0.3)'
                                }}>
                                    {count}x
                                </div>
                            )}
                        </div>

                        <div style={{
                            display: '-webkit-box',
                            WebkitLineClamp: isExpanded ? 'unset' : '2',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            wordBreak: 'break-word'
                        }}>
                            {toast.message}
                        </div>

                        {isLong && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                style={{
                                    background: 'rgba(255,255,255,0.15)',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '11px',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    marginTop: '10px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontWeight: 600
                                }}
                            >
                                {isExpanded ? (
                                    <>Show less <ChevronUp size={12} /></>
                                ) : (
                                    <>Show details <ChevronDown size={12} /></>
                                )}
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => onRemove(toast.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            opacity: 0.5,
                            cursor: 'pointer',
                            padding: '4px',
                            marginLeft: '4px',
                            flexShrink: 0
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 3000,
            display: 'flex',
            flexDirection: 'column-reverse', // Neue Toasts oben aufstapeln
            gap: '12px',
            pointerEvents: 'none'
        }}>
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
                ))}
            </AnimatePresence>
        </div>
    );
};
