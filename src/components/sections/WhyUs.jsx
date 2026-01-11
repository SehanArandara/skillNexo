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
        <Section id="why-us" className="text-center relative">
            <div className="mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                    {t('why_us.title_prefix')} <span className="text-primary">{t('why_us.title_highlight')}</span> {t('why_us.title_suffix')}
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    {t('why_us.subtitle')}
                </p>
            </div>

            {/* Features Grid - Clean & Minimal - Flexbox for perfect centering */}
            <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto mb-20">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group text-left hover:shadow-lg hover:shadow-primary/5 flex flex-col"
                    >
                        <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit group-hover:scale-110 transition-transform ring-1 ring-white/10">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </motion.div>
                ))}
            </div>

            {/* Video Section - Simpler & Cleaner Design - Moved to Bottom & Medium Size */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl mx-auto" // Changed from max-w-5xl to max-w-3xl for medium size
            >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/10 bg-card-bg">
                    {/* Browser/Window Header to give it a techy feel */}
                    <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        <div className="ml-4 h-6 rounded-full bg-white/5 w-1/3" />
                    </div>

                    <div className="relative aspect-video bg-black">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/C2NBibuLQmw?si=hE0CcJJG2jqB2ui-"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            className="absolute inset-0"
                        ></iframe>
                    </div>
                </div>
            </motion.div>

        </Section>
    )
}
