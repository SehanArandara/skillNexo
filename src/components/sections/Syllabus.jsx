import { Section } from '../ui/Section'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle, Code2, Brain, Database, Shield, Globe, Layout, Server, Cpu, Box, Lock, Terminal, Layers, Play, NotebookText } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

// --- Data ---
const introTimeline = [
    {
        title: "Web Foundations",
        subtitle: "Orientation 01: Introduction to Web Development",
        items: [
            "Frontend vs Backend",
            "Setting up VS Code, Git & GitHub",
            "HTML , CSS , JS",
            "Web Dev roadmap overview"
        ],
        icon: <Layout className="text-secondary" />
    },
    {
        title: "AI/ML Foundations",
        subtitle: "Orientation 02: Introduction to AI & ML",
        items: [
            "What is ML , DL , LLM & Gen AI ?",
            "Supervised, Unsupervised & Reinforcement ML",
            "ML vs Deep Learning vs LLMs",
        ],
        icon: <Brain className="text-accent" />
    },
    {
        title: "AI-Powered Learning",
        subtitle: "Orientation 03: How to Learn & Code Using AI",
        items: [
            "Using ChatGPT for Debugging & Concepts",
            "Prompt Engineering for Developers",
            "AI as a Learning Assistant, not a shortcut",
            "Best practices for students"
        ],
        icon: <Terminal className="text-green-400" />
    }
]

const webTrack = [
    {
        day: "1",
        title: "Introduction to Web Development",
        tool: "HTML, CSS, JS, Git",
        icon: <Layout />,
        theory: ["Introduction to Web Apps", "HTML basics", "CSS basics", "Frontend vs Backend vs DB", "Git & GitHub basics"],
        practical: ["Build a simple landing page", "Push code to GitHub"]
    },
    {
        day: "2",
        title: "Frontend with React",
        tool: "React, Vite",
        icon: <Code2 />,
        theory: ["JavaScript fundamentals", "JSON", "React.js fundamentals", "Vite setup", "Project structure", "JSX, Components, Props, State"],
        practical: ["Build a React UI with Tailwind"]
    },
    {
        day: "3",
        title: "UI/UX & Responsive Design",
        tool: "Figma, Tailwind",
        icon: <Layers />,
        theory: ["UI vs UX principles", "Color theory", "Typography", "Layout systems", "Responsive design"],
        practical: ["Improve existing React UI"]
    },
    {
        day: "4",
        title: "Backend Foundations",
        tool: "Node, Express",
        icon: <Server />,
        theory: ["OOP basics", "Backend concepts", "MERN stack overview", "CRUD operations", "DB types (SQL vs NoSQL)"],
        practical: ["Simple backend API (CRUD)"]
    },
    {
        day: "5",
        title: "Authentication & Security",
        tool: "JWT, bcrypt",
        icon: <Lock />,
        theory: ["Full CRUD backend", "Authentication: Login, Register", "JWT basics"],
        practical: ["Auth system implementation"]
    },
    {
        day: "6",
        title: "Full-Stack Integration",
        tool: "Axios, REST",
        icon: <Globe />,
        theory: ["Connect frontend & backend", "API integration", "Error handling"],
        practical: ["Full-stack app connection"]
    },
    {
        day: "7",
        title: "Deployment & Supabase",
        tool: "Supabase, Vercel",
        icon: <Database />,
        theory: ["Supabase", "GitHub workflow", "Deployment concepts", "vercel"],
        practical: ["Deploy React + Supabase app"]
    },
    {
        day: "8",
        title: "Final Web Project",
        tool: "Vite, GitHub",
        icon: <Code2 />,
        theory: ["Final Project: React frontend", "Backend (Supabase / Flask)", "GitHub", "Deployment"],
        practical: ["Core SaaS features completion"]
    },
]

