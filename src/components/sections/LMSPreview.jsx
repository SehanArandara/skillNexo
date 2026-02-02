import { Section } from '../ui/Section'
import { motion } from 'framer-motion'
import { Flame, CheckCircle, Award, Lock, PlayCircle, Star, Target } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export function LMSSneakPeek() {
    const { t, language } = useLanguage();

    const sampleRoadmapItems = t('lms_preview.roadmap_items');

    // Status logic for demo: 1-3 completed, 4 active, 5-6 locked
    const roadmapWithStatus = Array.isArray(sampleRoadmapItems) ? sampleRoadmapItems.map((item, idx) => ({
        ...item,
        id: idx + 1,
        status: idx < 3 ? 'completed' : idx === 3 ? 'active' : 'locked'
    })) : [];

    return (
        <Section id="lms" dark className="overflow-hidden">
            <div className="text-center mb-16 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        {language === 'en' ? (
                            <>
                                Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Future</span> of Learning
                            </>
                        ) : (
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                                {t('lms_preview.title')}
                            </span>
                        )}
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        {t('lms_preview.subtitle')}
                    </p>
                </motion.div>
            </div>

            <div className="relative max-w-6xl mx-auto px-4">
                {/* Main Interface Decorators */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/20 blur-[100px] rounded-full" />

                {/* Mock UI Container */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="rounded-[2.5rem] border border-white/10 bg-[#0a0c10] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative z-10"
                >
                    {/* Mock UI Header */}
                    <div className="h-16 border-b border-white/5 flex items-center px-8 justify-between bg-white/[0.02] backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="h-4 w-px bg-white/10 mx-2" />
                            <div className="text-xs font-medium text-gray-500 tracking-widest uppercase">{t('lms_preview.badge')}</div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20">
                                <Flame size={14} className="text-orange-500" fill="currentColor" />
                                <span className="text-xs font-bold text-orange-500">14 {t('lms_preview.streak_suffix')}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent p-0.5">
                                <div className="w-full h-full rounded-full bg-[#0a0c10] flex items-center justify-center text-[10px] font-bold">SA</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row min-h-[500px]">
                        {/* Sidebar */}
                        <div className="w-full md:w-72 border-r border-white/5 p-6 space-y-6 bg-white/[0.01]">
                            <div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">{t('lms_preview.current_course')}</div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="text-sm font-bold mb-1">AI SaaS Engine</div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                                        <div className="bg-primary h-full w-[65%]" />
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-2">65% {t('lms_preview.completed_label')}</div>
                                </div>
                            </div>

                            <nav className="space-y-1">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">{t('lms_preview.navigation')}</div>
                                {(t('lms_preview.nav_items') || []).map((item, i) => (
                                    <div key={item} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${i === 1 ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-transparent'}`} />
                                        {item}
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* Main Roadmap Area */}
                        <div className="flex-1 p-8 md:p-12 bg-[#08090d]">
                            <div className="max-w-xl mx-auto">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Target className="text-primary" size={20} />
                                        {t('lms_preview.roadmap_title')}
                                    </h3>
                                    <div className="text-xs text-gray-500 font-medium">{t('lms_preview.updated_label')}</div>
                                </div>

                                <div className="space-y-4 relative">
                                    {/* Vertical Line */}
                                    <div className="absolute left-[19px] top-6 bottom-6 w-px bg-gradient-to-b from-primary via-primary/50 to-white/5" />

                                    {roadmapWithStatus.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ x: -20, opacity: 0 }}
                                            whileInView={{ x: 0, opacity: 1 }}
                                            transition={{ delay: item.id * 0.1 }}
                                            className={`relative flex items-center gap-6 p-4 rounded-2xl border transition-all duration-300 group
                                                ${item.status === 'active'
                                                    ? 'bg-primary/5 border-primary/30 shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)]'
                                                    : item.status === 'completed'
                                                        ? 'bg-white/[0.02] border-white/5 opacity-60'
                                                        : 'bg-transparent border-transparent opacity-40 grayscale'
                                                }`}
                                        >
                                            {/* Status Icon */}
                                            <div className="relative z-10">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all group-hover:scale-110 
                                                    ${item.status === 'completed'
                                                        ? 'bg-green-500 border-green-500 text-white'
                                                        : item.status === 'active'
                                                            ? 'bg-[#0a0c10] border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                                            : 'bg-[#0a0c10] border-white/10 text-gray-600'
                                                    }`}
                                                >
                                                    {item.status === 'completed' ? <CheckCircle size={18} /> : item.status === 'active' ? <PlayCircle size={18} /> : <Lock size={16} />}
                                                </div>
                                            </div>

                                            {/* Text Content */}
                                            <div className="flex-1">
                                                <div className={`text-xs font-bold uppercase tracking-widest mb-0.5 
                                                    ${item.status === 'active' ? 'text-primary' : 'text-gray-500'}`}
                                                >
                                                    {t('syllabus.day_label')} {item.id < 10 ? `0${item.id}` : item.id} • {item.type}
                                                </div>
                                                <h4 className={`text-base font-bold transition-all
                                                    ${item.status === 'completed' ? 'line-through decoration-primary/50 text-gray-400' : 'text-white'}`}
                                                >
                                                    {item.title}
                                                </h4>
                                            </div>

                                            {/* Action / Badge */}
                                            {item.status === 'active' && (
                                                <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-primary animate-pulse">
                                                    {t('lms_preview.continue_btn')} <Star size={12} fill="currentColor" />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Floating Achievement Card */}
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-10 -left-6 md:-left-12 bg-[#12141c] border border-white/10 p-6 rounded-[2rem] shadow-2xl z-20 hidden lg:block max-w-[240px]"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center text-white mb-4 shadow-[0_10px_20px_rgba(249,115,22,0.3)]">
                            <Award size={32} />
                        </div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{t('lms_preview.achievement.badge')}</div>
                        <div className="text-sm font-bold text-white mb-1">{t('lms_preview.achievement.title')}</div>
                        <div className="text-[10px] text-gray-500">{t('lms_preview.achievement.desc')}</div>
                        <div className="mt-4 w-full bg-white/5 rounded-full h-1">
                            <div className="bg-orange-500 h-full w-full rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                        </div>
                    </div>
                </motion.div>

                {/* Background Shadow */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
            </div>

            {/* LMS Video Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl mx-auto px-4 mt-20"
            >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/20 bg-card-bg">
                    <div className="relative aspect-video bg-black">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/wUXuxfVLJDk?si=hE0CcJJG2jqB2ui-"
                            title="LMS Preview Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0"
                        />
                    </div>
                </div>
            </motion.div>
        </Section>
    )
}
