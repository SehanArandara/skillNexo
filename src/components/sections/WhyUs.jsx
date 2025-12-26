import { Section } from '../ui/Section'
import { motion } from 'framer-motion'
import { Waypoints, BadgeCheck, Flame, Eye, Briefcase, Play } from 'lucide-react'

const features = [
    {
        icon: <Waypoints className="w-8 h-8 text-secondary" />,
        title: "The Power of \"Two-in-One\"",
        description: "Combine Full-Stack Dev with ML. Build apps that think and predict, not just static pages."
    },
    {
        icon: <BadgeCheck className="w-8 h-8 text-primary" />,
        title: "Industry-Led Mentorship",
        description: "Learn from a Senior Engineer. Master real-world best practices and production-ready workflows."
    },
    {
        icon: <Flame className="w-8 h-8 text-orange-500" />,
        title: "The \"Next-Gen\" LMS Experience",
        description: "Gamified learning with streaks and daily tasks. Our LMS ensures you stay consistent and finish."
    },
    {
        icon: <Eye className="w-8 h-8 text-accent" />,
        title: "360° Student Monitoring",
        description: "Personalized feedback and monitoring. We track your progress and guide you through every blocker."
    },
    {
        icon: <Briefcase className="w-8 h-8 text-green-400" />,
        title: "Job-Oriented Curriculum",
        description: "Master React, Node, & AI. Build a portfolio designed to impress recruiters and launch your career."
    }
]

export function WhyUs() {
    return (
        <Section id="why-us" className="text-center">
            <div className="mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose <span className="text-primary">SkillNexo</span>?</h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    We don't just teach coding; we build the next generation of AI Engineers.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-20 max-w-7xl mx-auto">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`
                p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group text-left
                col-span-1 md:col-span-1 lg:col-span-2
                ${index === 3 ? 'lg:col-start-2' : ''} 
            `}
                    >
                        <div className="mb-6 p-4 rounded-full bg-white/5 w-fit group-hover:scale-110 transition-transform">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </motion.div>
                ))}
            </div>

            {/* Video Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative aspect-video bg-black"
            >
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
            </motion.div>

        </Section>
    )
}
