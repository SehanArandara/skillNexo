import { useState } from 'react'
import { Section } from '../ui/Section'
import { Button } from '../ui/Button'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export function Registration() {
    const { t } = useLanguage()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        level: 'beginner'
    })
    const [status, setStatus] = useState('idle') // idle, loading, success, error
    const [errorMsg, setErrorMsg] = useState('')

    const validateForm = () => {
        if (formData.name.trim().length < 3) return t('registration.validation.name_short')
        if (formData.name.length > 50) return t('registration.validation.name_long')

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) return t('registration.validation.email_invalid')

        const phoneRegex = /^\d{10}$/
        if (!phoneRegex.test(formData.whatsapp)) return t('registration.validation.whatsapp_invalid')

        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg('')

        const validationError = validateForm()
        if (validationError) {
            setErrorMsg(validationError)
            return
        }

        setStatus('loading')

        try {
            // Insert into Supabase
            const { error } = await supabase
                .from('registered_student')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        whatsapp: formData.whatsapp,
                        level: formData.level
                    }
                ])

            if (error) throw error

            setStatus('success')
            setFormData({ name: '', email: '', whatsapp: '', level: 'beginner' })
        } catch (error) {
            console.error('Error registering student:', error.message)
            setStatus('error')
        }
    }

    return (
        <Section id="register" dark className="relative overflow-hidden">
            <div className="max-w-xl mx-auto relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">{t('registration.title')}</h2>
                    <p className="text-gray-400">{t('registration.subtitle')}</p>
                </div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-card-bg p-8 rounded-2xl border border-white/10 shadow-2xl"
                >
                    {status === 'success' ? (
                        <div className="text-center py-12 space-y-4">
                            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">{t('registration.success_title')}</h3>
                            <p className="text-gray-400">{t('registration.success_msg')}</p>
                            <Button type="button" variant="outline" onClick={() => setStatus('idle')}>{t('registration.register_another')}</Button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{t('registration.name_label')}</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={50}
                                    className="w-full bg-dark-bg/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder={t('registration.name_placeholder')}
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{t('registration.email_label')}</label>
                                <input
                                    type="email"
                                    required
                                    maxLength={60}
                                    className="w-full bg-dark-bg/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{t('registration.whatsapp_label')}</label>
                                <input
                                    type="tel"
                                    required
                                    maxLength={10}
                                    className="w-full bg-dark-bg/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="07XXXXXX"
                                    value={formData.whatsapp}
                                    onChange={e => {
                                        const re = /^[0-9\b]+$/;
                                        if (e.target.value === '' || re.test(e.target.value)) {
                                            setFormData({ ...formData, whatsapp: e.target.value })
                                        }
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{t('registration.level_label')}</label>
                                <select
                                    className="w-full bg-dark-bg/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                                    value={formData.level}
                                    onChange={e => setFormData({ ...formData, level: e.target.value })}
                                >
                                    <option value="beginner">{t('registration.level_options.beginner')}</option>
                                    <option value="intermediate">{t('registration.level_options.intermediate')}</option>
                                    <option value="advanced">{t('registration.level_options.advanced')}</option>
                                </select>
                            </div>

                            {/* Validation Error Message */}
                            {errorMsg && (
                                <div className="flex items-center gap-2 text-yellow-400 text-sm bg-yellow-400/10 p-3 rounded-lg">
                                    <AlertCircle size={16} />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            {/* System Error / Contact Support Message */}
                            {status === 'error' && (
                                <div className="flex flex-col gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        <span>{t('registration.error_msg')}</span>
                                    </div>
                                    <p className="pl-6 text-xs text-red-400/80">
                                        {t('registration.contact_support')} 0779920805
                                    </p>
                                </div>
                            )}

                            <Button type="submit" disabled={status === 'loading'} className="w-full text-lg font-semibold py-4">
                                {status === 'loading' ? t('registration.processing') : t('registration.submit_btn')}
                            </Button>
                        </>
                    )}
                </motion.form>
            </div>
        </Section>
    )
}
