import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [adminUser, setAdminUser] = useState(null);

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
        const userStr = localStorage.getItem('adminUser');

        if (!isAuthenticated || !userStr) {
            navigate('/AdminPanel/login');
            return;
        }

        setAdminUser(JSON.parse(userStr));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        localStorage.removeItem('adminUser');
        navigate('/AdminPanel/login');
    };

    if (!adminUser) return null;

    // Map pathnames to names for the header title if needed, 
    // but usually handled per page.

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
            <Sidebar
                adminUser={adminUser}
                handleLogout={handleLogout}
            />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden ml-20 transition-all duration-300">
                <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 z-40">
                    <div className="flex-1">
                        <div className="max-w-md w-full relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="w-full bg-slate-800/50 border-none rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 rounded-lg">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-900"></span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 lg:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