const aiTrack = [
    {
        day: "1",
        title: "What is AI & ML?",
        tool: "Python, Pandas",
        icon: <Terminal />,
        theory: ["What is Machine Learning?", "Types of ML", "ML pipeline in detail", "AI vs ML vs DL vs LLM vs Gen AI"],
        practical: ["Simple dataset exploration", "ML pipeline visualization"]
    },
    {
        day: "2",
        title: "Machine Learning Algorithms",
        tool: "Scikit-Learn",
        icon: <Cpu />,
        theory: ["ML algorithms overview", "Regression vs Classification", "Model training concept"],
        practical: ["Train a basic ML model (scikit-learn)"]
    },
    {
        day: "3",
        title: "Machine Learning Pipeline",
        tool: "NumPy, Matplotlib",
        icon: <Layers />,
        theory: ["Data preprocessing", "Feature engineering", "model Training", "Model evaluation metrics"],
        practical: ["Improve ML model accuracy"]
    },
    {
        day: "4",
        title: "Deep Learning basics",
        tool: "PyTorch",
        icon: <Brain />,
        theory: ["Deep Learning basics", "Neural networks", "Forward & backward propagation"],
        practical: ["Simple neural network demo"]
    },
    {
        day: "5",
        title: "Computer Vision",
        tool: "OpenCV",
        icon: <Layout />,
        theory: ["Computer Vision", "CNN basics", "Image classification"],
        practical: ["Image classifier demo"]
    },
    {
        day: "6",
        title: "LLMs & Gen AI",
        tool: "Gemini, RAG",
        icon: <Terminal />,
        theory: ["What is LLM?", "What is Generative AI?", "Prompt engineering"],
        practical: ["Gen AI mini project"]
    },
    {
        day: "7",
        title: "Model Serving & Flask",
        tool: "Flask",
        icon: <Server />,
        theory: ["Flask backend for AI", "Model serving", "API creation"],
        practical: ["AI model with Flask API"]
    },
    {
        day: "8",
        title: "Final AI Integration",
        tool: "Flask, API",
        icon: <Brain />,
        theory: ["AI integration into web app", "Career guidance"],
        practical: ["Project presentation"]
    },
]

