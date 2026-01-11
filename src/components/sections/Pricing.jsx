import { Section } from '../ui/Section'
import { Button } from '../ui/Button'
import { Check } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export function Pricing() {
    const { t } = useLanguage()

    const tiers = [
        {
            name: t('pricing.free.name'),
            price: t('pricing.free.price'),
            description: t('pricing.free.description'),
            features: t('pricing.free.features'), // This returns an array from the specific locale
            highlight: false
        },
        {
            name: t('pricing.full.name'),
            price: t('pricing.full.price'),
            description: t('pricing.full.description'),
            features: t('pricing.full.features'),
            highlight: true,
            badge: t('pricing.full.badge')
        }
    ]

    return (
        <Section id="pricing" className="bg-gradient-to-b from-dark-bg to-[#0a0a0a]">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">{t('pricing.title_prefix')} <span className="text-primary">{t('pricing.title_highlight')}</span></h2>
                <p className="text-gray-400">{t('pricing.subtitle')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {tiers.map((tier, index) => (
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
                                {tier.badge}
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-xl font-medium text-gray-300 mb-2">{tier.name}</h3>
                            <div className="text-4xl font-bold mb-4">{tier.price}</div>
                            <p className="text-gray-400 text-sm">{tier.description}</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {Array.isArray(tier.features) && tier.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                    <Check size={16} className={tier.highlight ? "text-primary" : "text-gray-500"} />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {/* Buttons Removed as requested */}
                        {/* <Button variant={tier.highlight ? 'primary' : 'outline'} className="w-full">
                            {tier.cta}
                        </Button> */}
                    </div>
                ))}
            </div>
        </Section>
    )
}
