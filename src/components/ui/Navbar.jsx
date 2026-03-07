import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Rocket } from 'lucide-react'
import { Button } from './Button'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { useLanguage } from '../../context/LanguageContext'

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { t } = useLanguage()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Why Us', href: '#why-us' },
        { name: 'Syllabus', href: '#syllabus' },
        { name: 'Instructor', href: '#instructor' },
        { name: 'Pricing', href: '#pricing' },
    ]

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-dark-bg ${isScrolled
                ? 'md:bg-dark-bg/80 md:backdrop-blur-md border-white/10 py-4'
                : 'md:bg-transparent border-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">

                {/* Logo */}
                <a href="#" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
                        <Rocket size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <span className="text-xl font-bold font-sans tracking-tight">SkillNexo</span>
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex gap-6">
                        {navLinks.map(link => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Button size="sm" onClick={() => document.getElementById('register').scrollIntoView({ behavior: 'smooth' })}>
                            {t('nav.register')}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <LanguageSwitcher />
                    <button className="text-white" onClick={() => setMobileMenuOpen(true)}>
                        <Menu />
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            className="fixed inset-0 bg-dark-bg z-50 flex flex-col p-8"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <span className="text-xl font-bold">SkillNexo</span>
                                <button onClick={() => setMobileMenuOpen(false)}>
                                    <X />
                                </button>
                            </div>

                            <div className="flex flex-col gap-6 text-xl">
                                {navLinks.map(link => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="font-medium text-gray-400 hover:text-white"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </div>

                            <div className="mt-auto">
                                <Button className="w-full" onClick={() => {
                                    setMobileMenuOpen(false);
                                    document.getElementById('register').scrollIntoView();
                                }}>
                                    {t('nav.register')}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    )
}
