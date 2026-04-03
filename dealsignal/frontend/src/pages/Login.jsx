import React, { useState } from 'react';
import { useAuth } from '../hooks';
import api from '../services/api';
import { Phone, Mail, ArrowRight, ShieldCheck, MessageSquare } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ mobile: '', email: '', code: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post('/auth/send-otp', {
                mobile: formData.mobile,
                email: formData.email
            });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/verify-otp', {
                mobile: formData.mobile,
                code: formData.code
            });
            login(data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f0a] flex flex-col justify-center items-center relative overflow-hidden font-sans">
            {/* Animated Particles & Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[140px] pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-[20%] right-[10%] w-2 h-2 rounded-full bg-primary/50 shadow-[0_0_10px_#25D366] animate-pulse-slow"></div>
            <div className="absolute bottom-[20%] left-[10%] w-3 h-3 rounded-full bg-primary/30 shadow-[0_0_15px_#25D366] animate-pulse-slow" style={{animationDelay: '2s'}}></div>

            <div className="w-full max-w-md relative z-10 px-6 animate-fade-in-up">
                <div className="text-center mb-10 flex flex-col items-center">
                    <div className="glass-card p-5 rounded-[2rem] shadow-2xl border-primary/30 mb-6 relative group cursor-default shadow-[0_0_30px_rgba(37,211,102,0.15)]">
                        <div className="absolute inset-0 bg-primary/10 rounded-[2rem] transform group-hover:scale-110 transition-transform duration-500"></div>
                        <MessageSquare className="w-12 h-12 text-primary relative z-10 text-glow" />
                    </div>
                    <h1 className="text-5xl font-extrabold text-white tracking-tight mb-3 text-glow">DealSignal</h1>
                    <p className="text-primary font-bold tracking-widest uppercase text-sm opacity-90">Premium Real Estate CRM</p>
                </div>

                <div className="glass-card rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                    {/* Glowing header accent line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                    <h2 className="text-2xl font-bold text-white mb-6">
                        {step === 1 ? 'Welcome back' : 'Verify Identity'}
                    </h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 animate-fade-in">
                            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleRequestOTP} className="space-y-5">
                            <div className="group">
                                <label className="block text-sm font-bold tracking-wide text-slate-400 mb-2 group-focus-within:text-primary transition-colors">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="block w-full pl-12 pr-4 py-4 bg-[#060d06]/80 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all font-medium hover:border-primary/30"
                                        placeholder="broker@dealsignal.com"
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-sm font-bold tracking-wide text-slate-400 mb-2 group-focus-within:text-primary transition-colors">Mobile Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                                        className="block w-full pl-12 pr-4 py-4 bg-[#060d06]/80 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all font-medium hover:border-primary/30"
                                        placeholder="9484572199"
                                        maxLength={10}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-shimmer py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-8 text-lg"
                            >
                                {loading
                                    ? <div className="w-6 h-6 border-2 border-slate-900/30 border-t-slate-950 rounded-full animate-spin"></div>
                                    : <><span>Send Magic Link</span><ArrowRight className="w-5 h-5" /></>
                                }
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-6 animate-fade-in-up">
                            <div className="bg-[#0a0f0a]/80 border border-[#1a2c1a] p-4 rounded-xl">
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    6-digit OTP code has been sent securely to <br/>
                                    <span className="text-primary font-bold tracking-wide inline-block mt-1">{formData.mobile}</span>
                                </p>
                            </div>
                            <div className="group mt-6">
                                <label className="block text-sm font-bold tracking-wide text-slate-400 mb-2 group-focus-within:text-primary transition-colors">Enter Secure OTP</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <ShieldCheck className="h-6 w-6 text-primary drop-shadow-[0_0_5px_rgba(37,211,102,0.5)]" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        autoFocus
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/\D/g, '') })}
                                        className="block w-full pl-14 pr-4 py-4 bg-[#060d06]/80 border border-primary/30 rounded-2xl text-primary tracking-[0.5em] text-center font-bold text-2xl placeholder-slate-700/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-[0_0_15px_rgba(37,211,102,0.1)]"
                                        placeholder="------"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-shimmer py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 text-lg"
                            >
                                {loading
                                    ? <div className="w-6 h-6 border-2 border-slate-900/30 border-t-slate-950 rounded-full animate-spin"></div>
                                    : 'Verify & Login'
                                }
                            </button>
                            <button type="button" onClick={() => setStep(1)} className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-primary text-sm font-semibold transition-colors mt-2">
                                <span>←</span> Go Back
                            </button>
                        </form>
                    )}
                </div>
                <p className="text-center text-slate-600 font-medium text-xs tracking-widest uppercase mt-8 animate-fade-in" style={{animationDelay: '0.3s'}}>Secure By DealSignal © 2026</p>
            </div>
        </div>
    );
};

export default Login;