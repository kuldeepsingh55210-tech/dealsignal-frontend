import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks';
import api from '../services/api';
import { Users, Flame, ThermometerSun, Snowflake, Home, Building2, MapPin, IndianRupee } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:border-slate-700 hover:bg-slate-800/50">
        <div className={`p-4 rounded-xl flex-shrink-0 ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <h3 className="text-2xl font-bold text-slate-100">{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [allLeads, setAllLeads] = useState([]);
    const [category, setCategory] = useState('buy'); // 'buy' or 'rent'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const leadsRes = await api.get('/leads');
                if (leadsRes.data.success) {
                    setAllLeads(Array.isArray(leadsRes.data.data) ? leadsRes.data.data : []);
                }
            } catch (error) {
                console.error("Dashboard data fetch failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const filteredLeads = allLeads.filter(l => l.qualification?.category === category);
    
    const stats = {
        total: filteredLeads.length,
        hot: filteredLeads.filter(l => l.qualification?.leadScore === 'hot').length,
        warm: filteredLeads.filter(l => l.qualification?.leadScore === 'warm').length,
        cold: filteredLeads.filter(l => l.qualification?.leadScore === 'cold').length,
    };

    const recentLeads = filteredLeads.slice(0, 5);

    if (loading) return <div className="text-slate-400 flex items-center justify-center p-12">Loading metrics...</div>;

    const getScoreBadge = (score) => {
        switch (score) {
            case 'hot': return <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-semibold border border-red-500/30">🔥 HOT</span>;
            case 'warm': return <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-semibold border border-orange-500/30">☀️ WARM</span>;
            case 'cold': return <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold border border-blue-500/30">❄️ COLD</span>;
            default: return <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold border border-slate-600">NEW</span>;
        }
    };

    const getPropertyIcon = (type) => {
        if (!type) return '❓';
        if (type.includes('plot')) return '🌳';
        if (type.includes('flat')) return '🏢';
        if (type.includes('ghar') || type.includes('home')) return '🏡';
        if (type.includes('room') || type.includes('single')) return '🚪';
        return '🏢';
    };

    return (
        <div className="space-y-8 fade-in">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">Overview</h1>
                    <p className="text-slate-400 mt-2">Welcome back, <span className="text-primary">{user?.name || 'Broker'}</span>.</p>
                </div>
                
                <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                    <button 
                        onClick={() => setCategory('buy')}
                        className={`px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all ${category === 'buy' ? 'bg-primary text-[#0a0f0a] shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                    >
                        <Home className="w-4 h-4" /> Buy Leads
                    </button>
                    <button 
                        onClick={() => setCategory('rent')}
                        className={`px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all ${category === 'rent' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                    >
                        <Building2 className="w-4 h-4" /> Rent Leads
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title={`${category === 'buy' ? 'Buy' : 'Rent'} Leads (Total)`} 
                    value={stats.total} 
                    icon={Users} 
                    color={category === 'buy' ? "bg-primary/10 text-primary" : "bg-indigo-500/10 text-indigo-500"} 
                />
                <StatCard title="HOT Leads" value={stats.hot} icon={Flame} color="bg-red-500/10 text-red-500" />
                <StatCard title="WARM Leads" value={stats.warm} icon={ThermometerSun} color="bg-orange-500/10 text-orange-500" />
                <StatCard title="COLD Leads" value={stats.cold} icon={Snowflake} color="bg-blue-500/10 text-blue-500" />
            </div>

            <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-2">
                    {category === 'buy' ? <Home className="w-5 h-5 text-primary" /> : <Building2 className="w-5 h-5 text-indigo-500" />}
                    <h2 className="text-lg font-semibold text-slate-100">Recent {category === 'buy' ? 'Buy' : 'Rent'} Leads</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-sm font-medium text-slate-400">Lead Info</th>
                                <th className="px-6 py-4 text-sm font-medium text-slate-400">Property</th>
                                <th className="px-6 py-4 text-sm font-medium text-slate-400">Budget</th>
                                <th className="px-6 py-4 text-sm font-medium text-slate-400">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {recentLeads.map(lead => (
                                <tr key={lead._id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-slate-200 font-semibold">{lead.name}</div>
                                        <div className="text-slate-400 font-mono text-sm">{lead.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <span className="text-xl">{getPropertyIcon(lead.qualification?.propertyType)}</span>
                                            <span className="capitalize">{lead.qualification?.propertyType || 'Unknown'}</span>
                                        </div>
                                        <div className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {lead.qualification?.location || 'Not provided'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-300 font-mono flex items-center gap-1">
                                            <IndianRupee className="w-3 h-3" /> {lead.qualification?.budget || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getScoreBadge(lead.qualification?.leadScore)}
                                    </td>
                                </tr>
                            ))}
                            {recentLeads.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                        No {category} leads yet. 
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
