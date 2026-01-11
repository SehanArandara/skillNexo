import { Section } from '../components/ui/Section'
import { motion } from 'framer-motion'

export default function TermsConditions() {
    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <Section className="pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms and Conditions</h1>

                    <div className="space-y-6 text-gray-300 leading-relaxed">
                        <p>
                            Welcome to <span className="text-primary font-semibold">SkillNexo</span>. These Terms and Conditions govern your use of our website and enrollment in our courses. By accessing and using our platform, you agree to comply with these terms. Please read them carefully.
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Use of the Platform</h2>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>You must be at least 16 years old to enroll in our courses</li>
                                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                                <li>You agree to provide accurate information during registration</li>
                                <li>You may not use our platform for any unlawful purposes</li>
                                <li>Account sharing is strictly prohibited</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Course Information and Pricing</h2>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>We strive to provide accurate course descriptions and pricing</li>
                                <li>Prices are subject to change without notice</li>
                                <li>Promotional discounts are valid for a limited time and may have additional conditions</li>
                                <li>Course content and schedules may be updated to reflect current industry standards</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Enrollment and Payments</h2>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>By enrolling, you agree to pay the full course fee</li>
                                <li>We reserve the right to cancel enrollments for suspected fraudulent activity</li>
                                <li>Payment information is processed securely through trusted third-party providers</li>
                                <li>We do not store your complete payment details</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Course Access and Delivery</h2>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Course access is granted upon successful payment confirmation</li>
                                <li>Live classes are conducted via Zoom at scheduled times</li>
                                <li>Recorded sessions are available for lifetime access</li>
                                <li>You are responsible for having a stable internet connection</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
                            <p>
                                All course materials, including videos, presentations, code samples, and documentation, are protected by intellectual property rights and are the property of SkillNexo. You may not:
                            </p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                                <li>Share, distribute, or sell course materials</li>
                                <li>Record or screenshot live sessions without permission</li>
                                <li>Use course content for commercial purposes</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Student Conduct</h2>
                            <p>Students are expected to:</p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                                <li>Maintain respectful communication with instructors and peers</li>
                                <li>Complete assignments and projects honestly</li>
                                <li>Attend live sessions punctually</li>
                                <li>Not engage in any form of harassment or discrimination</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
                            <p>
                                SkillNexo, its instructors, and affiliates shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of our platform or courses. We make no guarantees regarding employment outcomes or skill proficiency levels.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Amendments</h2>
                            <p>
                                We reserve the right to modify these Terms and Conditions at any time. Changes will be posted on this page. Continued use of our platform after changes constitutes acceptance of the new terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                            <p>
                                For questions about these Terms and Conditions, contact us at{' '}
                                <a href="mailto:sdarandara123@gmail.com" className="text-primary hover:underline">
                                    sdarandara123@gmail.com
                                </a>
                                .
                            </p>
                        </section>

                        <p className="text-sm text-gray-500 italic mt-8">
                            Last updated: January 2026
                        </p>
                    </div>
                </motion.div>
            </Section>
        </div>
    )
}
