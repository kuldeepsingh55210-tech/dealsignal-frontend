import React, { useState } from 'react';
import { useAuth } from '../hooks';
import { Settings as SettingsIcon, Link2, ShieldCheck, Mail, Phone, Building, Save, Activity } from 'lucide-react';

// Defined before Settings component so it's in scope when used in JSX
function UserIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

const Settings = () => {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);

    // In a real app this would come from env or config endpoint
    const webhookUrl = `${window.location.origin.replace('5173', '5000')}/api/whatsapp`;
    const verifyToken = import.meta.env.VITE_WEBHOOK_VERIFY_TOKEN || "dealsignal_verify_2026";

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1500);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto py-8 fade-in">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl box-glow">
                            <SettingsIcon className="w-7 h-7 text-primary animate-spin-slow" style={{ animationDuration: '8s' }} />
                        </div>
                        Account Settings
                    </h1>
                    <p className="text-slate-400 mt-3 font-medium">Manage your broker profile and Meta integrations securely.</p>
                </div>
            </header>

            {/* Profile Section */}
            <section className="glass-card rounded-[2rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-primary/10 bg-[#152515]/30">
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-3 drop-shadow-sm">
                        <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                             <UserIcon className="w-4 h-4 text-slate-300" />
                        </span>
                        Organization Profile
                    </h2>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group">
                        <label className="block text-sm font-bold tracking-widest uppercase text-slate-500 mb-3 group-hover:text-primary transition-colors">Full Name</label>
                        <div className="bg-[#050a05] border border-slate-800 rounded-xl px-5 py-4 text-slate-200 font-medium group-hover:border-primary/30 transition-colors shadow-inner">
                            {user?.name || "Not set"}
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-sm font-bold tracking-widest uppercase text-slate-500 mb-3 group-hover:text-primary transition-colors">Tenant ID</label>
                        <div className="bg-[#050a05] border border-slate-800 rounded-xl px-5 py-4 text-primary font-mono font-bold tracking-wide group-hover:border-primary/30 transition-colors shadow-inner flex items-center justify-between">
                            {user?.tenantId}
                            <span className="text-[10px] bg-primary/10 px-2 py-1 rounded text-primary border border-primary/20">PRIVATE</span>
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-sm font-bold tracking-widest uppercase text-slate-500 mb-3 group-hover:text-primary transition-colors">Mobile Number</label>
                        <div className="bg-[#050a05] border border-slate-800 rounded-xl px-5 py-4 text-slate-200 font-medium flex items-center gap-3 group-hover:border-primary/30 transition-colors shadow-inner">
                            <Phone className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
                            {user?.mobile}
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-sm font-bold tracking-widest uppercase text-slate-500 mb-3 group-hover:text-primary transition-colors">Email Address</label>
                        <div className="bg-[#050a05] border border-slate-800 rounded-xl px-5 py-4 text-slate-200 font-medium flex items-center gap-3 group-hover:border-primary/30 transition-colors shadow-inner">
                            <Mail className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
                            {user?.email || "Not set"}
                        </div>
                    </div>
                </div>
            </section>

            {/* Integration Section */}
            <section className="glass-card rounded-[2rem] overflow-hidden relative">
                {/* Glow behind section */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="px-8 py-6 border-b border-primary/10 bg-[#152515]/30 relative z-10">
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                             <Link2 className="w-4 h-4 text-slate-300" />
                        </span>
                        WhatsApp Cloud Platform
                    </h2>
                    <p className="text-slate-400 text-sm mt-2 ml-11 font-medium">Link this webhook to your Meta Developer Dashboard to route messages.</p>
                </div>

                <div className="p-8 space-y-8 relative z-10">
                    <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-5 rounded-2xl relative overflow-hidden group hover:bg-primary/15 transition-colors">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary drop-shadow-[0_0_5px_#25D366]"></div>
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/20 p-3 rounded-full text-primary">
                                <Activity className="w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-100 text-lg">Multi-Tenant Routing Active</p>
                                <p className="text-sm text-slate-400 mt-1 font-medium">DealSignal engine is securely processing incoming drops.</p>
                            </div>
                        </div>
                        <div className="px-3 py-1.5 rounded-md bg-green-500/20 text-green-400 font-bold text-xs border border-green-500/30 flex items-center gap-2">
                           <ShieldCheck className="w-3.5 h-3.5" /> ENCRYPTED
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="group">
                            <label className="flex items-center justify-between text-sm font-bold tracking-widest uppercase text-slate-500 mb-3">
                                <span className="group-hover:text-primary transition-colors">Webhook Callback URL</span>
                                <span className="text-[10px] text-primary/70 bg-primary/10 px-2 py-0.5 rounded cursor-pointer hover:bg-primary/20 transition-colors">READ ONLY</span>
                            </label>
                            <div className="flex shadow-inner rounded-xl overflow-hidden group-hover:shadow-[0_0_15px_rgba(37,211,102,0.1)] transition-shadow">
                                <input
                                    type="text"
                                    readOnly
                                    value={webhookUrl}
                                    className="flex-1 bg-[#050a05] border-y border-l border-slate-700 px-5 py-4 text-slate-300 font-mono text-[13px] tracking-wide focus:outline-none"
                                />
                                <button
                                    onClick={() => navigator.clipboard.writeText(webhookUrl)}
                                    className="bg-slate-800 hover:bg-primary hover:text-[#0a0f0a] border border-slate-700 hover:border-primary px-6 font-bold transition-all duration-300 flex items-center gap-2"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div className="group">
                            <label className="flex items-center justify-between text-sm font-bold tracking-widest uppercase text-slate-500 mb-3">
                                <span className="group-hover:text-primary transition-colors">Verification Token</span>
                            </label>
                            <div className="flex shadow-inner rounded-xl overflow-hidden group-hover:shadow-[0_0_15px_rgba(37,211,102,0.1)] transition-shadow">
                                <input
                                    type="text"
                                    readOnly
                                    value={verifyToken}
                                    className="flex-1 bg-[#050a05] border-y border-l border-slate-700 px-5 py-4 text-slate-300 font-mono text-[13px] tracking-wide focus:outline-none"
                                />
                                <button
                                    onClick={() => navigator.clipboard.writeText(verifyToken)}
                                    className="bg-slate-800 hover:bg-primary hover:text-[#0a0f0a] border border-slate-700 hover:border-primary px-6 font-bold transition-all duration-300 flex items-center gap-2"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex justify-end pt-4">
                <button
                   onClick={handleSave}
                   className="btn-shimmer px-8 py-4 rounded-xl flex items-center gap-3 font-bold text-lg shadow-[0_0_15px_rgba(37,211,102,0.2)]"
                >
                    {saving ? (
                         <>
                         <div className="w-5 h-5 border-2 border-slate-900/30 border-t-[#0a0f0a] rounded-full animate-spin"></div>
                         Saving Config...
                         </>
                    ) : (
                         <>
                         <Save className="w-5 h-5" /> Save Environment
                         </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Settings;
