import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks';
import api from '../services/api';
import { User, LogOut, Code, Calendar, Edit2, Check, X, Building2, BarChart2, ShieldCheck, Phone } from 'lucide-react';
import { format } from 'date-fns';

const Profile = () => {
    const { user, login, logout } = useAuth();
    const [stats, setStats] = useState({ total: 0, qualified: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/leads/stats');
            setStats(data.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleSaveProfile = async () => {
        if (!editName.trim()) {
            setError('Name cannot be empty');
            return;
        }

        setSaving(true);
        setError(null);
        try {
            const { data } = await api.put('/auth/profile', { name: editName });
            
            // Update auth context with new broker details
            // Our backend returns the full updated broker object, we just pass it to login()
            // AuthContext treats login() effectively as "set user data"
            login(data.data);
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const cancelEdit = () => {
        setEditName(user?.name || '');
        setIsEditing(false);
        setError(null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                <User className="w-8 h-8 text-primary" />
                Broker Profile
            </h1>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
                    <X className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Identity Card */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                        <div className="h-24 bg-gradient-to-r from-primary/20 to-slate-900"></div>
                        <div className="px-8 pb-8 relative">
                            {/* Avatar */}
                            <div className="w-24 h-24 bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center border-4 border-slate-900 absolute -top-12">
                                <span className="text-3xl font-bold text-slate-300">
                                    {(user?.name || 'B')[0].toUpperCase()}
                                </span>
                            </div>

                            <div className="mt-16 flex justify-between items-start">
                                <div className="space-y-1 w-full">
                                    {isEditing ? (
                                        <div className="space-y-3 pr-8">
                                            <label className="block text-sm font-medium text-slate-400">Display Name</label>
                                            <input 
                                                type="text" 
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                placeholder="Enter full name"
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={handleSaveProfile}
                                                    disabled={saving}
                                                    className="px-4 py-2 bg-primary text-slate-950 rounded-lg font-medium hover:bg-primary-hover transition-colors flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {saving ? <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> : <Check className="w-4 h-4" />}
                                                    Save
                                                </button>
                                                <button 
                                                    onClick={cancelEdit}
                                                    disabled={saving}
                                                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-2xl font-bold text-slate-100">{user?.name}</h2>
                                                <button 
                                                    onClick={() => setIsEditing(true)}
                                                    className="text-slate-500 hover:text-primary transition-colors p-1"
                                                    title="Edit Name"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                                                {user?.role === 'admin' ? 'Administrator' : 'Standard Broker'}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-800 bg-slate-900/50 p-6">
                            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <Phone className="w-5 h-5 text-slate-500" />
                                        <span className="font-medium">Registered Phone</span>
                                    </div>
                                    <span className="text-slate-100 font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800">
                                        +91 {user?.mobile}
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <Code className="w-5 h-5 text-slate-500" />
                                        <span className="font-medium">Account Email</span>
                                    </div>
                                    <span className="text-slate-100 px-3 py-1 bg-slate-900 rounded border border-slate-800">
                                        {user?.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Key Details & Actions */}
                <div className="space-y-6">
                    {/* Workspace/Tenant Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Building2 className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold text-slate-100">Workspace</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1 block">Tenant ID (Isolated)</label>
                                <div className="text-sm text-slate-300 font-mono bg-slate-950 p-2 rounded border border-slate-800 break-all">
                                    {user?.tenantId}
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1 block">Account Created</label>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Calendar className="w-4 h-4 text-slate-500" />
                                    {user?.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'Unknown'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <BarChart2 className="w-5 h-5 text-blue-400" />
                            <h2 className="text-lg font-bold text-slate-100">Lifetime Stats</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                                <p className="text-slate-500 text-sm mb-1">Total Leads</p>
                                <p className="text-2xl font-bold text-slate-100">{stats.total}</p>
                            </div>
                            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                                <p className="text-slate-500 text-sm mb-1 flex items-center gap-1">
                                    Qualified <ShieldCheck className="w-3 h-3 text-primary" />
                                </p>
                                <p className="text-2xl font-bold text-primary">{stats.qualified}</p>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-red-400 mb-4">Danger Zone</h2>
                        <button 
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-3 rounded-xl font-medium transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out of Platform
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
