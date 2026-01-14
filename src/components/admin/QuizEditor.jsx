import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, X } from 'lucide-react';

const QuizEditor = ({ quizData, onSave, onCancel }) => {
    const [questions, setQuestions] = useState(quizData?.questions || [
        {
            id: Date.now(),
            text: '',
            type: 'single', // 'single' or 'multiple'
            options: ['', '', '', ''],
            correctAnswers: [] // Indices of correct options
        }
    ]);

    const addQuestion = () => {
        setQuestions([...questions, {
            id: Date.now(),
            text: '',
            type: 'single',
            options: ['', '', '', ''],
            correctAnswers: []
        }]);
    };

    const removeQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const updateQuestion = (id, field, value) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const toggleCorrectAnswer = (questionId, optionIndex) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                let newCorrect;
                if (q.type === 'single') {
                    newCorrect = [optionIndex];
                } else {
                    if (q.correctAnswers.includes(optionIndex)) {
                        newCorrect = q.correctAnswers.filter(i => i !== optionIndex);
                    } else {
                        newCorrect = [...q.correctAnswers, optionIndex];
                    }
                }
                return { ...q, correctAnswers: newCorrect };
            }
            return q;
        }));
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div>
                        <h3 className="text-xl font-bold text-white">Quiz Editor</h3>
                        <p className="text-sm text-slate-400">Configure questions and correct answers.</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
                        <button
                            onClick={() => onSave({ questions })}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
                        >
                            Confirm Quiz
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {questions.map((q, qIndex) => (
                        <div key={q.id} className="relative bg-slate-950/40 border border-slate-800 rounded-2xl p-6 group">
                            <button
                                onClick={() => removeQuestion(q.id)}
                                className="absolute top-4 right-4 p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Question {qIndex + 1}</label>
                                        <input
                                            type="text"
                                            value={q.text}
                                            onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                                            placeholder="Enter question text..."
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="w-40 space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</label>
                                        <select
                                            value={q.type}
                                            onChange={(e) => updateQuestion(q.id, 'type', e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 outline-none focus:border-blue-500"
                                        >
                                            <option value="single">Single Choice</option>
                                            <option value="multiple">Multiple Choice</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.options.map((opt, oIndex) => (
                                        <div key={oIndex} className="relative">
                                            <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${q.correctAnswers.includes(oIndex)
                                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                                    : 'border-slate-700 text-transparent hover:border-emerald-500/50'
                                                }`}
                                                onClick={() => toggleCorrectAnswer(q.id, oIndex)}
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => {
                                                    const newOpts = [...q.options];
                                                    newOpts[oIndex] = e.target.value;
                                                    updateQuestion(q.id, 'options', newOpts);
                                                }}
                                                placeholder={`Option ${oIndex + 1}`}
                                                className={`w-full bg-slate-900 border rounded-xl pl-12 pr-4 py-3 text-sm transition-all outline-none ${q.correctAnswers.includes(oIndex)
                                                        ? 'border-emerald-500/50 text-emerald-400'
                                                        : 'border-slate-800 text-slate-300 focus:border-blue-500'
                                                    }`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addQuestion}
                        className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2 font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Add Question
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizEditor;
