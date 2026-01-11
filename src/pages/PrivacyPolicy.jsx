import { Section } from '../components/ui/Section'
import { motion } from 'framer-motion'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <Section className="pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>

                    <div className="space-y-6 text-gray-300 leading-relaxed">
                        <p>
                            At <span className="text-primary font-semibold">SkillNexo</span>, we are committed to protecting the privacy and security of our students' personal information. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit or enroll in our courses. By using our website, you consent to the practices described in this policy.
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                            <p>When you visit our website or register for a course, we may collect:</p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                                <li>Personal identification information (name, email address, phone number) provided during registration</li>
                                <li>Payment and billing information necessary to process your enrollment</li>
                                <li>Learning progress and course completion data</li>
                                <li>Browsing information (IP address, browser type, device information) collected automatically using cookies</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Use of Information</h2>
                            <p>We use the collected information for:</p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                                <li>Processing and managing your course enrollment</li>
                                <li>Providing customer support and responding to inquiries</li>
                                <li>Sending course updates, educational content, and promotional materials</li>
                                <li>Improving our courses and services based on your feedback</li>
                                <li>Detecting and preventing fraud and unauthorized activities</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Information Sharing</h2>
                            <p>
                                We respect your privacy and do not sell, trade, or transfer your personal information to third parties without your consent, except:
                            </p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                                <li><span className="font-semibold">Trusted service providers:</span> Payment processors and course delivery platforms</li>
                                <li><span className="font-semibold">Legal requirements:</span> When required by law or valid legal requests</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                            <p>
                                We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
                            <p>
                                We use cookies to enhance your browsing experience and analyze website traffic. You can disable cookies through your browser settings, but this may limit certain features of our website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Changes to Privacy Policy</h2>
                            <p>
                                We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with a revised date. We encourage you to review this policy periodically.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                            <p>
                                If you have questions about our Privacy Policy, please contact us at{' '}
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
