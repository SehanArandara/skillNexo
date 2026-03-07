import { Section } from '../ui/Section'
import { motion } from 'framer-motion'
import { Flame, Award, PlayCircle, Target } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

// Import LMS Screenshots
import lmsImg1 from '../../assets/LMS/1.png'
import lmsImg2 from '../../assets/LMS/2.png'
import lmsImg3 from '../../assets/LMS/3.png'

export function LMSSneakPeek() {
    const { t, language } = useLanguage();

    const screenshots = [
        { src: lmsImg1, title: t('lms_preview.screenshots.dashboard') },
        { src: lmsImg2, title: t('lms_preview.screenshots.roadmap') },
        { src: lmsImg3, title: t('lms_preview.screenshots.tracking') }
    ];

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

                {/* --- LMS Screenshot Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {screenshots.map((shot, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0c10] shadow-2xl transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-primary/5">
                                {/* Browser Mockup Header */}
                                <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400/20" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/20" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400/20" />
                                    <div className="ml-2 text-[8px] font-bold text-gray-500 uppercase tracking-[0.15em] truncate">
                                        SkillNexo LMS
                                    </div>
                                </div>

                                {/* Image Container */}
                                <div className="aspect-[4/3] overflow-hidden bg-black">
                                    <img
                                        src={shot.src}
                                        alt={shot.title}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                {/* Title Overlay */}
                                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{shot.title}</p>
                                </div>
                            </div>

                            {/* Decorative Glow */}
                            <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    )
}
