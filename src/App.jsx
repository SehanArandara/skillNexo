import { Navbar } from './components/ui/Navbar'
import { Hero } from './components/sections/Hero'
import { WhyUs } from './components/sections/WhyUs'
import { Syllabus } from './components/sections/Syllabus'
import { Instructor } from './components/sections/Instructor'
import { LMSSneakPeek } from './components/sections/LMSPreview'
import { Pricing } from './components/sections/Pricing'
import { Registration } from './components/sections/Registration'

function App() {
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
        <Registration />
      </main>

      {/* Footer */}
      <footer className="py-8 bg-black text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} 1% Engineer. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
