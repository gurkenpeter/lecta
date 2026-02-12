import { motion } from 'framer-motion';

export const LoadingScreen = ({ progress }: { progress: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'var(--bg-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2000,
                padding: '20px'
            }}
        >
            <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '40px' }}>
                {/* Outer pulsing ring */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                        borderRadius: ["20%", "50%", "20%"],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        border: '2px solid var(--text-primary)',
                        opacity: 0.2
                    }}
                />

                {/* Inner rotating diamond */}
                <motion.div
                    animate={{
                        rotate: [45, 225, 45],
                        scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        top: '25%',
                        left: '25%',
                        width: '50%',
                        height: '50%',
                        backgroundColor: 'var(--text-primary)',
                    }}
                />

                {/* The "L" Logo */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '42px',
                    fontWeight: 900,
                    color: 'var(--bg-color)',
                    mixBlendMode: 'difference'
                }}>
                    K
                </div>
            </div>

            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{
                    fontSize: '14px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: 400,
                    marginBottom: '10px'
                }}
            >
                Kairos
            </motion.h2>

            <motion.p
                key={progress}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                style={{
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontStyle: 'italic'
                }}
            >
                {progress}
            </motion.p>

            {/* Small progress indicator dots */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2
                        }}
                        style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--text-primary)'
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
};
