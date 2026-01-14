import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ChevronLeft,
    Flame,
    Lock,
    PlayCircle,
    CheckCircle2,
    Calendar,
    Video,
    FileText,
    HelpCircle,
    BookOpen,
    ArrowRight,
    Loader2,
    Trophy,
    Target,
    Link as LinkIcon,
    X
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const CourseRoadmap = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [roadmap, setRoadmap] = useState([]);
    const [progress, setProgress] = useState([]);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedStep, setSelectedStep] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizResult, setQuizResult] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const studentUser = JSON.parse(localStorage.getItem('studentUser') || '{}');

    useEffect(() => {
        if (!studentUser.id) {
            navigate('/lms');
            return;
        }
        fetchCourseData();
    }, [courseId]);

    const fetchCourseData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Course Info
            const { data: courseData, error: courseError } = await supabase
                .from('courses')
                .select('*')
                .eq('id', courseId)
                .single();
            if (courseError) throw courseError;
            setCourse(courseData);

            // 2. Fetch Roadmap
            const { data: roadmapData, error: roadmapError } = await supabase
                .from('course_roadmap')
                .select('*')
                .eq('course_id', courseId)
                .order('day_number', { ascending: true });
            if (roadmapError) throw roadmapError;
            setRoadmap(roadmapData || []);

            // 3. Fetch Progress
            const { data: progressData, error: progressError } = await supabase
                .from('student_progress')
                .select('*')
                .eq('student_id', studentUser.id)
                .eq('course_id', courseId);
            if (progressError) throw progressError;
            setProgress(progressData || []);

            // 4. Fetch Streak
            const { data: streakData } = await supabase
                .from('student_streaks')
                .select('current_streak')
                .eq('student_id', studentUser.id)
                .eq('course_id', courseId)
                .single();
            setStreak(streakData?.current_streak || 0);

        } catch (error) {
            console.error('Error fetching course data:', error);
        } finally {
            setLoading(false);
        }
    };

    const isStepCompleted = (stepId) => progress.some(p => p.step_id === stepId);

    const isStepLocked = (index) => {
        if (index === 0) return false;
        const previousStep = roadmap[index - 1];
        return !isStepCompleted(previousStep.id);
    };

    const handleMarkAsCompleted = async (step) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            // 1. Mark as completed in progress table
            const { error: progressError } = await supabase
                .from('student_progress')
                .upsert({
                    student_id: studentUser.id,
                    course_id: courseId,
                    step_id: step.id,
                    status: 'completed'
                });
            if (progressError) throw progressError;

            // 2. Update streaks
            await updateStreak();

            // Success!
            setSelectedStep(null);
            fetchCourseData(); // Refresh everything
        } catch (error) {
            console.error('Error completing step:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateStreak = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data: currentStreakData } = await supabase
                .from('student_streaks')
                .select('*')
                .eq('student_id', studentUser.id)
                .eq('course_id', courseId)
                .single();

            if (!currentStreakData) {
                await supabase.from('student_streaks').insert({
                    student_id: studentUser.id,
                    course_id: courseId,
                    current_streak: 1,
                    last_activity_date: today
                });
            } else {
                const lastDate = currentStreakData.last_activity_date;
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (lastDate === today) {
                    // Already counted today
                    return;
                } else if (lastDate === yesterdayStr) {
                    // Consecutive day
                    await supabase.from('student_streaks').update({
                        current_streak: currentStreakData.current_streak + 1,
                        last_activity_date: today
                    }).eq('id', currentStreakData.id);
                } else {
                    // Broke streak
                    await supabase.from('student_streaks').update({
                        current_streak: 1,
                        last_activity_date: today
                    }).eq('id', currentStreakData.id);
                }
            }
        } catch (err) {
            console.error('Streak update failed:', err);
        }
    };

    const handleQuizSubmit = async () => {
        const questions = selectedStep.content?.questions || [];
        let score = 0;

        questions.forEach((q, idx) => {
            const userAns = quizAnswers[q.id] || [];
            const correctAns = q.correctAnswers || [];

            if (JSON.stringify(userAns.sort()) === JSON.stringify(correctAns.sort())) {
                score++;
            }
        });

        const percentage = (score / questions.length) * 100;
        setQuizResult({
            score,
            total: questions.length,
            percentage,
            passed: percentage >= 80
        });

        if (percentage >= 80) {
            await handleMarkAsCompleted(selectedStep);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                    <p className="text-slate-400">Loading curriculum...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/lms/dashboard" className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
                            <ChevronLeft className="w-6 h-6 text-slate-400" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-white leading-tight">{course?.course_name}</h1>
                            <p className="text-xs text-slate-400">Curriculum Roadmap</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl shadow-lg shadow-amber-500/5">
                            <Flame className={`w-6 h-6 ${streak > 0 ? 'text-orange-500 animate-pulse' : 'text-slate-600'}`} />
                            <div className="flex flex-col">
                                <span className={`text-xl font-black leading-none ${streak > 0 ? 'text-white' : 'text-slate-500'}`}>{streak}</span>
                                <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-tighter">Streak</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12">
                <div className="relative">
                    {/* Progress Vertical Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-800 z-0"></div>

                    {/* Step Cards */}
                    <div className="space-y-20 relative z-10">
                        {roadmap.map((step, index) => {
                            const completed = isStepCompleted(step.id);
                            const locked = isStepLocked(index);

                            return (
                                <div key={step.id} className={`flex gap-12 group ${locked ? 'opacity-50' : 'opacity-100'}`}>
                                    {/* Vertical Indicator */}
                                    <div className="flex flex-col items-center">
                                        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center border-4 transform transition-all duration-500 ${completed
                                            ? 'bg-emerald-500 border-emerald-500/20 text-white rotate-[10deg]'
                                            : locked
                                                ? 'bg-slate-900 border-slate-800 text-slate-600'
                                                : 'bg-slate-900 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] text-blue-400 ring-4 ring-blue-500/5 rotate-[-5deg]'
                                            }`}>
                                            {completed ? <CheckCircle2 className="w-10 h-10" /> : locked ? <Lock className="w-8 h-8" /> : <div className="text-2xl font-black">{step.day_number < 10 ? `0${step.day_number}` : step.day_number}</div>}
                                        </div>
                                    </div>

                                    {/* Card */}
                                    <div className="flex-1">
                                        <div
                                            onClick={() => !locked && setSelectedStep(step)}
                                            className={`bg-slate-900 border rounded-[2.5rem] p-8 transition-all duration-500 ${locked
                                                ? 'border-slate-800 cursor-not-allowed opacity-40'
                                                : completed
                                                    ? 'border-slate-800 hover:border-emerald-500/30 cursor-pointer hover:bg-emerald-500/5'
                                                    : 'border-blue-500/30 hover:border-blue-500 hover:-translate-y-2 active:scale-[0.98] cursor-pointer shadow-2xl shadow-blue-500/5'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${step.step_type === 'class' ? 'bg-blue-500/10 text-blue-400' :
                                                        step.step_type === 'quiz' ? 'bg-purple-500/10 text-purple-400' :
                                                            'bg-amber-500/10 text-amber-400'
                                                        }`}>
                                                        {step.step_type}
                                                    </span>
                                                    {completed && <span className="text-[10px] font-bold text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-full bg-emerald-500/5">COMPLETED</span>}
                                                </div>
                                                {!locked && !completed && <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>}
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                            <p className="text-sm text-slate-400 line-clamp-2">{step.description}</p>

                                            <div className="mt-6 flex items-center justify-between">
                                                <div className="flex -space-x-2">
                                                    {step.step_type === 'class' && (
                                                        <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-blue-400">
                                                            <Video className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                    {step.step_type === 'quiz' && (
                                                        <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-purple-400">
                                                            <HelpCircle className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-slate-500 text-[10px] font-bold">
                                                        {step.resource_url ? '+1' : '0'}
                                                    </div>
                                                </div>

                                                <button className={`flex items-center gap-2 text-sm font-bold ${locked ? 'text-slate-700' : completed ? 'text-emerald-400' : 'text-blue-400 hover:gap-3 transition-all'}`}>
                                                    {completed ? 'View Records' : locked ? 'Day Locked' : 'Start Day'}
                                                    {!locked && <ArrowRight className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {roadmap.length === 0 && (
                    <div className="text-center py-20 bg-slate-900/30 border border-slate-800 border-dashed rounded-[40px] mt-10">
                        <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-400">Roadmap is coming soon...</h3>
                        <p className="text-sm text-slate-600">The administrator is preparing your curriculum.</p>
                    </div>
                )}
            </div>

            {/* Step Interaction Modal */}
            {selectedStep && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-slate-800 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">Day {selectedStep.day_number}</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{selectedStep.step_type}</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white leading-tight">{selectedStep.title}</h2>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedStep(null);
                                    setQuizResult(null);
                                    setQuizAnswers({});
                                }}
                                className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="max-w-2xl mx-auto space-y-8">
                                {selectedStep.step_type === 'class' && (
                                    <>
                                        {selectedStep.recording_url ? (
                                            <div className="aspect-video bg-slate-950 rounded-[32px] overflow-hidden border border-slate-800 shadow-2xl relative group">
                                                <iframe
                                                    className="w-full h-full"
                                                    src={selectedStep.recording_url.replace('watch?v=', 'embed/')}
                                                    title="Video Lesson"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-slate-800/50 rounded-[32px] flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700">
                                                <Video className="w-16 h-16 mb-4 opacity-20" />
                                                <p className="font-medium">Live Class Only</p>
                                                <p className="text-sm opacity-60">Join the live session to participate.</p>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <h4 className="font-bold text-white text-xl">Description</h4>
                                            <p className="text-slate-400 leading-relaxed text-lg">{selectedStep.description}</p>
                                        </div>

                                        {selectedStep.resource_url && (
                                            <div className="bg-blue-600/5 border border-blue-500/20 rounded-[32px] p-6 flex items-center justify-between group hover:bg-blue-600/10 transition-all cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">Class Resources</p>
                                                        <p className="text-xs text-blue-400">Download slides and source code</p>
                                                    </div>
                                                </div>
                                                <a href={selectedStep.resource_url} target="_blank" rel="noreferrer" className="p-3 bg-slate-900 rounded-xl text-white group-hover:scale-110 transition-transform">
                                                    <ArrowRight className="w-5 h-5" />
                                                </a>
                                            </div>
                                        )}
                                    </>
                                )}

                                {selectedStep.step_type === 'quiz' && (
                                    <div className="space-y-8">
                                        {quizResult ? (
                                            <div className="text-center py-10 space-y-6 animate-in zoom-in-95">
                                                <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white ${quizResult.passed ? 'bg-emerald-500 shadow-emerald-500/30 shadow-2xl' : 'bg-red-500 shadow-red-500/30'}`}>
                                                    {quizResult.passed ? <Trophy className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl font-black text-white">{quizResult.passed ? 'Excellent Work!' : 'Not Quite There'}</h3>
                                                    <p className="text-slate-400 mt-2">You scored <span className="text-white font-bold">{quizResult.score}/{quizResult.total}</span> ({quizResult.percentage}%)</p>
                                                </div>
                                                {!quizResult.passed && (
                                                    <div className="bg-red-500/10 p-5 rounded-3xl border border-red-500/20 max-w-md mx-auto">
                                                        <p className="text-sm text-red-400 font-medium">
                                                            Score Requirement: <span className="text-white font-bold">80%</span>.
                                                            Keep studying and try again to unlock your next milestone!
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="flex justify-center pt-4">
                                                    <button
                                                        onClick={() => {
                                                            setQuizResult(null);
                                                            setQuizAnswers({});
                                                        }}
                                                        className="px-12 py-4 bg-white text-slate-900 hover:bg-slate-200 font-black rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
                                                    >
                                                        Try Again Now
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-10">
                                                {selectedStep.content?.questions?.map((q, qidx) => (
                                                    <div key={q.id} className="space-y-6">
                                                        <div className="flex gap-4">
                                                            <div className="bg-slate-800 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-slate-400 shrink-0">{qidx + 1}</div>
                                                            <h5 className="text-xl font-bold text-white pt-2 leading-tight">{q.text}</h5>
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-3 pl-14">
                                                            {q.options?.map((opt, oidx) => {
                                                                const isSelected = (quizAnswers[q.id] || []).includes(oidx);
                                                                return (
                                                                    <div
                                                                        key={oidx}
                                                                        onClick={() => {
                                                                            let newAns;
                                                                            if (q.type === 'single') {
                                                                                newAns = [oidx];
                                                                            } else {
                                                                                const current = quizAnswers[q.id] || [];
                                                                                newAns = current.includes(oidx) ? current.filter(i => i !== oidx) : [...current, oidx];
                                                                            }
                                                                            setQuizAnswers({ ...quizAnswers, [q.id]: newAns });
                                                                        }}
                                                                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${isSelected ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                                                                            }`}
                                                                    >
                                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-700'}`}>
                                                                            {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                                        </div>
                                                                        <span className="text-lg font-medium">{opt}</span>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}

                                                <button
                                                    disabled={Object.keys(quizAnswers).length < (selectedStep.content?.questions?.length || 0)}
                                                    onClick={handleQuizSubmit}
                                                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xl font-black rounded-3xl shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                >
                                                    Submit Answers
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(selectedStep.step_type === 'reading' || selectedStep.step_type === 'assignment') && (
                                    <div className="space-y-8">
                                        <div className="p-10 bg-slate-950/50 border border-slate-800 rounded-[40px] text-center space-y-4">
                                            {selectedStep.step_type === 'reading' ? <BookOpen className="w-16 h-16 text-amber-500 mx-auto" /> : <Target className="w-16 h-16 text-orange-500 mx-auto" />}
                                            <h3 className="text-2xl font-bold text-white">{selectedStep.title}</h3>
                                            <p className="text-slate-400 text-lg leading-relaxed">{selectedStep.description}</p>
                                            {selectedStep.resource_url && (
                                                <a
                                                    href={selectedStep.resource_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all"
                                                >
                                                    <LinkIcon className="w-5 h-5" />
                                                    View Reference Materials
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        {!isStepCompleted(selectedStep.id) && selectedStep.step_type !== 'quiz' && (
                            <div className="p-8 border-t border-slate-800 bg-slate-900/50">
                                <button
                                    onClick={() => handleMarkAsCompleted(selectedStep)}
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xl font-black rounded-3xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                                    Mark Day {selectedStep.day_number} as Completed
                                </button>
                                <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-[0.2em] font-bold">Completing today will extend your 🔥 {streak} day streak</p>
                            </div>
                        )}
                        {isStepCompleted(selectedStep.id) && (
                            <div className="p-6 bg-emerald-500/10 border-t border-emerald-500/20 text-center">
                                <p className="text-emerald-400 font-bold flex items-center justify-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Great Job! You have completed this milestone.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseRoadmap;
