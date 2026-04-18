import React, { useState } from 'react';
import { useAuth } from '../hooks';
import api from '../services/api';
import { Settings as SettingsIcon, Link2, ShieldCheck, Mail, Phone, Save, Activity, Wifi, WifiOff, CheckCircle } from 'lucide-react';

function UserIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

const Settings = () => {
    const { user, login } = useAuth();
    const [saving, setSaving] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [connectMsg, setConnectMsg] = useState('');

    const webhookUrl = 'https://web-production-c96b6.up.railway.app/api/whatsapp';
    const verifyToken = 'dealsignal_verify_2026';

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1500);
    };

    // ✅ Embedded Signup Launch
    const launchWhatsAppSignup = () => {
        setConnecting(true);
        setConnectMsg('');

        if (typeof window.FB === 'undefined') {
            setConnectMsg('❌ Facebook SDK load nahi hua. Page refresh karo.');
            setConnecting(false);
            return;
        }

        window.FB.login(async (response) => {
            if (response.authResponse) {
                const code = response.authResponse.code;
                try {
                    const res = await api.post('/auth/whatsapp/connect', { code });
                    if (res.data.success) {
                        login(res.data.data);
                        setConnectMsg('✅ WhatsApp Connected!');
                    }
                } catch (err) {
                    setConnectMsg('❌ Connection failed. Try again.');
                }
            } else {
                setConnectMsg('❌ Login cancelled.');
            }
            setConnecting(false);
        }, {
            config_id: '1438901538011808',
            response_type: 'code',
            override_default_response_type: true,
            extras: {
                setup: {},
                featureType: '',
                sessionInfoVersion: '3',
            }
        });
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto py-8 fade-in">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl box-glow">
                            <SettingsIcon className="w-7 h-7 text-primary" style={{ animationDuration: '8s' }} />
                        </div>
                        Account Settings
                    </h1>
                    <p className="text-slate-400 mt-3 font-medium">Manage your broker profile and Meta integrations securely.</p>
                </div>
            </header>

            {/* Profile Section */}
            <section className="glass-card rounded-[2rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-primary/10 bg-[#152515]/30">
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                            <UserIcon className="w-4 h-4 text-slate-300" />
                        </span>
                        Organization Profile
                    </h2>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group">
                        <label className="block text-sm font-bold tracking-widest uppercase text-slate-500 mb-3">Full Name</label>
                        <div className="bg-[#050a05] border border-slate-800 rounded-xl px-5 py-4 text-slate-200 font-medium">
                            {user?.name || "Not set"}
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-sm font-bold tracking-widest uppercase text-slate-500 mb-3">Tenant ID</label>
                        <div className="bg-[#050a05] border border-slate-800 rounded-xl px-5 py-4 text-primary font-mono font-bold tracking-wide flex items-center justify-between">
                            {user?.tenantId}
                            <span className="text-[10px] bg-primary/10 px-2 py-1 rounded text-primary border border-primary/20">PRIVATE</span>
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-sm font-bold tracking-widest uppercase text-slate-500 mb-3">Mobile Number</label>
                        <div className="bg-[#050a05] border border-slate-800 rounded-xl px-5 py-4 text-slate-200 font-medium flex items-center gap-3">
                            <Phone className="w-5 h-5 text-slate-600" />
                            {user?.mobile}
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-sm font-bold tracking-widest uppercase text-slate-500 mb-3">Email Address</label>
                        <div className="bg-[#050a05] border border-slate-800 rounded-xl px-5 py-4 text-slate-200 font-medium flex items-center gap-3">
                            <Mail className="w-5 h-5 text-slate-600" />
                            {user?.email || "Not set"}
                        </div>
                    </div>
                </div>
            </section>

            {/* ✅ WhatsApp Connect Section */}
            <section className="glass-card rounded-[2rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-primary/10 bg-[#152515]/30">
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                            <Link2 className="w-4 h-4 text-slate-300" />
                        </span>
                        WhatsApp Business Connection
                    </h2>
                    <p className="text-slate-400 text-sm mt-2 ml-11">Connect your WhatsApp Business number to start receiving leads.</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className={`flex items-center justify-between p-5 rounded-2xl border ${user?.wa_connected ? 'bg-primary/10 border-primary/30' : 'bg-slate-800/50 border-slate-700'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${user?.wa_connected ? 'bg-primary/20 text-primary' : 'bg-slate-700 text-slate-400'}`}>
                                {user?.wa_connected ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
                            </div>
                            <div>
                                <p className="font-bold text-slate-100">
                                    {user?.wa_connected ? '✅ WhatsApp Connected' : '❌ WhatsApp Not Connected'}
                                </p>
                                <p className="text-sm text-slate-400 mt-1">
                                    {user?.wa_connected ? `Number: ${user?.wa_verified_phone}` : 'Connect your WhatsApp Business number'}
                                </p>
                            </div>
                        </div>
                        {user?.wa_connected && (
                            <span className="px-3 py-1.5 rounded-md bg-primary/20 text-primary font-bold text-xs border border-primary/30 flex items-center gap-2">
                                <CheckCircle className="w-3.5 h-3.5" /> ACTIVE
                            </span>
                        )}
                    </div>

                    {!user?.wa_connected && (
                        <div>
                            <button
                                onClick={launchWhatsAppSignup}
                                disabled={connecting}
                                className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] text-slate-900 rounded-xl font-bold text-lg hover:bg-[#1aad52] transition-colors disabled:opacity-50"
                            >
                                {connecting ? (
                                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>💬 Connect WhatsApp Business</>
                                )}
                            </button>
                            {connectMsg && (
                                <p className="text-center mt-3 text-sm font-medium text-primary">{connectMsg}</p>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Webhook Section */}
            <section className="glass-card rounded-[2rem] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="px-8 py-6 border-b border-primary/10 bg-[#152515]/30 relative z-10">
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                            <Link2 className="w-4 h-4 text-slate-300" />
                        </span>
                        WhatsApp Cloud Platform
                    </h2>
                    <p className="text-slate-400 text-sm mt-2 ml-11 font-medium">Link this webhook to your Meta Developer Dashboard.</p>
                </div>

                <div className="p-8 space-y-8 relative z-10">
                    <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-5 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/20 p-3 rounded-full text-primary">
                                <Activity className="w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-100 text-lg">Multi-Tenant Routing Active</p>
                                <p className="text-sm text-slate-400 mt-1">DealSignal engine is securely processing incoming drops.</p>
                            </div>
                        </div>
                        <div className="px-3 py-1.5 rounded-md bg-green-500/20 text-green-400 font-bold text-xs border border-green-500/30 flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5" /> ENCRYPTED
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="group">
                            <label className="flex items-center justify-between text-sm font-bold tracking-widest uppercase text-slate-500 mb-3">
                                <span>Webhook Callback URL</span>
                                <span className="text-[10px] text-primary/70 bg-primary/10 px-2 py-0.5 rounded">READ ONLY</span>
                            </label>
                            <div className="flex shadow-inner rounded-xl overflow-hidden">
                                <input type="text" readOnly value={webhookUrl} className="flex-1 bg-[#050a05] border-y border-l border-slate-700 px-5 py-4 text-slate-300 font-mono text-[13px] focus:outline-none" />
                                <button onClick={() => navigator.clipboard.writeText(webhookUrl)} className="bg-slate-800 hover:bg-primary hover:text-[#0a0f0a] border border-slate-700 px-6 font-bold transition-all">Copy</button>
                            </div>
                        </div>

                        <div className="group">
                            <label className="flex items-center justify-between text-sm font-bold tracking-widest uppercase text-slate-500 mb-3">
                                <span>Verification Token</span>
                            </label>
                            <div className="flex shadow-inner rounded-xl overflow-hidden">
                                <input type="text" readOnly value={verifyToken} className="flex-1 bg-[#050a05] border-y border-l border-slate-700 px-5 py-4 text-slate-300 font-mono text-[13px] focus:outline-none" />
                                <button onClick={() => navigator.clipboard.writeText(verifyToken)} className="bg-slate-800 hover:bg-primary hover:text-[#0a0f0a] border border-slate-700 px-6 font-bold transition-all">Copy</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex justify-end pt-4">
                <button onClick={handleSave} className="btn-shimmer px-8 py-4 rounded-xl flex items-center gap-3 font-bold text-lg">
                    {saving ? (
                        <><div className="w-5 h-5 border-2 border-slate-900/30 border-t-[#0a0f0a] rounded-full animate-spin"></div>Saving...</>
                    ) : (
                        <><Save className="w-5 h-5" /> Save Environment</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Settings;