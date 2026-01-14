import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import CourseRoadmap from './pages/CourseRoadmap';

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/si" element={<Home />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />

          {/* Admin Routes */}
          <Route path="/AdminPanel" element={<AdminLogin />} />
          <Route path="/AdminPanel/dashboard" element={<AdminDashboard />} />

          {/* Student Routes */}
          <Route path="/lms" element={<StudentLogin />} />
          <Route path="/lms/dashboard" element={<StudentDashboard />} />
          <Route path="/lms/course/:courseId" element={<CourseRoadmap />} />

          {/* Catch all redirect to English Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App
