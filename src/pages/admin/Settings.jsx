import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-slate-500 bg-slate-900/20 rounded-3xl border border-slate-800 border-dashed animate-fade-in">
            <SettingsIcon className="w-16 h-16 mb-6 opacity-10 animate-pulse" />
            <h3 className="text-xl font-medium text-slate-300 mb-2">Module Under Development</h3>
            <p className="text-sm text-slate-500 max-w-xs text-center">We're working hard to bring you settings and platform configuration soon.</p>
        </div>
    );
};

export default Settings;
