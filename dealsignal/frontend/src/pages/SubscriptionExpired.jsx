import React from 'react';
import { useAuth } from '../hooks';
import { AlertTriangle, Crown, ArrowRight, LogOut } from 'lucide-react';

const SubscriptionExpired = () => {
    const { logout, user } = useAuth();

    return (
        <div className="min-h-screen bg-[#0a0f0a] flex flex-col justify-center items-center px-6 relative overflow-hidden">
            {/* Glow Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-500/10 blur-[140px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[130px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Icon */}
                <div className="flex justify-center mb-8">
                    <div className="p-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.15)]">
                        <AlertTriangle className="w-14 h-14 text-red-400" />
                    </div>
                </div>

                {/* Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Subscription Expire Ho Gayi
                    </h1>
                    <p className="text-slate-400 text-sm mb-8">
                        Aapka <span className="text-primary font-semibold">{user?.subscription?.plan?.toUpperCase() || 'TRIAL'}</span> plan expire ho gaya hai. Dashboard access ke liye plan renew karo.
                    </p>

                    {/* Plans */}
                    <div className="space-y-3 mb-8">
                        {/* Basic Plan */}
                        <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700">
                            <div className="text-left">
                                <p className="text-white font-bold">Basic Plan</p>
                                <p className="text-slate-400 text-xs">100 leads/month</p>
                            </div>
                            <div className="text-right">
                                <p className="text-primary font-bold text-lg">₹999<span className="text-slate-500 text-sm">/mo</span></p>
                            </div>
                        </div>

                        {/* Pro Plan */}
                        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/30 relative">
                            <div className="absolute -top-2 -right-2 bg-primary text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                                POPULAR
                            </div>
                            <div className="text-left">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-4 h-4 text-primary" />
                                    <p className="text-white font-bold">Pro Plan</p>
                                </div>
                                <p className="text-slate-400 text-xs">Unlimited leads + WhatsApp</p>
                            </div>
                            <div className="text-right">
                                <p className="text-primary font-bold text-lg">₹1999<span className="text-slate-500 text-sm">/mo</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <button
                        onClick={() => window.open('https://narrowtech.in/#pricing', '_blank')}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-slate-900 rounded-xl font-bold hover:bg-primary/90 transition-colors mb-3"
                    >
                        <Crown className="w-5 h-5" />
                        Plan Renew Karo
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 text-slate-400 rounded-xl font-medium hover:bg-slate-700 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    Help ke liye contact karo: support@narrowtech.in
                </p>
            </div>
        </div>
    );
};

export default SubscriptionExpired;