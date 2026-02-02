import React, { cloneElement } from 'react'
import { Section } from '../ui/Section'
import { motion } from 'framer-motion'
import { Waypoints, BadgeCheck, Flame, Eye, Briefcase, Play } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export function WhyUs() {
    const { t } = useLanguage()

    // Moved inside component to access 't'
    const features = [
        {
            icon: <Waypoints className="w-8 h-8 text-secondary" />,
            title: t('why_us.features.two_in_one.title'),
            description: t('why_us.features.two_in_one.description')
        },
        {
            icon: <BadgeCheck className="w-8 h-8 text-primary" />,
            title: t('why_us.features.mentorship.title'),
            description: t('why_us.features.mentorship.description')
        },
        {
            icon: <Flame className="w-8 h-8 text-orange-500" />,
            title: t('why_us.features.lms.title'),
            description: t('why_us.features.lms.description')
        },
        {
            icon: <Eye className="w-8 h-8 text-accent" />,
            title: t('why_us.features.monitoring.title'),
            description: t('why_us.features.monitoring.description')
        },
        {
            icon: <Briefcase className="w-8 h-8 text-green-400" />,
            title: t('why_us.features.job_oriented.title'),
            description: t('why_us.features.job_oriented.description')
        }
    ]

    return (
        <Section id="why-us" className="relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Content & Features */}
                    <div className="space-y-12">
                        <div className="text-left">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                {t('why_us.title_prefix')} <span className="text-primary">{t('why_us.title_highlight')}</span> {t('why_us.title_suffix')}
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                {t('why_us.subtitle')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group flex flex-col"
                                >
                                    <div className="mb-4 p-3 rounded-xl bg-white/5 w-fit group-hover:scale-110 transition-transform">
                                        {cloneElement(feature.icon, { className: "w-6 h-6" })}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 text-xs leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Video Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/10 bg-card-bg group">
                            {/* Browser/Window Header */}
                            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                                </div>
                                <div className="ml-4 h-4 rounded-full bg-white/5 w-1/2" />
                            </div>

                            <div className="relative aspect-[9/16] lg:aspect-video bg-black">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src="https://www.youtube.com/embed/covEJ0NkmDM?si=hE0CcJJG2jqB2ui-"
                                    title="Why Choose Us"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                    className="absolute inset-0"
                                ></iframe>
                                {/* Overlay Gradient for Premium Look */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full -z-10" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 blur-3xl rounded-full -z-10" />
                    </motion.div>
                </div>
            </div>
        </Section>
    )
}
