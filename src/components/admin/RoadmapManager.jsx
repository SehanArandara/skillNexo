import React, { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    Video,
    FileText,
    HelpCircle,
    Book,
    ArrowUp,
    ArrowDown,
    Loader2,
    Calendar,
    Link as LinkIcon,
    AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import QuizEditor from './QuizEditor';

const RoadmapManager = ({ course, onClose }) => {
    const [roadmap, setRoadmap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeQuizIndex, setActiveQuizIndex] = useState(null);

    useEffect(() => {
        fetchRoadmap();
    }, [course.id]);

    const fetchRoadmap = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('course_roadmap')
                .select('*')
                .eq('course_id', course.id)
                .order('day_number', { ascending: true });

            if (error) throw error;
            setRoadmap(data || []);
        } catch (error) {
            console.error('Error fetching roadmap:', error);
            showNotification('Failed to load roadmap', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAddStep = () => {
        const nextDay = roadmap.length > 0 ? Math.max(...roadmap.map(r => r.day_number)) + 1 : 1;
        const newStep = {
            course_id: course.id,
            day_number: nextDay,
            step_type: 'class',
            title: `Day ${nextDay} - New Lesson`,
            description: '',
            recording_url: '',
            resource_url: '',
            content: {},
            is_new: true
        };
        setRoadmap([...roadmap, newStep]);
    };

    const handleRemoveStep = async (index) => {
        const step = roadmap[index];
        if (!step.id) {
            setRoadmap(roadmap.filter((_, i) => i !== index));
            return;
        }

        if (!window.confirm('Are you sure you want to delete this step?')) return;

        try {
            const { error } = await supabase
                .from('course_roadmap')
                .delete()
                .eq('id', step.id);

            if (error) throw error;
            setRoadmap(roadmap.filter((_, i) => i !== index));
            showNotification('Step deleted');
        } catch (error) {
            console.error('Error deleting step:', error);
            showNotification('Failed to delete step', 'error');
        }
    };

    const handleUpdateStep = (index, field, value) => {
        const newRoadmap = [...roadmap];
        newRoadmap[index] = { ...newRoadmap[index], [field]: value };
        setRoadmap(newRoadmap);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Split into new and existing steps
            const newSteps = roadmap.filter(s => s.is_new).map(s => {
                const { is_new, ...rest } = s;
                return rest;
            });
            const existingSteps = roadmap.filter(s => !s.is_new);

            // Upsert all steps
            if (newSteps.length > 0) {
                const { error: insertError } = await supabase
                    .from('course_roadmap')
                    .insert(newSteps);
                if (insertError) throw insertError;
            }

            for (const step of existingSteps) {
                const { error: updateError } = await supabase
                    .from('course_roadmap')
                    .update(step)
                    .eq('id', step.id);
                if (updateError) throw updateError;
            }

            showNotification('Roadmap saved successfully!');
            fetchRoadmap(); // Refresh to get IDs for new steps
        } catch (error) {
            console.error('Error saving roadmap:', error);
            showNotification('Failed to save roadmap', 'error');
        } finally {
            setSaving(false);
        }
    };

    const moveStep = (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === roadmap.length - 1) return;

        const newRoadmap = [...roadmap];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap days too? Or just order? User said "Day 01, Day 02..." 
        // Let's swap the day numbers if they were sequential
        const tempDay = newRoadmap[index].day_number;
        newRoadmap[index].day_number = newRoadmap[targetIndex].day_number;
        newRoadmap[targetIndex].day_number = tempDay;

        [newRoadmap[index], newRoadmap[targetIndex]] = [newRoadmap[targetIndex], newRoadmap[index]];
        setRoadmap(newRoadmap);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'class': return <Video className="w-4 h-4" />;
            case 'quiz': return <HelpCircle className="w-4 h-4" />;
            case 'reading': return <Book className="w-4 h-4" />;
            case 'assignment': return <FileText className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Calendar className="text-emerald-500" />
                            Course Roadmap: <span className="text-blue-400">{course.course_name}</span>
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Manage steps, classes, and quizzes for this course.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Roadmap
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-500">
                            <Loader2 className="w-10 h-10 animate-spin mb-4" />
                            <p>Fetching roadmap details...</p>
                        </div>
                    ) : (
                        <>
                            {roadmap.length === 0 && (
                                <div className="text-center py-20 bg-slate-950/30 border border-slate-800 border-dashed rounded-3xl">
                                    <AlertCircle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-slate-300">No roadmap steps yet</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto mb-6">Start by adding the first day to your course curriculum.</p>
                                    <button
                                        onClick={handleAddStep}
                                        className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 px-6 py-2 rounded-xl hover:bg-blue-600/20 transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> Add Day 01
                                    </button>
                                </div>
                            )}

                            <div className="space-y-3">
                                {roadmap.map((step, index) => (
                                    <div
                                        key={index}
                                        className="group bg-slate-950/50 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all"
                                    >
                                        <div className="flex flex-col md:flex-row gap-4">
                                            {/* Left: Move Controls & Day */}
                                            <div className="flex md:flex-col items-center gap-2">
                                                <button
                                                    onClick={() => moveStep(index, 'up')}
                                                    className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-white transition-colors"
                                                >
                                                    <ArrowUp className="w-4 h-4" />
                                                </button>
                                                <div className="bg-slate-800 w-12 h-12 rounded-xl flex flex-col items-center justify-center border border-slate-700">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase">Day</span>
                                                    <span className="text-lg font-black text-white leading-none">
                                                        {step.day_number < 10 ? `0${step.day_number}` : step.day_number}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => moveStep(index, 'down')}
                                                    className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-white transition-colors"
                                                >
                                                    <ArrowDown className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Middle: Content Editing */}
                                            <div className="flex-1 space-y-3">
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <select
                                                        value={step.step_type}
                                                        onChange={(e) => handleUpdateStep(index, 'step_type', e.target.value)}
                                                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300 outline-none focus:border-blue-500 h-fit"
                                                    >
                                                        <option value="class">🎓 Class</option>
                                                        <option value="quiz">📝 Quiz</option>
                                                        <option value="reading">📖 Reading</option>
                                                        <option value="assignment">📂 Assignment</option>
                                                    </select>
                                                    <input
                                                        type="text"
                                                        value={step.title}
                                                        onChange={(e) => handleUpdateStep(index, 'title', e.target.value)}
                                                        placeholder="Step Title"
                                                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-1.5 text-sm text-white outline-none focus:border-blue-500 font-medium"
                                                    />
                                                </div>

                                                <textarea
                                                    value={step.description || ''}
                                                    onChange={(e) => handleUpdateStep(index, 'description', e.target.value)}
                                                    placeholder="Short description or instructions..."
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-400 outline-none focus:border-blue-500 resize-none h-16"
                                                />

                                                {/* Dynamic Fields based on Type */}
                                                {step.step_type === 'class' && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="relative group/field">
                                                            <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50" />
                                                            <input
                                                                type="text"
                                                                value={step.recording_url || ''}
                                                                onChange={(e) => handleUpdateStep(index, 'recording_url', e.target.value)}
                                                                placeholder="Recording URL (YouTube/Vimeo)"
                                                                className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-400 outline-none focus:border-emerald-500"
                                                            />
                                                        </div>
                                                        <div className="relative group/field">
                                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500/50" />
                                                            <input
                                                                type="text"
                                                                value={step.resource_url || ''}
                                                                onChange={(e) => handleUpdateStep(index, 'resource_url', e.target.value)}
                                                                placeholder="Resource Link (Drive/PDF)"
                                                                className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-400 outline-none focus:border-blue-500"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {(step.step_type === 'reading' || step.step_type === 'assignment') && (
                                                    <div className="relative group/field">
                                                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/50" />
                                                        <input
                                                            type="text"
                                                            value={step.resource_url || ''}
                                                            onChange={(e) => handleUpdateStep(index, 'resource_url', e.target.value)}
                                                            placeholder="Material/Template Link"
                                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-400 outline-none focus:border-amber-500"
                                                        />
                                                    </div>
                                                )}

                                                {step.step_type === 'quiz' && (
                                                    <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Quiz Setup</p>
                                                            {step.content?.questions?.length > 0 && (
                                                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                                                    {step.content.questions.length} Questions Configured
                                                                </span>
                                                            )}
                                                        </div>
                                                        <button
                                                            className={`text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${step.content?.questions?.length > 0
                                                                ? 'bg-slate-800 text-slate-300 hover:text-white'
                                                                : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                                                                }`}
                                                            onClick={() => setActiveQuizIndex(index)}
                                                        >
                                                            {step.content?.questions?.length > 0 ? <Edit2 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                                            {step.content?.questions?.length > 0 ? 'Edit Quiz Questions' : 'Setup Quiz Questions'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right: Actions */}
                                            <div className="flex md:flex-col justify-end gap-2">
                                                <button
                                                    onClick={() => handleRemoveStep(index)}
                                                    className="p-2 hover:bg-red-500/10 rounded-lg text-slate-600 hover:text-red-500 transition-colors"
                                                    title="Remove Step"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleAddStep}
                                className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2 font-medium"
                            >
                                <Plus className="w-5 h-5" />
                                Add Next Day Step
                            </button>
                        </>
                    )}
                </div>

                {/* Footer Notifications */}
                {notification && (
                    <div className={`p-4 text-center text-sm font-medium ${notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                        {notification.message}
                    </div>
                )}
            </div>

            {/* Quiz Editor Modal */}
            {activeQuizIndex !== null && (
                <QuizEditor
                    quizData={roadmap[activeQuizIndex].content}
                    onSave={(data) => {
                        handleUpdateStep(activeQuizIndex, 'content', data);
                        setActiveQuizIndex(null);
                        showNotification('Quiz updated locally. Save roadmap to persist changes.');
                    }}
                    onCancel={() => setActiveQuizIndex(null)}
                />
            )}
        </div>
    );
};

export default RoadmapManager;
