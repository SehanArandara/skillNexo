import { Section } from '../ui/Section'
import { Button } from '../ui/Button'
import { Check } from 'lucide-react'

const Tiers = [
    {
        name: "Free Seminar",
        price: "$0",
        description: "Perfect for getting a taste of what's possible.",
        features: ["Access to Orientation", "Basic AI Concepts", "Live Q&A Session", "Curriculum Overview"],
        cta: "Register for Free",
        highlight: false
    },
    {
        name: "Full Course",
        price: "$499",
        description: "The complete 16-day intensive program.",
        features: ["16-Day Intensive Program", "Certificate of Completion", "Full LMS Access", "Private Discord Community", "Lifetime Updates", "1-on-1 Code Reviews"],
        cta: "Enroll Now",
        highlight: true
    }
]

export function Pricing() {
    return (
        <Section id="pricing" className="bg-gradient-to-b from-dark-bg to-[#0a0a0a]">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple <span className="text-primary">Pricing</span></h2>
                <p className="text-gray-400">Invest in your career. The ROI is infinite.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {Tiers.map((tier, index) => (
                    <div
                        key={index}
                        className={`
              relative p-8 rounded-2xl border flex flex-col
              ${tier.highlight
                                ? 'bg-white/5 border-primary/50 shadow-2xl shadow-primary/10'
                                : 'bg-transparent border-white/10'
                            }
            `}
                    >
                        {tier.highlight && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-xl font-medium text-gray-300 mb-2">{tier.name}</h3>
                            <div className="text-4xl font-bold mb-4">{tier.price}</div>
                            <p className="text-gray-400 text-sm">{tier.description}</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {tier.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                    <Check size={16} className={tier.highlight ? "text-primary" : "text-gray-500"} />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button variant={tier.highlight ? 'primary' : 'outline'} className="w-full">
                            {tier.cta}
                        </Button>
                    </div>
                ))}
            </div>
        </Section>
    )
}
