import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Section } from '../ui/Section'
import { Play } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export function Hero() {
    const { t } = useLanguage()

    return (
        <Section id="hero" dark className="pt-24 pb-12 md:pt-32 md:pb-20 min-h-[90vh] flex flex-col justify-center">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center lg:text-left space-y-6"
                >
                    <div className="inline-block px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-2">
                        {t('hero.badge')}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                        {t('hero.title_line1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t('hero.title_line2')}</span>
                    </h1>

                    <p className="text-lg text-gray-400 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        {t('hero.description')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto hover:shadow-primary/50 text-base py-3"
                            onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            {t('hero.cta_register')}
                        </Button>
                        <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base py-3">
                            <Play size={18} /> {t('hero.cta_promo')}
                        </Button>
                    </div>
                </motion.div>

                {/* Video Placeholder */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="relative max-w-xl mx-auto lg:mx-0 w-full"
                >
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/10 bg-card-bg group cursor-pointer group">
                        {/* Placeholder Content */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/40 transition-colors">
                            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                <Play size={40} className="text-white fill-white ml-2" />
                            </div>
                        </div>
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl opacity-50" />
                </motion.div>

            </div>
        </Section>
    )
}
