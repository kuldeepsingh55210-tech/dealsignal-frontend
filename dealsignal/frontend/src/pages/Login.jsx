import React, { useState } from 'react';
import { useAuth } from '../hooks';
import api from '../services/api';
import { Phone, Mail, ArrowRight, ShieldCheck, MessageSquare, Eye, EyeOff, User, MapPin } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '', gender: '', city: '', mobile: '', email: '', password: '', code: ''
    });

    const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    // ✅ Login with Password
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });
            login(data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Register Step 1 — Send OTP
    const handleRegisterSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post('/auth/register/send-otp', {
                name: formData.name,
                gender: formData.gender,
                city: formData.city,
                mobile: formData.mobile,
                email: formData.email,
                password: formData.password
            });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Register Step 2 — Verify OTP
    const handleRegisterVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/register/verify-otp', {
                name: formData.name,
                gender: formData.gender,
                city: formData.city,
                mobile: formData.mobile,
                email: formData.email,
                password: formData.password,
                code: formData.code
            });
            login(data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Forgot Password
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await api.post('/auth/forgot-password', { email: formData.email });
            setSuccess('Password reset link email pe bhej diya gaya hai! ✅');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f0a] flex flex-col justify-center items-center relative overflow-hidden font-sans px-6">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[140px] pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[130px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="glass-card p-5 rounded-[2rem] shadow-2xl border-primary/30 mb-6 shadow-[0_0_30px_rgba(37,211,102,0.15)]">
                        <MessageSquare className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-5xl font-extrabold text-white tracking-tight mb-3">DealSignal</h1>
                    <p className="text-primary font-bold tracking-widest uppercase text-sm">Premium Real Estate CRM</p>
                </div>

                <div className="glass-card rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                    {/* ✅ LOGIN FORM */}
                    {mode === 'login' && (
                        <>
                            <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>
                            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}

                            <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                        <input type="email" required value={formData.email} onChange={e => update('email', e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 bg-[#060d06]/80 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
                                            placeholder="broker@dealsignal.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Password</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                        <input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={e => update('password', e.target.value)}
                                            className="block w-full pl-12 pr-12 py-4 bg-[#060d06]/80 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
                                            placeholder="••••••••" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary">
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button type="button" onClick={() => { setMode('forgot'); setError(null); }} className="text-sm text-primary hover:underline">
                                        Forgot Password?
                                    </button>
                                </div>

                                <button type="submit" disabled={loading} className="w-full btn-shimmer py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg">
                                    {loading ? <div className="w-6 h-6 border-2 border-slate-900/30 border-t-slate-950 rounded-full animate-spin"></div> : <><span>Login</span><ArrowRight className="w-5 h-5" /></>}
                                </button>
                            </form>

                            <p className="text-center text-slate-500 text-sm mt-6">
                                Account nahi hai?{' '}
                                <button onClick={() => { setMode('register'); setStep(1); setError(null); }} className="text-primary font-bold hover:underline">
                                    Register Karo
                                </button>
                            </p>
                        </>
                    )}

                    {/* ✅ REGISTER FORM */}
                    {mode === 'register' && step === 1 && (
                        <>
                            <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
                            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}

                            <form onSubmit={handleRegisterSendOTP} className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                        <input type="text" required value={formData.name} onChange={e => update('name', e.target.value)}
                                            className="block w-full pl-12 pr-4 py-3.5 bg-[#060d06]/80 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40"
                                            placeholder="Kuldeep Singh" />
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Gender</label>
                                    <select required value={formData.gender} onChange={e => update('gender', e.target.value)}
                                        className="block w-full px-4 py-3.5 bg-[#060d06]/80 border border-slate-700/50 rounded-2xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40">
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">City</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                        <input type="text" required value={formData.city} onChange={e => update('city', e.target.value)}
                                            className="block w-full pl-12 pr-4 py-3.5 bg-[#060d06]/80 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40"
                                            placeholder="Mumbai" />
                                    </div>
                                </div>

                                {/* Mobile */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Mobile Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                        <input type="tel" required maxLength={10} value={formData.mobile} onChange={e => update('mobile', e.target.value.replace(/\D/g, ''))}
                                            className="block w-full pl-12 pr-4 py-3.5 bg-[#060d06]/80 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40"
                                            placeholder="9484572199" />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                        <input type="email" required value={formData.email} onChange={e => update('email', e.target.value)}
                                            className="block w-full pl-12 pr-4 py-3.5 bg-[#060d06]/80 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40"
                                            placeholder="broker@dealsignal.com" />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Password</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                        <input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={e => update('password', e.target.value)}
                                            className="block w-full pl-12 pr-12 py-3.5 bg-[#060d06]/80 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40"
                                            placeholder="Min 6 characters" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary">
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="w-full btn-shimmer py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg mt-2">
                                    {loading ? <div className="w-6 h-6 border-2 border-slate-900/30 border-t-slate-950 rounded-full animate-spin"></div> : <><span>Send OTP</span><ArrowRight className="w-5 h-5" /></>}
                                </button>
                            </form>

                            <p className="text-center text-slate-500 text-sm mt-6">
                                Already account hai?{' '}
                                <button onClick={() => { setMode('login'); setError(null); }} className="text-primary font-bold hover:underline">
                                    Login Karo
                                </button>
                            </p>
                        </>
                    )}

                    {/* ✅ OTP VERIFY */}
                    {mode === 'register' && step === 2 && (
                        <>
                            <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
                            <p className="text-slate-400 text-sm mb-6">OTP bheja gaya hai <span className="text-primary font-bold">{formData.email}</span> pe</p>
                            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}

                            <form onSubmit={handleRegisterVerifyOTP} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Enter OTP</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
                                        <input type="text" required maxLength={6} autoFocus value={formData.code} onChange={e => update('code', e.target.value.replace(/\D/g, ''))}
                                            className="block w-full pl-14 pr-4 py-4 bg-[#060d06]/80 border border-primary/30 rounded-2xl text-primary tracking-[0.5em] text-center font-bold text-2xl placeholder-slate-700/30 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="------" />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full btn-shimmer py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg">
                                    {loading ? <div className="w-6 h-6 border-2 border-slate-900/30 border-t-slate-950 rounded-full animate-spin"></div> : 'Verify & Create Account'}
                                </button>
                                <button type="button" onClick={() => setStep(1)} className="w-full text-slate-500 hover:text-primary text-sm font-semibold">
                                    ← Go Back
                                </button>
                            </form>
                        </>
                    )}

                    {/* ✅ FORGOT PASSWORD */}
                    {mode === 'forgot' && (
                        <>
                            <h2 className="text-2xl font-bold text-white mb-2">Forgot Password</h2>
                            <p className="text-slate-400 text-sm mb-6">Apna registered email enter karo — reset link bhejenge</p>
                            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
                            {success && <div className="bg-primary/10 border border-primary/30 text-primary px-4 py-3 rounded-xl mb-4 text-sm">{success}</div>}

                            <form onSubmit={handleForgotPassword} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                        <input type="email" required value={formData.email} onChange={e => update('email', e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 bg-[#060d06]/80 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40"
                                            placeholder="broker@dealsignal.com" />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full btn-shimmer py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg">
                                    {loading ? <div className="w-6 h-6 border-2 border-slate-900/30 border-t-slate-950 rounded-full animate-spin"></div> : 'Send Reset Link'}
                                </button>
                                <button type="button" onClick={() => { setMode('login'); setError(null); setSuccess(null); }} className="w-full text-slate-500 hover:text-primary text-sm font-semibold">
                                    ← Back to Login
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

export default Login;