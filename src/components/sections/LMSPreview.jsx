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
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
                    {/* Left: Branding & Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
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
                        <p className="text-gray-400 text-lg max-w-xl leading-relaxed italic border-l-4 border-accent/30 pl-6">
                            {t('lms_preview.subtitle')}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { icon: <Flame className="text-orange-500" />, text: "Gamified Streaks" },
                                { icon: <Target className="text-primary" />, text: "Personalized Roadmap" },
                                { icon: <Award className="text-yellow-500" />, text: "Verified Credentials" },
                                { icon: <PlayCircle className="text-secondary" />, text: "Bite-sized Learning" }
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    {feature.icon}
                                    <span className="text-sm font-bold text-gray-300">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: LMS Video */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-accent/20 border border-white/10 bg-card-bg group">
                            {/* Browser Decoration */}
                            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/20" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/20" />
                                </div>
                                <div className="ml-4 h-4 rounded-full bg-white/5 w-1/2" />
                            </div>
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
                                <div className="absolute inset-0 bg-accent/5 pointer-events-none group-hover:bg-transparent transition-colors duration-500" />
                            </div>
                        </div>

                        {/* Floating Achievement Card */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-10 -right-6 bg-dark-bg/80 backdrop-blur-xl border border-accent/30 p-5 rounded-[2rem] shadow-2xl z-20 hidden md:flex items-center gap-4 max-w-[280px]"
                        >
                            <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Award size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{t('lms_preview.achievement.badge')}</p>
                                <p className="text-white text-xs font-black">{t('lms_preview.achievement.title')}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* --- Roadmap Interactive Mockup (Full Width) --- */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="rounded-[3rem] border border-white/10 bg-[#0a0c10] shadow-3xl overflow-hidden relative z-10"
                >
                    {/* Mock UI Header */}
                    <div className="h-16 border-b border-white/5 flex items-center px-8 justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-500 tracking-[0.2em] uppercase">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">SN</div>
                            {t('lms_preview.badge')}
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20">
                                <Flame size={16} className="text-orange-500" fill="currentColor" />
                                <span className="text-sm font-black text-orange-500">14 {t('lms_preview.streak_suffix')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row min-h-[500px]">
                        {/* Sidebar */}
                        <div className="w-full lg:w-80 border-r border-white/5 p-8 space-y-8 bg-white/[0.01]">
                            <div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">{t('lms_preview.current_course')}</div>
                                <div className="p-5 rounded-3xl bg-white/5 border border-white/10 shadow-inner">
                                    <div className="text-sm font-black text-white mb-2">Full-Stack AI SaaS Masterclass</div>
                                    <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden">
                                        <div className="bg-gradient-to-r from-primary to-accent h-full w-[65%]" />
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-3 font-bold">65% {t('lms_preview.completed_label')}</div>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                {(t('lms_preview.nav_items') || []).map((item, i) => (
                                    <div key={item} className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${i === 1 ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-gray-500 hover:text-gray-300'}`}>
                                        {item}
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* Main Roadmap Area */}
                        <div className="flex-1 p-8 lg:p-16 bg-[#08090d]">
                            <div className="max-w-xl mx-auto">
                                <div className="flex items-center justify-between mb-12">
                                    <h3 className="text-2xl font-black flex items-center gap-3">
                                        <Target className="text-primary" size={24} />
                                        {t('lms_preview.roadmap_title')}
                                    </h3>
                                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{t('lms_preview.updated_label')}</div>
                                </div>

                                <div className="space-y-5 relative">
                                    <div className="absolute left-6 top-10 bottom-10 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />

                                    {roadmapWithStatus.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ x: -20, opacity: 0 }}
                                            whileInView={{ x: 0, opacity: 1 }}
                                            className={`relative flex items-center gap-6 p-5 rounded-3xl border transition-all duration-500 group
                                                ${item.status === 'active'
                                                    ? 'bg-primary/5 border-primary/40 shadow-2xl shadow-primary/10'
                                                    : 'bg-white/[0.01] border-white/5 opacity-60'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all 
                                                ${item.status === 'completed' ? 'bg-green-500/20 border-green-500 text-green-500' :
                                                    item.status === 'active' ? 'bg-primary border-primary text-white' : 'bg-[#0a0c10] border-white/10 text-gray-700'}`}
                                            >
                                                {item.status === 'completed' ? <CheckCircle size={20} /> : item.status === 'active' ? <PlayCircle size={20} /> : <Lock size={20} />}
                                            </div>

                                            <div className="flex-1">
                                                <div className="text-[10px] font-black uppercase tracking-tighter text-gray-500 mb-1">
                                                    Module 0{item.id} • {item.type}
                                                </div>
                                                <h4 className={`text-lg font-black ${item.status === 'completed' ? 'line-through text-gray-600' : 'text-white'}`}>{item.title}</h4>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Section>
    )
}
