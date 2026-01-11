import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

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
          {/* Catch all redirect to English Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App
