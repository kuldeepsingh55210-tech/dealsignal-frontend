import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, Settings as SettingsIcon, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks';

const Layout = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/leads', label: 'Leads', icon: Users },
        { path: '/chat', label: 'WhatsApp Chat', icon: MessageSquare },
        { path: '/profile', label: 'Profile', icon: User },
        { path: '/settings', label: 'Settings', icon: SettingsIcon },
    ];

    return (
        <div className="flex h-screen bg-[#0a0f0a] overflow-hidden font-sans text-slate-200">
            <aside className="w-64 glass-card flex flex-col relative z-20 m-4 rounded-3xl overflow-hidden transition-all duration-300 pt-2 shadow-2xl border-r border-[#1a2c1a]">
                <div className="p-6 pb-2">
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl box-glow">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        DealSignal
                    </h1>
                </div>

                <nav className="flex-1 p-4 mt-6 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                                        ? 'bg-primary/10 text-primary box-glow border border-primary/20 translate-x-2 font-bold'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#152515] hover:translate-x-1'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
                                        <span className="font-medium tracking-wide">{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-4 m-4 bg-[#050a05] rounded-2xl border border-[#1a2c1a] flex flex-col gap-4 shadow-inner">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'B'}
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary border-2 border-[#050a05] rounded-full animate-pulse"></span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-200 truncate">{user?.name || 'Broker'}</p>
                            <p className="text-xs text-primary truncate font-medium uppercase">Pro Account</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="group flex items-center justify-center gap-2 px-4 py-2.5 w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-transparent hover:border-red-500/30 rounded-xl transition-all duration-300"
                    >
                        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span className="font-bold text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 h-screen overflow-auto relative">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
                <div className="p-8 pb-24 min-h-full relative z-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;