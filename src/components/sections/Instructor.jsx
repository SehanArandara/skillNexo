import { Section } from '../ui/Section'
import { motion } from 'framer-motion'
import { Linkedin, Globe, MessageSquare, Briefcase, Video, Brain, UserCheck } from 'lucide-react'
import { Button } from '../ui/Button'
import { useLanguage } from '../../context/LanguageContext'
import { useState } from 'react'
import { MediaModal } from '../ui/MediaModal'

import a1 from '../../assets/studennt reviews/a1.jpg'
import a2 from '../../assets/studennt reviews/a2.jpeg'
import a4 from '../../assets/studennt reviews/a4.jpeg'
import a6 from '../../assets/studennt reviews/a6.jpeg'
import a7 from '../../assets/studennt reviews/a7.jpeg'

export function Instructor() {
    const { t } = useLanguage()

    const [modalOpen, setModalOpen] = useState(false)
    const [modalType, setModalType] = useState('testimonials') // 'testimonials' | 'videos'

    // Data
    const testimonials = [
        { type: 'image', src: a1 },
        { type: 'image', src: a2 },
        { type: 'image', src: a4 },
        { type: 'image', src: a6 },
        { type: 'image', src: a7 },
    ]

    const videos = [
        { type: 'video', src: 'https://www.youtube.com/embed/C2NBibuLQmw?si=hE0CcJJG2jqB2ui-' }, // Existing one
        { type: 'video', src: 'https://www.youtube.com/embed/SqcY0GlETPk?si=Replcament1' }, // React
    ]

    const openModal = (type) => {
        setModalType(type)
        setModalOpen(true)
    }

    const currentItems = modalType === 'testimonials' ? testimonials : videos
    const currentTitle = modalType === 'testimonials' ? t('instructor.testimonials_title') : t('instructor.videos_title')

    return (
        <Section id="instructor" className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Profile Image & Stats */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                        {/* Image placeholder */}
                        <div className="aspect-[3/4] bg-gray-800 flex items-end relative overflow-hidden">
                            <img
                                src="/assets/profile-pic.jpeg"
                                alt={t('instructor.name')}
                                className="absolute inset-0 w-full h-full object-cover object-top opacity-80 group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => { e.target.style.display = 'none' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-90" />

                            <div className="relative z-20 p-8 w-full">
                                <h3 className="text-3xl font-bold text-white">{t('instructor.name')}</h3>
                                <p className="text-primary font-medium flex items-center gap-2">
                                    <Brain size={16} /> {t('instructor.role')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 -left-10 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <div className="absolute bottom-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse delay-700" />
                </motion.div>

                {/* Bio & Content */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-4xl font-bold mb-4">{t('instructor.title_prefix')} <span className="text-primary">{t('instructor.title_highlight')}</span></h2>
                        <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
                            <p>
                                {t('instructor.bio.p1_prefix')} <span className="text-white font-semibold">{t('instructor.bio.p1_highlight')}</span> {t('instructor.bio.p1_suffix')}
                            </p>
                            <p>
                                {t('instructor.bio.p2_prefix')} <span className="text-secondary font-bold">{t('instructor.bio.p2_highlight')}</span> {t('instructor.bio.p2_suffix')}
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { label: t('instructor.stats.experience.label'), value: t('instructor.stats.experience.value') },
                            { label: t('instructor.stats.students.label'), value: t('instructor.stats.students.value') },
                            { label: t('instructor.stats.focus.label'), value: t('instructor.stats.focus.value') },
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                        {/* Row 1: Primary Links */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="flex-1 gap-2" onClick={() => window.open('https://sehan-arandara.vercel.app/', '_blank')}>
                                <Globe size={20} /> {t('instructor.portfolio_btn')}
                            </Button>
                            <Button variant="outline" size="lg" className="flex-1 gap-2 border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400" onClick={() => window.open('https://www.linkedin.com/in/sehanarandara-1313b5218', '_blank')}>
                                <Linkedin size={20} /> {t('instructor.linkedin_btn')}
                            </Button>
                        </div>

                        {/* Row 2: Content Popups */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                variant="ghost"
                                className="flex-1 gap-2 bg-white/5 hover:bg-white/10"
                                onClick={() => openModal('testimonials')}
                            >
                                <UserCheck size={20} className="text-green-400" /> {t('instructor.testimonials_btn')}
                            </Button>
                            <Button
                                variant="ghost"
                                className="flex-1 gap-2 bg-white/5 hover:bg-white/10"
                                onClick={() => openModal('videos')}
                            >
                                <Video size={20} className="text-red-400" /> {t('instructor.videos_btn')}
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
