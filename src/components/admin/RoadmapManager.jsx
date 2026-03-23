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
    AlertCircle,
    GraduationCap,
    ListVideo,
    FolderOpen,
    Layers
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

    // ── Add a new ORIENTATION step (appends to end of orientations)
    const handleAddOrientation = () => {
        // Shift all existing orientations backwards by 1 to make room at 0
        const newRoadmap = roadmap.map(step => {
            if (step.day_number <= 0) {
                return { ...step, day_number: step.day_number - 1 };
            }
            return step;
        });

        const uniqueOrientations = new Set(newRoadmap.filter(r => r.day_number <= 0).map(r => r.day_number));
        const orientationCount = uniqueOrientations.size + 1;

        const newStep = {
            course_id: course.id,
            day_number: 0,
            step_type: 'orientation',
            title: `Orientation ${orientationCount < 10 ? `0${orientationCount}` : orientationCount} - Introduction`,
            description: '',
            recording_url: '',
            content: {},
            is_new: true
        };
        
        setRoadmap([...newRoadmap, newStep].sort((a, b) => a.day_number - b.day_number));
    };

    // ── Add a full new Day (Day 01, Day 02 ...)
    const handleAddDay = () => {
        const existingDays = roadmap.filter(r => r.day_number > 0);
        const nextDay = existingDays.length > 0 ? Math.max(...existingDays.map(r => r.day_number)) + 1 : 1;
        const newStep = {
            course_id: course.id,
            day_number: nextDay,
            step_type: 'class',
            title: `Day ${nextDay} - New Lesson`,
            description: '',
            recording_url: '',
            content: {},
            is_new: true
        };
        setRoadmap([...roadmap, newStep]);
    };

    // ── Add a secondary activity to an existing day (same day_number)
    const handleAddActivityToDay = (dayNumber) => {
        let orientationTitle = 'Orientation - Quiz';
        if (dayNumber <= 0) {
            const uniqueOr = Array.from(new Set(roadmap.filter(r => r.day_number <= 0).map(r => r.day_number))).sort((a, b) => a - b);
            const num = uniqueOr.indexOf(dayNumber) + 1;
            orientationTitle = `Orientation ${num < 10 ? `0${num}` : num} - Quiz`;
        }

        const newStep = {
            course_id: course.id,
            day_number: dayNumber,
            step_type: 'quiz',
            title: dayNumber <= 0 ? orientationTitle : `Day ${dayNumber} - Quiz`,
            description: '',
            recording_url: '',
            content: { questions: [] },
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

    const handleUpdateStepContent = (index, contentField, value) => {
        const newRoadmap = [...roadmap];
        newRoadmap[index] = {
            ...newRoadmap[index],
            content: {
                ...(newRoadmap[index].content || {}),
                [contentField]: value
            }
        };
        setRoadmap(newRoadmap);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const newSteps = roadmap.filter(s => s.is_new).map(s => {
                const { is_new, ...rest } = s;
                return rest;
            });
            const existingSteps = roadmap.filter(s => !s.is_new);

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
            fetchRoadmap();
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

        const tempDay = newRoadmap[index].day_number;
        newRoadmap[index].day_number = newRoadmap[targetIndex].day_number;
        newRoadmap[targetIndex].day_number = tempDay;

        [newRoadmap[index], newRoadmap[targetIndex]] = [newRoadmap[targetIndex], newRoadmap[index]];
        setRoadmap(newRoadmap);
    };

    const getStepTypeIcon = (type) => {
        switch (type) {
            case 'class': return <Video className="w-4 h-4" />;
            case 'orientation': return <GraduationCap className="w-4 h-4" />;
            case 'quiz': return <HelpCircle className="w-4 h-4" />;
            case 'reading': return <Book className="w-4 h-4" />;
            case 'assignment': return <FileText className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const getStepTypeColor = (type) => {
        switch (type) {
            case 'class': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'orientation': return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
            case 'quiz': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            case 'reading': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'assignment': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            default: return 'text-slate-400 bg-slate-500/10';
        }
    };

    // ── Group steps by day_number for UI display
    const groupedByDay = roadmap.reduce((acc, step, index) => {
        const key = step.day_number;
        if (!acc[key]) acc[key] = [];
        acc[key].push({ ...step, _index: index });
        return acc;
    }, {});

    const sortedDayKeys = Object.keys(groupedByDay).map(Number).sort((a, b) => a - b);
    const orientationKeys = sortedDayKeys.filter(k => k <= 0);

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
                        <p className="text-slate-400 text-sm mt-1">Add orientations, class days, quizzes and activities. Multiple activities per day are supported.</p>
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
                                    <p className="text-slate-500 max-w-sm mx-auto mb-6">Start by adding orientation sessions or the first class day.</p>
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={handleAddOrientation}
                                            className="inline-flex items-center gap-2 bg-violet-600/10 text-violet-400 border border-violet-500/20 px-6 py-2 rounded-xl hover:bg-violet-600/20 transition-all"
                                        >
                                            <GraduationCap className="w-4 h-4" /> Add Orientation 01
                                        </button>
                                        <button
                                            onClick={handleAddDay}
                                            className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 px-6 py-2 rounded-xl hover:bg-blue-600/20 transition-all"
                                        >
                                            <Plus className="w-4 h-4" /> Add Day 01
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-6">
                                {sortedDayKeys.map((dayNumber) => {
                                    const stepsInDay = groupedByDay[dayNumber];
                                    const isOrientation = dayNumber <= 0;
                                    const orientationNum = isOrientation ? orientationKeys.indexOf(dayNumber) + 1 : 0;
                                    const dayLabel = isOrientation
                                        ? `Orientation ${orientationNum < 10 ? `0${orientationNum}` : orientationNum}`
                                        : `Day ${dayNumber < 10 ? `0${dayNumber}` : dayNumber}`;

                                    return (
                                        <div key={dayNumber} className={`rounded-2xl border overflow-hidden ${isOrientation ? 'border-violet-500/20 bg-violet-500/3' : 'border-slate-700/50 bg-slate-950/20'}`}>
                                            {/* Day Group Header */}
                                            <div className={`px-5 py-3 flex items-center justify-between ${isOrientation ? 'bg-violet-500/10 border-b border-violet-500/20' : 'bg-blue-500/5 border-b border-slate-800'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${isOrientation ? 'bg-violet-500/20 text-violet-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                                        {isOrientation ? orientationNum : dayNumber}
                                                    </div>
                                                    <div>
                                                        <span className={`text-sm font-bold ${isOrientation ? 'text-violet-300' : 'text-blue-300'}`}>{dayLabel}</span>
                                                        <span className="text-slate-500 text-xs ml-2">· {stepsInDay.length} {stepsInDay.length === 1 ? 'activity' : 'activities'}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleAddActivityToDay(dayNumber)}
                                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                                                >
                                                    <Plus className="w-3 h-3" /> Add Activity
                                                </button>
                                            </div>

                                            {/* Activities within this day */}
                                            <div className="divide-y divide-slate-800/50">
                                                {stepsInDay.map((step) => {
                                                    const index = step._index;
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="group p-4 hover:bg-slate-900/40 transition-all"
                                                        >
                                                            <div className="flex flex-col md:flex-row gap-4">
                                                                {/* Left: Move Controls */}
                                                                <div className="flex md:flex-col items-center gap-1 shrink-0">
                                                                    <button
                                                                        onClick={() => moveStep(index, 'up')}
                                                                        className="p-1 hover:bg-slate-800 rounded text-slate-600 hover:text-white transition-colors"
                                                                    >
                                                                        <ArrowUp className="w-3 h-3" />
                                                                    </button>
                                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getStepTypeColor(step.step_type)}`}>
                                                                        {getStepTypeIcon(step.step_type)}
                                                                    </div>
                                                                    <button
                                                                        onClick={() => moveStep(index, 'down')}
                                                                        className="p-1 hover:bg-slate-800 rounded text-slate-600 hover:text-white transition-colors"
                                                                    >
                                                                        <ArrowDown className="w-3 h-3" />
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
                                                                            <option value="orientation">🎓 Orientation</option>
                                                                            <option value="class">📹 Class</option>
                                                                            <option value="quiz">📝 Quiz</option>
                                                                            <option value="reading">📖 Reading</option>
                                                                            <option value="assignment">📂 Assignment</option>
                                                                        </select>
                                                                        <input
                                                                            type="text"
                                                                            value={step.title}
                                                                            onChange={(e) => handleUpdateStep(index, 'title', e.target.value)}
                                                                            placeholder="Activity Title"
                                                                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-1.5 text-sm text-white outline-none focus:border-blue-500 font-medium"
                                                                        />
                                                                    </div>

                                                                    <textarea
                                                                        value={step.description || ''}
                                                                        onChange={(e) => handleUpdateStep(index, 'description', e.target.value)}
                                                                        placeholder="Short description or instructions..."
                                                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-400 outline-none focus:border-blue-500 resize-none h-16"
                                                                    />

                                                                    {/* Class / Orientation fields */}
                                                                    {(step.step_type === 'class' || step.step_type === 'orientation') && (
                                                                        <div className="space-y-2">
                                                                            <div className="relative">
                                                                                <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50" />
                                                                                <input
                                                                                    type="text"
                                                                                    value={step.recording_url || ''}
                                                                                    onChange={(e) => handleUpdateStep(index, 'recording_url', e.target.value)}
                                                                                    placeholder="Recording URL (YouTube embed)"
                                                                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-400 outline-none focus:border-emerald-500"
                                                                                />
                                                                            </div>
                                                                            <div className="text-[10px] text-slate-600 px-1">
                                                                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500/40 inline-block"></span>Recording embed URL</span>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {(step.step_type === 'reading' || step.step_type === 'assignment') && (
                                                                        <div className="space-y-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                                                                            <div className="flex justify-between items-center mb-1">
                                                                                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                                                    <LinkIcon className="w-3 h-3" /> Reading/Task Materials (Optional)
                                                                                </p>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        const curr = step.content?.resources || [];
                                                                                        handleUpdateStepContent(index, 'resources', [...curr, { title: '', url: '' }]);
                                                                                    }}
                                                                                    className="text-[10px] flex items-center gap-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 px-2 py-1 rounded transition-colors"
                                                                                >
                                                                                    <Plus className="w-3 h-3" /> Add Link
                                                                                </button>
                                                                            </div>
                                                                            {(step.content?.resources || []).map((res, rIdx) => (
                                                                                <div key={rIdx} className="flex flex-col sm:flex-row gap-2 relative group">
                                                                                    <input
                                                                                        type="text"
                                                                                        value={res.title}
                                                                                        onChange={(e) => {
                                                                                            const newRes = [...(step.content?.resources || [])];
                                                                                            newRes[rIdx].title = e.target.value;
                                                                                            handleUpdateStepContent(index, 'resources', newRes);
                                                                                        }}
                                                                                        placeholder="Title (e.g. Chapter 1 PDF)"
                                                                                        className="w-full sm:w-1/3 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-amber-500"
                                                                                    />
                                                                                    <div className="flex-1 flex gap-2">
                                                                                        <input
                                                                                            type="url"
                                                                                            value={res.url}
                                                                                            onChange={(e) => {
                                                                                                const newRes = [...(step.content?.resources || [])];
                                                                                                newRes[rIdx].url = e.target.value;
                                                                                                handleUpdateStepContent(index, 'resources', newRes);
                                                                                            }}
                                                                                            placeholder="https://"
                                                                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-amber-500"
                                                                                        />
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                const newRes = [...(step.content?.resources || [])];
                                                                                                newRes.splice(rIdx, 1);
                                                                                                handleUpdateStepContent(index, 'resources', newRes);
                                                                                            }}
                                                                                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors shrink-0"
                                                                                        >
                                                                                            <Trash2 className="w-3 h-3" />
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                            {(!step.content?.resources || step.content?.resources.length === 0) && (
                                                                                <p className="text-[10px] text-amber-500/50 italic">No specific attachments added. Students will just read the description above.</p>
                                                                            )}
                                                                        </div>
                                                                    )}

                                                                    {step.step_type === 'quiz' && (
                                                                        <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                                                                            <div className="flex justify-between items-center mb-2">
                                                                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Quiz Questions</p>
                                                                                {step.content?.questions?.length > 0 && (
                                                                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                                                                        {step.content.questions.length} Questions
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

                                                                {/* Right: Delete */}
                                                                <div className="flex md:flex-col justify-end gap-2 shrink-0">
                                                                    <button
                                                                        onClick={() => handleRemoveStep(index)}
                                                                        className="p-2 hover:bg-red-500/10 rounded-lg text-slate-600 hover:text-red-500 transition-colors"
                                                                        title="Remove Activity"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Bottom action buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <button
                                    onClick={handleAddOrientation}
                                    className="py-4 border-2 border-dashed border-violet-800/40 rounded-2xl text-slate-500 hover:text-violet-400 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all flex items-center justify-center gap-2 font-medium"
                                >
                                    <GraduationCap className="w-5 h-5" />
                                    Add New Orientation
                                </button>
                                <button
                                    onClick={handleAddDay}
                                    className="py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2 font-medium"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Next Day
                                </button>
                            </div>
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
                        handleUpdateStep(activeQuizIndex, 'content', {
                            ...(roadmap[activeQuizIndex].content || {}),
                            ...data
                        });
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
