import React from 'react';
import { Users, BookOpen, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
    return (
        <>
            <div className="flex flex-col mb-8 text-left">
                <h1 className="text-3xl font-bold text-white tracking-tight animate-fade-in">Dashboard</h1>
                <p className="text-slate-400 text-sm mt-1">Manage your LMS platform and students from here.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Students" value="1,234" change="+12.5%" icon={<Users className="w-6 h-6 text-blue-400" />} />
                <StatCard title="Active Courses" value="12" change="+2" icon={<BookOpen className="w-6 h-6 text-purple-400" />} />
                <StatCard title="Monthly Revenue" value="$45,678" change="+8.2%" icon={<LayoutDashboard className="w-6 h-6 text-emerald-400" />} />
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                    <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">View All</button>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/30 border border-slate-800/50 hover:border-slate-700/50 transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-all">
                                <Users className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-200 text-left">New student registered</p>
                                <p className="text-xs text-slate-500 text-left">2 minutes ago • ID: STU-2024-{i}</p>
                            </div>
                            <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">PENDING</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

const StatCard = ({ title, value, change, icon }) => (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all hover:translate-y-[-2px] group">
        <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 group-hover:bg-slate-900 transition-colors">
                {icon}
            </div>
            <div className={`px-2 py-1 rounded-lg text-xs font-bold ${change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {change}
            </div>
        </div>
        <div className="text-left">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{value}</h3>
        </div>
        <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">70% Target</span>
        </div>
    </div>
);

export default Dashboard;
