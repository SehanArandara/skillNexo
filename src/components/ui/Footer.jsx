import { Facebook, Linkedin, Youtube, Mail, Phone, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-black border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-white">SkillNexo</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Empowering the next generation of AI Engineers through comprehensive Web Development and AI/ML training.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/refund-policy" className="text-gray-400 hover:text-primary transition-colors text-sm">
                                    Refund Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors text-sm">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms-conditions" className="text-gray-400 hover:text-primary transition-colors text-sm">
                                    Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-gray-400 text-sm">
                                <Phone size={16} className="text-primary" />
                                <a href="tel:+94710445662" className="hover:text-primary transition-colors">
                                    +94 71 044 5662
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400 text-sm">
                                <MessageCircle size={16} className="text-green-500" />
                                <a href="https://wa.me/94710445662" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                    WhatsApp
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400 text-sm">
                                <Mail size={16} className="text-primary" />
                                <a href="mailto:sdarandara123@gmail.com" className="hover:text-primary transition-colors">
                                    sdarandara123@gmail.com
                                </a>
                            </li>
                        </ul>

                        {/* Social Media */}
                        <div className="flex gap-4 mt-6">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all"
                            >
                                <Linkedin size={20} />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all"
                            >
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 text-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {currentYear} SkillNexo. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
