import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';

const Sidebar = ({ adminUser, handleLogout }) => {
    const [isHovered, setIsHovered] = useState(false);

    const navItems = [
        { id: 'Dashboard', label: 'Dashboard', path: '/AdminPanel/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: 'Students', label: 'Students', path: '/AdminPanel/students', icon: <Users className="w-5 h-5" /> },
        { id: 'Courses', label: 'Courses', path: '/AdminPanel/courses', icon: <BookOpen className="w-5 h-5" /> },
        { id: 'Settings', label: 'Settings', path: '/AdminPanel/settings', icon: <Settings className="w-5 h-5" /> },
    ];

    return (
        <aside
            className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out z-50 flex flex-col shadow-2xl ${isHovered ? 'w-64' : 'w-20'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0 overflow-hidden">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <span className={`text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                        }`}>
                        SkillNexo
                    </span>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) => `w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all relative group ${isActive
                            ? 'bg-blue-600/10 text-blue-400'
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'
                                    }`}>
                                    {item.icon}
                                </div>

                                <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'
                                    }`}>
                                    {item.label}
                                </span>

                                {/* Active Indicator Pin */}
                                {isActive && (
                                    <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
                                )}

                                {/* Tooltip for collapsed state */}
                                {!isHovered && (
                                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
                                        {item.label}
                                    </div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Profile & Logout Section */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <div className={`flex items-center gap-3 mb-4 transition-all duration-300 ${isHovered ? 'px-2' : 'justify-center'}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white shrink-0 shadow-lg">
                        {adminUser.username[0].toUpperCase()}
                    </div>
                    {isHovered && (
                        <div className="flex-1 min-w-0 transition-all duration-300">
                            <p className="text-sm font-semibold text-white truncate">{adminUser.username}</p>
                            <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider">{adminUser.role}</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 rounded-xl transition-all group ${isHovered
                        ? 'px-4 py-3 bg-red-500/5 text-red-400 hover:bg-red-500/10'
                        : 'h-12 justify-center text-slate-500 hover:text-red-400'
                        }`}
                >
                    <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    {isHovered && <span className="text-sm font-medium">Sign Out</span>}

                    {!isHovered && (
                        <div className="absolute left-full ml-4 px-2 py-1 bg-red-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
                            Sign Out
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
