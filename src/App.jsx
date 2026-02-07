import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import StudentsList from './pages/admin/StudentsList';
import StudentView from './pages/admin/StudentView';
import StudentEdit from './pages/admin/StudentEdit';
import CoursesList from './pages/admin/CoursesList';
import Settings from './pages/admin/Settings';
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
          <Route path="/AdminPanel/login" element={<AdminLogin />} />
          <Route path="/AdminPanel" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<StudentsList />} />
            <Route path="students/:id" element={<StudentView />} />
            <Route path="students/:id/edit" element={<StudentEdit />} />
            <Route path="courses" element={<CoursesList />} />
            <Route path="settings" element={<Settings />} />
            <Route index element={<Navigate to="/AdminPanel/dashboard" replace />} />
          </Route>

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
