import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import en from '../locales/en.json';
import si from '../locales/si.json';

const LanguageContext = createContext();

const translations = { en, si };

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if path starts with /si
        if (location.pathname.startsWith('/si')) {
            setLanguage('si');
            document.body.classList.add('font-sinhala');
        } else {
            setLanguage('en');
            document.body.classList.remove('font-sinhala');
        }
    }, [location]);

    // Nested object lookup for translations
    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];
        for (const k of keys) {
            if (value === undefined) return key;
            value = value[k];
        }
        return value || key;
    };

    const toggleLanguage = () => {
        const isSinhala = language === 'si';
        const currentPath = location.pathname;

        let newPath;
        if (isSinhala) {
            // Switch to English: remove /si prefix
            // If path is exactly /si, it becomes /
            // If path is /si/something, it becomes /something
            newPath = currentPath.replace(/^\/si/, '');
            if (newPath === '') newPath = '/';
        } else {
            // Switch to Sinhala: add /si prefix
            if (currentPath === '/') {
                newPath = '/si';
            } else {
                newPath = `/si${currentPath}`;
            }
        }
        navigate(newPath);
    };

    return (
        <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
