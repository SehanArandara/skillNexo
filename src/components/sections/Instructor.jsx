import { Section } from '../ui/Section'
import { motion } from 'framer-motion'
import { Linkedin, Globe, MessageSquare, Award, Code2, Brain, Database, Cloud } from 'lucide-react'
import { Button } from '../ui/Button'

export function Instructor() {
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
                        {/* Image placeholder - Replace src with actual image path */}
                        <div className="aspect-[3/4] bg-gray-800 flex items-end relative overflow-hidden">
                            <img
                                src="/assets/profile-pic.jpeg"
                                alt="Sehan Arandara"
                                className="absolute inset-0 w-full h-full object-cover object-top opacity-80 group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => { e.target.style.display = 'none' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-90" />

                            <div className="relative z-20 p-8 w-full">
                                <h3 className="text-3xl font-bold text-white">Sehan Arandara</h3>
                                <p className="text-primary font-medium flex items-center gap-2">
                                    <Brain size={16} /> Software Engineer & AI instructor
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
                        <h2 className="text-4xl font-bold mb-4">Meet Your <span className="text-primary">Instructor</span></h2>
                        <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
                            <p>
                                I'm a <span className="text-white font-semibold">Software Engineer & AI Specialist</span> focused on R&D and Industrial Applications. I bridge the gap between theory and practice, building scalable AI systems like OCR engines and LLM agents.
                            </p>
                            <p>
                                With <span className="text-secondary font-bold">500+ students mentored</span>, I teach the exact skills needed to thrive in the modern tech industry.
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { label: "Experience", value: "2+ Years" },
                            { label: "Students", value: "500+" },
                            { label: "Focus", value: "R&D" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Tech Stack */}
                    {/* <div>
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Expertise</h4>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { icon: <Code2 size={18} />, name: "React & Laravel" },
                                { icon: <Brain size={18} />, name: "AI & ML" },
                                { icon: <Database size={18} />, name: "SQL & Python" },
                                { icon: <Cloud size={18} />, name: "AWS & DevOps" },
                            ].map((tech, i) => (
                                <div key={i} className="px-4 py-2 bg-white/5 rounded-full text-sm text-gray-300 border border-white/5 flex items-center gap-2 hover:text-white hover:bg-white/10 transition-colors">
                                    {tech.icon} {tech.name}
                                </div>
                            ))}
                        </div>
                    </div> */}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="gap-2" onClick={() => window.open('https://sehan-arandara.vercel.app/', '_blank')}>
                            <Globe size={20} /> View Portfolio
                        </Button>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button variant="outline" className="flex-1 sm:flex-none gap-2" onClick={() => window.open('https://www.linkedin.com/in/sehanarandara-1313b5218', '_blank')}>
                                <Linkedin size={20} /> LinkedIn
                            </Button>
                            <Button variant="ghost" className="flex-1 sm:flex-none gap-2 hover:bg-white/5">
                                <MessageSquare size={20} /> Testimonials
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </Section>
    )
}
