import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    LogOut,
    Bell,
    Search,
    Menu,
    X
} from 'lucide-react';
import CoursesManager from '../components/admin/CoursesManager';
import StudentsManager from '../components/admin/StudentsManager';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [adminUser, setAdminUser] = useState(null);
    const [activeTab, setActiveTab] = useState('Dashboard');

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
        const userStr = localStorage.getItem('adminUser');

        if (!isAuthenticated || !userStr) {
            navigate('/AdminPanel');
            return;
        }

        setAdminUser(JSON.parse(userStr));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        localStorage.removeItem('adminUser');
        navigate('/AdminPanel');
    };

    if (!adminUser) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-800">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            LMS Admin
                        </span>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-slate-400">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <NavLink icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
                        <NavLink icon={<Users />} label="Students" active={activeTab === 'Students'} onClick={() => setActiveTab('Students')} />
                        <NavLink icon={<BookOpen />} label="Courses" active={activeTab === 'Courses'} onClick={() => setActiveTab('Courses')} />
                        <NavLink icon={<Settings />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white">
                                {adminUser.username[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{adminUser.username}</p>
                                <p className="text-xs text-slate-400 truncate capitalize">{adminUser.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-4 lg:px-8">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400">
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex-1 px-4 lg:px-8">
                        <div className="max-w-md w-full relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                {/* Dashboard Viewer */}
                <div className="flex-1 overflow-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-2xl font-bold text-white mb-6 animate-fade-in">{activeTab}</h1>

                        {activeTab === 'Courses' ? (
                            <CoursesManager />
                        ) : activeTab === 'Students' ? (
                            <StudentsManager />
                        ) : activeTab === 'Dashboard' ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <StatCard title="Total Students" value="1,234" change="+12.5%" icon={<Users className="w-6 h-6 text-blue-400" />} />
                                    <StatCard title="Active Courses" value="12" change="+2" icon={<BookOpen className="w-6 h-6 text-purple-400" />} />
                                    <StatCard title="Revenue" value="$45,678" change="+8.2%" icon={<LayoutDashboard className="w-6 h-6 text-emerald-400" />} />
                                </div>

                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                    <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                                                    <Users className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-slate-200">New student registered</p>
                                                    <p className="text-xs text-slate-500">2 minutes ago</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                <Settings className="w-16 h-16 mb-4 opacity-20" />
                                <p>This module is under development.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

const NavLink = ({ icon, label, active = false, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${active
        ? 'bg-blue-600/10 text-blue-400'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        }`}>
        {icon}
        {label}
    </button>
);

const StatCard = ({ title, value, change, icon }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
        <div className="flex items-start justify-between mb-4">
            <div>
                <p className="text-sm font-medium text-slate-400">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                {icon}
            </div>
        </div>
        <div className="flex items-center text-sm">
            <span className="text-emerald-400 font-medium">{change}</span>
            <span className="text-slate-500 ml-2">from last month</span>
        </div>
    </div>
);

export default AdminDashboard;
