import { Section } from '../ui/Section'
import { motion } from 'framer-motion'
import { Linkedin, Globe, Briefcase, Video, Brain, UserCheck, GraduationCap, Trophy, Rocket } from 'lucide-react'
import { Button } from '../ui/Button'
import { useLanguage } from '../../context/LanguageContext'
import { useState } from 'react'
import { MediaModal } from '../ui/MediaModal'
import instructorPhoto from '../../assets/profile-pic1.jpeg'
import SLIITLogo from '../../assets/SLIIT_Logo.png'

import a1 from '../../assets/studennt reviews/a1.jpg'
import a2 from '../../assets/studennt reviews/a2.jpeg'
import a4 from '../../assets/studennt reviews/a4.jpeg'
import a6 from '../../assets/studennt reviews/a6.jpeg'
import a7 from '../../assets/studennt reviews/a7.jpeg'

export function Instructor() {
    const { t } = useLanguage()

    const [modalOpen, setModalOpen] = useState(false)
    const [modalType, setModalType] = useState('testimonials') // 'testimonials' | 'videos'

    const testimonials = [
        { type: 'image', src: a1 },
        { type: 'image', src: a2 },
        { type: 'image', src: a4 },
        { type: 'image', src: a6 },
        { type: 'image', src: a7 },
    ]

    const videos = [
        { type: 'video', src: 'https://www.youtube.com/embed/C2NBibuLQmw?si=hE0CcJJG2jqB2ui-' },
        { type: 'video', src: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7368319807055687681?collapsed=1' },
        { type: 'video', src: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7390063202568617984?collapsed=1' },
        { type: 'video', src: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7365950500531261440?collapsed=1' },
        // { type: 'video', src: 'https://www.youtube.com/embed/SqcY0GlETPk?si=Replcament1' },
    ]

    const education = [
        {
            school: "SLIIT",
            degree: "Master of Science in IT, Specializing in Enterprise Applications Development",
            date: "JAN 2026",
            logo: SLIITLogo
        },
        {
            school: "SLIIT",
            degree: "BSc(Hons) in Information Technology, Specialized in Software Engineering",
            date: "2021 - SEP 2025",
            logo: SLIITLogo
        }
    ]

    const experience = [
        {
            icon: <Rocket className="text-blue-400" size={18} />,
            title: "Industrial Expertise",
            text: "2+ Years of Software Engineering experience."
        },
        {
            icon: <Briefcase className="text-purple-400" size={18} />,
            title: "Product Architect",
            text: "Deployed 7+ industry-scale products."
        },
        {
            icon: <Trophy className="text-yellow-400" size={18} />,
            title: "Awarded Innovation",
            text: "Winner of multiple technical awards."
        }
    ]

    const openModal = (type) => {
        setModalType(type)
        setModalOpen(true)
    }

    const currentItems = modalType === 'testimonials' ? testimonials : videos
    const currentTitle = modalType === 'testimonials' ? t('instructor.testimonials_title') : t('instructor.videos_title')

    return (
        <Section id="instructor" className="overflow-visible py-10 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                {/* Left Column: Image (Sticky) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-5 lg:sticky lg:top-20"
                >
                    <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                        <div className="aspect-[4/5] lg:aspect-[3/4] bg-gray-900 relative overflow-hidden">
                            <img
                                src={instructorPhoto}
                                alt={t('instructor.name')}
                                className="absolute inset-0 w-full h-full object-cover object-top opacity-95 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h3 className="text-2xl font-bold text-white tracking-tight">{t('instructor.name')}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="p-1.5 bg-primary/20 rounded-lg text-primary">
                                        <Brain size={14} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">{t('instructor.role')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compact Stats */}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {[
                            { label: t('instructor.stats.experience.label'), value: t('instructor.stats.experience.value') },
                            { label: t('instructor.stats.students.label'), value: t('instructor.stats.students.value') },
                            { label: t('instructor.stats.focus.label'), value: t('instructor.stats.focus.value') },
                        ].map((stat, i) => (
                            <div key={i} className="text-center py-2 px-1 rounded-xl bg-white/5 border border-white/5 shadow-sm">
                                <div className="text-base font-bold text-white leading-tight">{stat.value}</div>
                                <div className="text-[9px] text-gray-500 uppercase tracking-tighter">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Column: Scrollable Content */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Header & Bio */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                            {t('instructor.title_prefix')} <span className="text-primary">{t('instructor.title_highlight')}</span>
                        </h2>
                        <div className="space-y-3 text-gray-400 text-base md:text-lg leading-relaxed border-l-2 border-primary/20 pl-6">
                            <p>
                                {t('instructor.bio.p1_prefix')} <span className="text-white font-semibold">{t('instructor.bio.p1_highlight')}</span> {t('instructor.bio.p1_suffix')}
                            </p>
                            <p>
                                {t('instructor.bio.p2_prefix')} <span className="text-secondary font-bold">{t('instructor.bio.p2_highlight')}</span> {t('instructor.bio.p2_suffix')}
                            </p>
                        </div>
                    </motion.div>

                    {/* Education - Two Column Grid on Tablet/Desktop for density */}
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-xl font-bold text-white">
                            <GraduationCap className="text-secondary" size={24} /> Education
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                            {education.map((edu, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ x: 5 }}
                                    className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-5 hover:bg-white/[0.08] hover:border-secondary/30 transition-all group"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-white p-2.5 flex-shrink-0 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                                        <img src={edu.logo} alt={edu.school} className="w-full h-auto object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2 mb-1">
                                            <h5 className="font-bold text-white group-hover:text-secondary transition-colors truncate">{edu.school}</h5>
                                            <span className="text-[9px] bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full font-bold uppercase whitespace-nowrap">{edu.date}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 line-clamp-2 md:line-clamp-none leading-snug">
                                            {edu.degree}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Professional & Actions Hub */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Highlights */}
                        <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/5">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-300 uppercase tracking-widest mb-2">
                                <Briefcase size={16} className="text-primary" /> Highlights
                            </h4>
                            <div className="space-y-4">
                                {experience.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="mt-1 flex-shrink-0">{item.icon}</div>
                                        <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-3 h-full">
                            <Button
                                variant="outline"
                                className="h-24 md:h-full flex-col gap-2 bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10 text-[10px] md:text-xs py-4 group"
                                onClick={() => window.open('https://www.linkedin.com/in/sehanarandara-1313b5218', '_blank')}
                            >
                                <Linkedin size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
                                <span className="font-bold opacity-80 uppercase tracking-wider">Linkedin</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-24 md:h-full flex-col gap-2 bg-primary/5 border-primary/20 hover:bg-primary/10 text-[10px] md:text-xs py-4 group"
                                onClick={() => window.open('https://sehan-arandara.vercel.app/', '_blank')}
                            >
                                <Globe size={20} className="text-primary group-hover:scale-110 transition-transform" />
                                <span className="font-bold opacity-80 uppercase tracking-wider">Portfolio</span>
                            </Button>
                            <Button
                                variant="ghost"
                                className="h-24 md:h-full flex-col gap-2 bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] md:text-xs py-4 group"
                                onClick={() => openModal('testimonials')}
                            >
                                <UserCheck size={20} className="text-green-400 group-hover:scale-110 transition-transform" />
                                <span className="font-bold opacity-80 uppercase tracking-wider">Reviews</span>
                            </Button>
                            <Button
                                variant="ghost"
                                className="h-24 md:h-full flex-col gap-2 bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] md:text-xs py-4 group"
                                onClick={() => openModal('videos')}
                            >
                                <Video size={20} className="text-red-400 group-hover:scale-110 transition-transform" />
                                <span className="font-bold opacity-80 uppercase tracking-wider">Demos</span>
                            </Button>
                        </div>
                    </div>

                </div>
            </div>

            <MediaModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={currentTitle}
                items={currentItems}
            />
        </Section>
    )
}
