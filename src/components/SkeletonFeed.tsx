
import { motion } from 'framer-motion';

export const SkeletonCard = () => {
    return (
        <div style={{
            width: '100%',
            padding: '60px 0',
            borderBottom: 'var(--divider-width) solid var(--divider-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
        }}>
            {/* Header Skeleton */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '60px', height: '20px', backgroundColor: 'var(--divider-color)', borderRadius: '4px' }} className="skeleton-pulse" />
                <div style={{ width: '80px', height: '20px', backgroundColor: 'var(--divider-color)', borderRadius: '20px' }} className="skeleton-pulse" />
            </div>

            {/* Title Skeleton */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ width: '100%', height: '45px', backgroundColor: 'var(--divider-color)', borderRadius: '8px' }} className="skeleton-pulse" />
                <div style={{ width: '70%', height: '45px', backgroundColor: 'var(--divider-color)', borderRadius: '8px' }} className="skeleton-pulse" />
            </div>

            {/* Catcher Skeleton */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ width: '90%', height: '18px', backgroundColor: 'var(--divider-color)', borderRadius: '4px' }} className="skeleton-pulse" />
                <div style={{ width: '40%', height: '18px', backgroundColor: 'var(--divider-color)', borderRadius: '4px' }} className="skeleton-pulse" />
            </div>

            {/* Footer Skeleton */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '8px' }}>
                <div style={{ width: '100px', height: '14px', backgroundColor: 'var(--divider-color)', borderRadius: '4px' }} className="skeleton-pulse" />
                <div style={{ width: '120px', height: '40px', backgroundColor: 'var(--divider-color)', borderRadius: '12px', marginLeft: 'auto' }} className="skeleton-pulse" />
            </div>

            <style>{`
                .skeleton-pulse {
                    animation: pulse 1.5s ease-in-out infinite;
                    opacity: 0.6;
                }
                @keyframes pulse {
                    0% { opacity: 0.4; }
                    50% { opacity: 0.7; }
                    100% { opacity: 0.4; }
                }
            `}</style>
        </div>
    );
};

export const SkeletonFeed = ({ count = 3 }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </motion.div>
    );
};
