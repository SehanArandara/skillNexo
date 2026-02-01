import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function MediaModal({ isOpen, onClose, title, items }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Reset index when modal opens
    useEffect(() => {
        if (isOpen) setCurrentIndex(0);
    }, [isOpen]);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const next = (e) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };
    const prev = (e) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, items, onClose]);

    const currentItem = items && items[currentIndex];

    return createPortal(
        <AnimatePresence>
            {isOpen && items && items.length > 0 && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/95 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Close Button - Top Right */}
                    <button
                        onClick={onClose}
                        className="fixed top-6 right-6 z-[120] w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all shadow-xl"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative z-[110] w-full max-w-6xl h-full flex flex-col items-center justify-center pointer-events-none"
                    >
                        {/* Title - Fixed to top of modal area */}
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full text-center px-20">
                            <h3 className="text-white/90 font-bold text-lg md:text-2xl drop-shadow-lg truncate">
                                {title}
                            </h3>
                        </div>

                        {/* Navigation Buttons */}
                        {items.length > 1 && (
                            <>
                                <button
                                    onClick={prev}
                                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[120] w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-sm transition-all shadow-2xl border border-white/10 pointer-events-auto hover:scale-110 active:scale-95 group"
                                >
                                    <ChevronLeft size={36} className="group-hover:-translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={next}
                                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[120] w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-sm transition-all shadow-2xl border border-white/10 pointer-events-auto hover:scale-110 active:scale-95 group"
                                >
                                    <ChevronRight size={36} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </>
                        )}

                        {/* Media Display Area */}
                        <div className="w-full h-[70vh] md:h-[80vh] flex items-center justify-center p-4 pointer-events-auto">
                            {currentItem.type === 'video' ? (
                                <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={currentItem.src}
                                        title="Video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                </div>
                            ) : (
                                <motion.img
                                    key={currentItem.src}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    src={currentItem.src}
                                    alt="Instructor Review"
                                    className="max-h-full max-w-full object-contain rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
                                />
                            )}
                        </div>

                        {/* Pagination Counter */}
                        <div className="mt-8 pointer-events-auto">
                            <div className="px-6 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 text-white/80 text-xs font-bold uppercase tracking-[0.3em] shadow-2xl">
                                {currentIndex + 1} <span className="text-white/30 mx-2">/</span> {items.length}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}



