import { Section } from '../components/ui/Section'
import { motion } from 'framer-motion'

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <Section className="pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-8">Refund Policy</h1>

                    <div className="space-y-6 text-gray-300 leading-relaxed">
                        <p>
                            Thank you for enrolling at <span className="text-primary font-semibold">SkillNexo</span>. We value your satisfaction and strive to provide you with the best learning experience possible. Please review our refund policy carefully before enrolling.
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Refund Eligibility</h2>
                            <p className="mb-4">Our refund policy is structured to ensure fair usage of our services:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>
                                    <span className="font-semibold text-white">No Refund After Class Attendance:</span> Once you have attended one or more classes, you are no longer eligible for a refund
                                </li>
                                <li>
                                    <span className="font-semibold text-white">Pre-attendance Cancellation:</span> Full refund is available only if requested before attending any classes
                                </li>
                                <li>
                                    <span className="font-semibold text-white">Processing Time:</span> Approved refunds will be processed within 5-7 business days
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">How to Request a Refund</h2>
                            <p>
                                To request a refund, please contact our support team at{' '}
                                <a href="mailto:sdarandara123@gmail.com" className="text-primary hover:underline font-semibold">
                                    sdarandara123@gmail.com
                                </a>{' '}
                                with your order details and reason for the refund request.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Course Materials Usage Policy</h2>
                            <p className="mb-4">All course materials are subject to the following restrictions:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>All course materials are for <span className="font-semibold text-white">personal use only</span></li>
                                <li>Downloading of course materials is <span className="font-semibold text-white">strictly prohibited</span></li>
                                <li>Sharing or distributing course content is <span className="font-semibold text-white">not permitted</span></li>
                                <li>Recording of live sessions is <span className="font-semibold text-white">not allowed</span></li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Account Usage Policy</h2>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Each account is for <span className="font-semibold text-white">single user access only</span></li>
                                <li>Sharing of login credentials is <span className="font-semibold text-white">prohibited</span></li>
                                <li>Multiple concurrent logins are <span className="font-semibold text-white">not permitted</span></li>
                            </ul>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-xl p-6 mt-8">
                            <h2 className="text-xl font-bold text-white mb-3">Contact Us</h2>
                            <p>
                                If you have any questions or concerns regarding our refund policy, please contact our support team:
                            </p>
                            <ul className="mt-3 space-y-2">
                                <li>
                                    <span className="text-gray-400">Email:</span>{' '}
                                    <a href="mailto:sdarandara123@gmail.com" className="text-primary hover:underline">
                                        sdarandara123@gmail.com
                                    </a>
                                </li>
                                <li>
                                    <span className="text-gray-400">WhatsApp:</span>{' '}
                                    <a href="https://wa.me/94779920805" className="text-primary hover:underline">
                                        +94 77 992 0805
                                    </a>
                                </li>
                            </ul>
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
