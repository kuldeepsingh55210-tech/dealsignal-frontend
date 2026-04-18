import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Bell, Trash2, CheckCircle, Plus, X, Clock, User, FileText } from 'lucide-react';
import { format } from 'date-fns';

const Reminders = () => {
    const [reminders, setReminders] = useState([]);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        leadId: '',
        note: '',
        remindAt: ''
    });

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [remRes, leadRes] = await Promise.all([
                api.get('/reminders'),
                api.get('/leads')
            ]);
            if (remRes.data.success) setReminders(remRes.data.data);
            if (leadRes.data.success) setLeads(leadRes.data.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!form.leadId || !form.note || !form.remindAt) {
            setError('Sab fields bharein');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const res = await api.post('/reminders', form);
            if (res.data.success) {
                setReminders(prev => [...prev, res.data.data]);
                setShowModal(false);
                setForm({ leadId: '', note: '', remindAt: '' });
            }
        } catch (e) {
            setError(e.response?.data?.message || 'Error creating reminder');
        } finally {
            setSaving(false);
        }
    };

    const handleComplete = async (id) => {
        try {
            await api.patch(`/reminders/${id}/complete`);
            setReminders(prev => prev.map(r => r._id === id ? { ...r, isCompleted: true } : r));
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/reminders/${id}`);
            setReminders(prev => prev.filter(r => r._id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    const pending = reminders.filter(r => !r.isCompleted);
    const completed = reminders.filter(r => r.isCompleted);

    if (loading) return <div className="text-slate-400 flex justify-center p-12">Loading reminders...</div>;

    return (
        <div className="space-y-6 fade-in">
            {/* Header */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">Follow-up Reminders</h1>
                    <p className="text-slate-400 mt-2">Kabhi bhi koi lead miss mat karo.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-primary text-slate-900 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-5 h-5" /> New Reminder
                </button>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <p className="text-slate-400 text-sm mb-1">Total Reminders</p>
                    <p className="text-3xl font-bold text-white">{reminders.length}</p>
                </div>
                <div className="bg-slate-900 border border-orange-500/20 p-5 rounded-2xl">
                    <p className="text-orange-400 text-sm mb-1">⏳ Pending</p>
                    <p className="text-3xl font-bold text-white">{pending.length}</p>
                </div>
                <div className="bg-slate-900 border border-primary/20 p-5 rounded-2xl">
                    <p className="text-primary text-sm mb-1">✅ Completed</p>
                    <p className="text-3xl font-bold text-white">{completed.length}</p>
                </div>
            </div>

            {/* Pending Reminders */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-orange-400" />
                    <h2 className="text-lg font-semibold text-slate-100">Pending Reminders</h2>
                </div>
                <div className="divide-y divide-slate-800">
                    {pending.length === 0 && (
                        <div className="px-6 py-10 text-center text-slate-500">
                            Koi pending reminder nahi hai 🎉
                        </div>
                    )}
                    {pending.map(reminder => (
                        <div key={reminder._id} className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <User className="w-4 h-4 text-primary" />
                                    <span className="text-slate-200 font-semibold">
                                        {reminder.leadId?.name || 'Unknown Lead'}
                                    </span>
                                    <span className="text-slate-500 font-mono text-xs">
                                        {reminder.leadId?.phone}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-slate-500" />
                                    <span className="text-slate-300 text-sm">{reminder.note}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-orange-400" />
                                    <span className={`text-sm font-medium ${new Date(reminder.remindAt) < new Date() ? 'text-red-400' : 'text-orange-400'}`}>
                                        {format(new Date(reminder.remindAt), 'dd MMM yyyy, hh:mm a')}
                                        {new Date(reminder.remindAt) < new Date() && ' (Overdue!)'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleComplete(reminder._id)}
                                    className="p-2 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 transition-colors"
                                    title="Mark Complete"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(reminder._id)}
                                    className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Completed Reminders */}
            {completed.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold text-slate-100">Completed</h2>
                    </div>
                    <div className="divide-y divide-slate-800">
                        {completed.map(reminder => (
                            <div key={reminder._id} className="px-6 py-4 flex items-start justify-between gap-4 opacity-50">
                                <div>
                                    <p className="text-slate-300 font-semibold line-through">
                                        {reminder.leadId?.name || 'Unknown Lead'}
                                    </p>
                                    <p className="text-slate-500 text-sm">{reminder.note}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(reminder._id)}
                                    className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ✅ Create Reminder Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0a0f0a] border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">New Reminder</h2>
                            <button onClick={() => { setShowModal(false); setError(''); }} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}

                            {/* Lead Select */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Lead Select Karo</label>
                                <select
                                    value={form.leadId}
                                    onChange={e => setForm(prev => ({ ...prev, leadId: e.target.value }))}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary"
                                >
                                    <option value="">-- Lead chunein --</option>
                                    {leads.map(lead => (
                                        <option key={lead._id} value={lead._id}>
                                            {lead.name} — {lead.phone}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Note */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Note</label>
                                <textarea
                                    value={form.note}
                                    onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))}
                                    rows={3}
                                    placeholder="e.g. Call karke budget discuss karo"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-primary resize-none"
                                />
                            </div>

                            {/* Date Time */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Remind At</label>
                                <input
                                    type="datetime-local"
                                    value={form.remindAt}
                                    onChange={e => setForm(prev => ({ ...prev, remindAt: e.target.value }))}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary"
                                />
                            </div>

                            <button
                                onClick={handleCreate}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-slate-900 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {saving ? <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <><Bell className="w-4 h-4" /> Set Reminder</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reminders;