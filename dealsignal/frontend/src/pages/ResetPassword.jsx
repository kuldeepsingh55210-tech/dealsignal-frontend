import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ShieldCheck, Eye, EyeOff, MessageSquare } from 'lucide-react';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const token = new URLSearchParams(window.location.search).get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Dono passwords match nahi kar rahe!');
            return;
        }
        if (password.length < 6) {
            setError('Password kam se kam 6 characters ka hona chahiye');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f0a] flex flex-col justify-center items-center px-6">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[140px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="glass-card p-5 rounded-[2rem] shadow-2xl border-primary/30 mb-6">
                        <MessageSquare className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-2">DealSignal</h1>
                </div>

                <div className="glass-card rounded-[2rem] p-8 shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                    {success ? (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">✅</div>
                            <h2 className="text-2xl font-bold text-white mb-2">Password Reset Ho Gaya!</h2>
                            <p className="text-slate-400">3 seconds mein login page pe redirect ho rahe hain...</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                            <p className="text-slate-400 text-sm mb-6">Apna naya password set karo</p>

                            {!token && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
                                    ❌ Invalid reset link. Dobara forgot password request karo.
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">New Password</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="block w-full pl-12 pr-12 py-4 bg-[#060d06]/80 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40"
                                            placeholder="Min 6 characters"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary">
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 bg-[#060d06]/80 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40"
                                            placeholder="Password dobara daalo"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !token}
                                    className="w-full btn-shimmer py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                                >
                                    {loading
                                        ? <div className="w-6 h-6 border-2 border-slate-900/30 border-t-slate-950 rounded-full animate-spin"></div>
                                        : 'Reset Password'
                                    }
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <p className="text-center text-slate-600 font-medium text-xs tracking-widest uppercase mt-8">
                    Secure By DealSignal © 2026
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;