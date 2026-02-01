import { motion } from 'framer-motion'
import { MessageCircle, Mail } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export function Contact() {
    const { t } = useLanguage()

    return (
        <section id="contact" className="relative py-24 width-full bg-dark-bg overflow-hidden">
            {/* Background Gradient - Full Width */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-dark-bg to-dark-bg pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('contact.title')}</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {t('contact.description')}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* WhatsApp */}
                    <motion.a
                        href="https://wa.me/94710445662"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 transition-all cursor-pointer group"
                    >
                        <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <MessageCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{t('contact.whatsapp')}</h3>
                        <p className="text-gray-400 font-mono text-lg">+94 71 044 5662</p>
                    </motion.a>

                    {/* Email */}
                    <motion.a
                        href="mailto:sdarandara123@gmail.com"
                        whileHover={{ scale: 1.02 }}
                        className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all cursor-pointer group"
                    >
                        <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Mail size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{t('contact.email')}</h3>
                        <p className="text-gray-400 font-mono text-lg">sdarandara123@gmail.com</p>
                    </motion.a>
                </div>
            </div>
        </section>
    )
}
