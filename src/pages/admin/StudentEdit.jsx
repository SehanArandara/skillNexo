import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Save,
    X,
    ArrowLeft,
    Loader2,
    CheckCircle,
    User,
    Mail,
    Phone,
    Shield
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const StudentEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        payment_status: 'Pending',
        account_status: 'Inactive'
    });

    useEffect(() => {
        fetchStudentDetails();
    }, [id]);

    const fetchStudentDetails = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('registered_student')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setFormData({
                name: data.name || '',
                email: data.email || '',
                whatsapp: data.whatsapp || '',
                payment_status: data.payment_status || 'Pending',
                account_status: data.account_status || 'Inactive'
            });
        } catch (error) {
            console.error('Error fetching student:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error } = await supabase
                .from('registered_student')
                .update({
                    name: formData.name,
                    email: formData.email,
                    whatsapp: formData.whatsapp,
                    payment_status: formData.payment_status,
                    account_status: formData.account_status
                })
                .eq('id', id);

            if (error) throw error;

            // If account status changed, update lms_users too
            await supabase
                .from('lms_users')
                .update({ is_active: formData.account_status === 'Active' })
                .eq('student_id', id);

            navigate(`/AdminPanel/students/${id}`);
        } catch (error) {
            console.error('Error updating student:', error);
            alert('Failed to update student details');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-left">
            <button
                onClick={() => navigate(`/AdminPanel/students/${id}`)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Cancel and Go Back
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Edit Student Profile</h1>
                    <p className="text-slate-400">Update information for ID: {id}</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-3.5 h-3.5" /> Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-3.5 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                placeholder="Enter student name"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" /> Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-3.5 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                placeholder="student@example.com"
                            />
                        </div>

                        {/* WhatsApp */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5" /> WhatsApp Number
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-3.5 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                placeholder="+94 7X XXX XXXX"
                            />
                        </div>

                        {/* Spacing or filler */}
                        <div className="hidden md:block" />

                        {/* Payment Status */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Payment Status
                            </label>
                            <select
                                value={formData.payment_status}
                                onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-3.5 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>

                        {/* Account Status */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Shield className="w-3.5 h-3.5 text-blue-500" /> Account Access
                            </label>
                            <select
                                value={formData.account_status}
                                onChange={(e) => setFormData({ ...formData, account_status: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-3.5 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                            >
                                <option value="Active">Active / Enabled</option>
                                <option value="Inactive">Inactive / Disabled</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(`/AdminPanel/students/${id}`)}
                        className="px-8 py-3.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        Discard Changes
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-10 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentEdit;
