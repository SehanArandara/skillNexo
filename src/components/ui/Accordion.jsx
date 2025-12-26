import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from './Button'

export function Accordion({ items }) {
    const [activeIndex, setActiveIndex] = useState(null)

    const toggleIndex = (index) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    return (
        <div className="space-y-4 max-w-3xl mx-auto">
            {items.map((item, index) => (
                <div key={index} className="border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm">
                    <button
                        onClick={() => toggleIndex(index)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors focus:outline-none"
                    >
                        <span className="text-lg font-semibold text-white/90">{item.title}</span>
                        <motion.div
                            animate={{ rotate: activeIndex === index ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown className="text-gray-400" />
                        </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                        {activeIndex === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <div className="p-6 pt-0 text-gray-400 border-t border-white/5">
                                    {item.content}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    )
}
