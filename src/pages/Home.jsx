import { Navbar } from '../components/ui/Navbar'
import { Hero } from '../components/sections/Hero'
import { WhyUs } from '../components/sections/WhyUs'
import { Syllabus } from '../components/sections/Syllabus'
import { Instructor } from '../components/sections/Instructor'
import { LMSSneakPeek } from '../components/sections/LMSPreview'
import { Pricing } from '../components/sections/Pricing'
import { Registration } from '../components/sections/Registration'
import { Contact } from '../components/sections/Contact'
import { Footer } from '../components/ui/Footer'

export default function Home() {
    return (
        <div className="min-h-screen bg-dark-bg text-white font-sans antialiased selection:bg-primary selection:text-white overflow-x-hidden">
            <Navbar />
            <main className="relative z-10 w-full">
                <Hero />
                <WhyUs />
                <Syllabus />
                <Instructor />
                <LMSSneakPeek />
                <Pricing />
                <Contact />
                <Registration />
            </main>

            <Footer />
        </div>
    )
}
