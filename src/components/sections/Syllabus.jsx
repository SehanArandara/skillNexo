import { Section } from '../ui/Section'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle, Code2, Brain, Database, Shield, Globe, Layout, Server, Cpu, Box, Lock, Terminal, Layers } from 'lucide-react'

// --- Data ---
const introTimeline = [
    {
        title: "The Gateway (Free)",
        subtitle: "Day 0: The Free Seminar",
        items: [
            "The 2025 Tech Landscape: Why Web + AI?",
            "Decoding SDLC & 3-Tier Architecture.",
            "Live Demo: Transforming a static site into an AI app in 15 mins."
        ],
        icon: <Globe className="text-blue-400" />
    },
    {
        title: "The Onboarding (Paid Only)",
        subtitle: "Orientation 01: Web Foundations",
        items: [
            "Setting up the \"God-Tier\" Dev Environment.",
            "The Modern Web Stack: Why we chose React & Node."
        ],
        icon: <Layout className="text-secondary" />
    },
    {
        title: "AI/ML Primer",
        subtitle: "Orientation 02: Mathematical Intuition",
        items: [
            "Mathematical intuition without the \"scary\" math.",
            "The ML Pipeline: From Data to Deployment."
        ],
        icon: <Brain className="text-accent" />
    },
    {
        title: "The AI-Powered Student",
        subtitle: "Orientation 03: 10x Your Speed",
        items: [
            "How to use Cursor, ChatGPT, and Copilot effectively."
        ],
        icon: <Terminal className="text-green-400" />
    }
]

const webTrack = [
    { day: "Day 1", title: "UI/UX Mastery (Tailwind)", tool: "Tailwind", icon: <Layout />, task: "Build a Landing Page" },
    { day: "Day 2", title: "React.js: State & Hooks", tool: "React", icon: <Code2 />, task: "Interactive Dashboard" },
    { day: "Day 3", title: "Backend Arch. (Node/Express)", tool: "Node", icon: <Server />, task: "REST API Setup" },
    { day: "Day 4", title: "Database (Postgres/Mongo)", tool: "SQL", icon: <Database />, task: "Schema Design" },
    { day: "Day 5", title: "Auth & Security (JWT)", tool: "JWT", icon: <Lock />, task: "Secure Login System" },
    { day: "Day 6", title: "API Dev & Docs", tool: "Postman", icon: <Globe />, task: "Swagger Docs" },
    { day: "Day 7", title: "Deployment (Docker/AWS)", tool: "Docker", icon: <Box />, task: "Containerize App" },
    { day: "Day 8", title: "Final Project: Frontend", tool: "Vite", icon: <Layout />, task: "SaaS UI Complete" },
]

const aiTrack = [
    { day: "Day 1", title: "Python for Data Science", tool: "Pandas", icon: <Terminal />, task: "Data Analysis Script" },
    { day: "Day 2", title: "Exploratory Data Analysis", tool: "Jupyter", icon: <Layers />, task: "Visualize Trends" },
    { day: "Day 3", title: "Linear & Logistic Regression", tool: "Sklearn", icon: <Cpu />, task: "Predict Pricing" },
    { day: "Day 4", title: "Decision Trees & Forests", tool: "Models", icon: <Brain />, task: "Classification Model" },
    { day: "Day 5", title: "Neural Networks & Deep Learning", tool: "PyTorch", icon: <Brain />, task: "Build a Neural Net" },
    { day: "Day 6", title: "Natural Language Processing", tool: "NLTK", icon: <CheckCircle />, task: "Sentiment Analyzer" },
    { day: "Day 7", title: "LLMs & Prompt Eng.", tool: "OpenAI", icon: <Terminal />, task: "Custom Chatbot" },
    { day: "Day 8", title: "Final Project: AI Brain", tool: "API", icon: <Server />, task: "Integrate AI Model" },
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
                        <div className="text-xs text-gray-500 font-mono mb-0.5">{data.day}</div>
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
                        <div className="px-4 pb-4 pl-[4.5rem]">
                            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide opacity-70">
                                <CheckCircle size={12} /> Daily Task
                            </div>
                            <div className="text-gray-400 text-sm mt-1">
                                {data.task}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export function Syllabus() {
    return (
        <Section id="syllabus" dark className="relative">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">The Dual-Engine <span className="text-white">Path</span></h2>
                <p className="text-gray-400">Mastering the two worlds of modern engineering.</p>
            </div>

            {/* --- Part 1: Timeline (Gateway & Onboarding) --- */}
            <div className="max-w-4xl mx-auto mb-20">
                {introTimeline.map((item, i) => (
                    <TimelineItem key={i} data={item} index={i} />
                ))}
            </div>

            {/* --- Part 2: Split Track --- */}
            <div>
                <div className="text-center mb-10">
                    <h3 className="text-2xl font-bold">The 16-Day Intensive Masterclass</h3>
                    <p className="text-gray-500 text-sm mt-2">Simultaneous Tracks: Web (Mon) + AI (Thu)</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 max-w-6xl mx-auto border border-white/10 rounded-3xl overflow-hidden bg-card-bg/50 backdrop-blur-sm">

                    {/* Left: Web Development */}
                    <div className="relative border-b lg:border-b-0 lg:border-r border-white/10">
                        <div className="p-6 bg-primary/10 border-b border-primary/20 sticky top-0 z-10 backdrop-blur-md">
                            <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                                <Globe className="w-5 h-5" /> Web Engine
                            </h4>
                        </div>
                        <div className="bg-dark-bg/50">
                            {webTrack.map((day, i) => (
                                <DayAccordion key={i} data={day} theme="blue" />
                            ))}
                        </div>
                    </div>

                    {/* Right: AI Brain */}
                    <div className="relative">
                        <div className="p-6 bg-secondary/10 border-b border-secondary/20 sticky top-0 z-10 backdrop-blur-md">
                            <h4 className="text-xl font-bold text-secondary flex items-center gap-2">
                                <Brain className="w-5 h-5" /> AI Brain
                            </h4>
                        </div>
                        <div className="bg-dark-bg/50">
                            {aiTrack.map((day, i) => (
                                <DayAccordion key={i} data={day} theme="purple" />
                            ))}
                        </div>
                    </div>

                </div>
            </div>

        </Section>
    )
}
