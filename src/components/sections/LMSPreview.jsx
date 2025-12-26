import { Section } from '../ui/Section'
import { motion } from 'framer-motion'
import { Flame, CheckCircle, Award } from 'lucide-react'

export function LMSSneakPeek() {
    return (
        <Section id="lms" dark className="overflow-hidden">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Built-in <span className="text-accent">Gamification</span></h2>
                <p className="text-gray-400">Keep your streak alive and earn rewards as you learn.</p>
            </div>

            <div className="relative max-w-5xl mx-auto">
                {/* Main Interface Screenshot Placeholder */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="rounded-xl border border-white/10 bg-[#0f1117] shadow-2xl overflow-hidden aspect-[16/9] relative z-10"
                >
                    {/* Mock UI Header */}
                    <div className="h-12 border-b border-white/10 flex items-center px-4 justify-between bg-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <span className="flex items-center gap-1 text-orange-500"><Flame size={16} fill="currentColor" /> 12 Day Streak</span>
                            <span className="text-primary">Level 4 Engineer</span>
                        </div>
                    </div>

                    {/* Mock UI Body */}
                    <div className="flex h-full">
                        {/* Sidebar */}
                        <div className="w-64 border-r border-white/10 p-4 space-y-2 hidden md:block">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-4">Modules</div>
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`p-2 rounded flex items-center gap-3 text-sm ${i === 2 ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400'}`}>
                                    {i < 3 ? <CheckCircle size={14} className="text-green-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-600" />}
                                    Module 0{i}: Deep Dive
                                </div>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-8 bg-[#0a0c10] flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                    <Award size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Lesson Completed!</h3>
                                <p className="text-gray-400 text-sm max-w-xs mx-auto">You've mastered the basics of Neural Networks. +50XP earned.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-10 -right-10 md:-right-20 bg-card-bg border border-white/10 p-4 rounded-xl shadow-xl z-20 hidden sm:block"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                            <Flame size={20} fill="currentColor" />
                        </div>
                        <div>
                            <div className="text-xs text-gray-400">Current Streak</div>
                            <div className="text-lg font-bold">14 Days 🔥</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Section>
    )
}