// --- Components ---
function TimelineItem({ data, index }) {
    return (
        <div className="relative pl-8 md:pl-0">
            {/* Connector Line (Desktop Center) */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-white/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-dark-bg border-2 border-primary mt-2" />
            </div>

            {/* Mobile Line */}
            <div className="md:hidden absolute left-2 top-0 bottom-0 w-0.5 bg-white/10" />
            <div className="md:hidden absolute left-0 top-2 w-4 h-4 rounded-full bg-dark-bg border-2 border-primary" />

            <div className={`md:flex items-center justify-between gap-8 py-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="hidden md:block w-1/2" />
                <div className="md:w-1/2">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-primary/30 transition-colors"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-white/5 rounded-lg">{data.icon}</div>
                            <div>
                                <h4 className="text-sm text-primary font-bold uppercase tracking-wider">{data.title}</h4>
                                <h3 className="text-xl font-bold">{data.subtitle}</h3>
                            </div>
                        </div>
                        <ul className="space-y-2">
                            {data.items.map((item, i) => (
                                <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-600 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

function DayAccordion({ data, theme = "blue" }) {
    const [isOpen, setIsOpen] = useState(false)
    const isBlue = theme === "blue"
    const { t } = useLanguage()

    return (
        <motion.div
            onClick={() => setIsOpen(!isOpen)}
            initial={false}
            className={`
        border-b cursor-pointer group transition-all duration-300
        ${isBlue ? 'border-primary/20 hover:bg-primary/5' : 'border-secondary/20 hover:bg-secondary/5'}
      `}
        >
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center transition-colors
              ${isBlue ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}
            `}>
                        {data.icon}
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 font-mono mb-0.5">Week {data.day}</div>
                        <div className="font-semibold text-sm sm:text-base">{data.title}</div>
                    </div>
                </div>
                {/* Tool Badge */}
                <div className={`text-xs px-2 py-1 rounded border hidden sm:block ${isBlue ? 'border-primary/30 text-primary' : 'border-secondary/30 text-secondary'}`}>
                    {data.tool}
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pl-[4.5rem] space-y-4">
                            {data.theory && (
                                <div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary mb-2">
                                        <NotebookText size={12} /> Theory
                                    </div>
                                    <ul className="space-y-1">
                                        {data.theory.map((item, i) => (
                                            <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/30 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {data.practical && (
                                <div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-accent mb-2">
                                        <Code2 size={12} /> Practical
                                    </div>
                                    <ul className="space-y-1">
                                        {data.practical.map((item, i) => (
                                            <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/30 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export function Syllabus() {
    const { t } = useLanguage()

    return (
        <Section id="syllabus" dark className="relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-24">
                    {/* Left: Intro & Timeline */}
                    <div className="space-y-12">
                        <div className="text-left">
                            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">{t('syllabus.section_title')}</h2>
                            <p className="text-gray-400 text-lg leading-relaxed border-l-4 border-primary/50 pl-6 italic">
                                {t('syllabus.section_subtitle')}
                            </p>
                        </div>

                        <div className="space-y-6">
                            {introTimeline.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-5 group"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                        {item.icon}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-primary text-xs font-bold uppercase tracking-widest">{item.title}</h4>
                                        <h3 className="text-xl font-bold text-white group-hover:text-primary/80 transition-colors">{item.subtitle}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{item.items.join(" • ")}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Path Video */}
                    <div className="lg:sticky lg:top-24">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/30 border-8 border-white/5 bg-card-bg group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent pointer-events-none z-10" />
                                <div className="relative aspect-[9/16] lg:aspect-video bg-black">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src="https://www.youtube.com/embed/OPqqEzMApzw?si=hE0CcJJG2jqB2ui-"
                                        title="Roadmap Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0 z-0"
                                    />
                                </div>
                            </div>

                            {/* Accent Badge */}
                            <div className="absolute -bottom-6 -right-6 md:right-10 bg-primary p-6 rounded-3xl shadow-2xl z-20 hidden md:flex items-center gap-4 border-4 border-dark-bg">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <Play fill="white" className="text-white ml-1" />
                                </div>
                                <div>
                                    <p className="text-white text-[10px] font-bold uppercase tracking-tighter opacity-80">Video Guide</p>
                                    <p className="text-white font-black text-lg">Watch Roadmap</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* --- Intensive Track Full Width --- */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <span className="text-secondary font-mono text-sm uppercase tracking-[0.3em]">{t('syllabus.intensive_subtitle')}</span>
                        <h3 className="text-3xl md:text-5xl font-black mt-2">{t('syllabus.intensive_title')}</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 border border-white/10 rounded-[3rem] overflow-hidden bg-card-bg shadow-3xl">
                        {/* Left: Web Development */}
                        <div className="relative border-b lg:border-b-0 lg:border-r border-white/10">
                            <div className="p-8 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
                                <h4 className="text-2xl font-black text-primary flex items-center gap-3">
                                    <Globe className="w-7 h-7" /> {t('syllabus.web_engine')}
                                </h4>
                                <span className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase">8 Weeks</span>
                            </div>
                            <div className="bg-dark-bg/30">
                                {webTrack.map((day, i) => (
                                    <DayAccordion key={i} data={day} theme="blue" />
                                ))}
                            </div>
                        </div>

                        {/* Right: AI Brain */}
                        <div className="relative">
                            <div className="p-8 bg-secondary/10 border-b border-secondary/20 flex items-center justify-between">
                                <h4 className="text-2xl font-black text-secondary flex items-center gap-3">
                                    <Brain className="w-7 h-7" /> {t('syllabus.ai_brain')}
                                </h4>
                                <span className="bg-secondary/20 text-secondary text-[10px] font-bold px-3 py-1 rounded-full uppercase">8 Weeks</span>
                            </div>
                            <div className="bg-dark-bg/30">
                                {aiTrack.map((day, i) => (
                                    <DayAccordion key={i} data={day} theme="purple" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    )
}
