import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function MediaModal({ isOpen, onClose, title, items }) { // items: [{ type: 'image'|'video', src: string, thumbnail?: string }]
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

    if (!isOpen) return null;

    const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

    const currentItem = items[currentIndex];

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-5xl bg-dark-bg/90 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <h3 className="text-xl font-bold text-white">{title}</h3>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content Viewer */}
                        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
                            {/* Navigation Buttons */}
                            {items.length > 1 && (
                                <>
                                    <button
                                        onClick={prev}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-white/10 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                                    >
                                        <ChevronLeft size={32} />
                                    </button>
                                    <button
                                        onClick={next}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-white/10 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                                    >
                                        <ChevronRight size={32} />
                                    </button>
                                </>
                            )}

                            {/* Media Render */}
                            <div className="w-full h-full flex items-center justify-center">
                                {currentItem.type === 'video' ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`${currentItem.src}`}
                                        title="Video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                ) : (
                                    <img
                                        src={currentItem.src}
                                        alt="Testimonial"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Footer / Thumbs (Optional, keeping simple for now) */}
                        <div className="p-4 bg-dark-bg/90 border-t border-white/10 text-center text-gray-400 text-sm">
                            {currentIndex + 1} / {items.length}
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
