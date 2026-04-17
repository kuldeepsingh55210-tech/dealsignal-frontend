import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from 'recharts';
import { TrendingUp, Users, Flame, ThermometerSun, Snowflake, MapPin, IndianRupee, Calendar } from 'lucide-react';

const SCORE_COLORS = { hot: '#ef4444', warm: '#f97316', cold: '#3b82f6' };

const Analytics = () => {
    const [allLeads, setAllLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/leads');
                if (res.data.success) setAllLeads(res.data.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const leads = category === 'all' ? allLeads : allLeads.filter(l => l.qualification?.category === category);

    // ✅ Last 30 days trend
    const getLast30Days = () => {
        const days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const label = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            const count = leads.filter(l => new Date(l.createdAt).toDateString() === date.toDateString()).length;
            days.push({ day: label, leads: count });
        }
        return days;
    };

    // ✅ Score breakdown
    const scoreData = [
        { name: 'HOT', value: leads.filter(l => l.qualification?.leadScore === 'hot').length, color: '#ef4444' },
        { name: 'WARM', value: leads.filter(l => l.qualification?.leadScore === 'warm').length, color: '#f97316' },
        { name: 'COLD', value: leads.filter(l => l.qualification?.leadScore === 'cold').length, color: '#3b82f6' },
    ].filter(d => d.value > 0);

    // ✅ Property type breakdown
    const propertyData = () => {
        const types = {};
        leads.forEach(l => {
            const t = l.qualification?.propertyType || 'Unknown';
            types[t] = (types[t] || 0) + 1;
        });
        return Object.entries(types).map(([name, value]) => ({ name, value }));
    };

    // ✅ Top 5 locations
    const topLocations = () => {
        const locs = {};
        leads.forEach(l => {
            const loc = l.qualification?.location;
            if (loc) locs[loc] = (locs[loc] || 0) + 1;
        });
        return Object.entries(locs)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }));
    };

    // ✅ Status breakdown
    const statusData = () => {
        const statuses = {};
        leads.forEach(l => {
            const s = l.status || 'new';
            statuses[s] = (statuses[s] || 0) + 1;
        });
        return Object.entries(statuses).map(([name, value]) => ({ name, value }));
    };

    // ✅ Conversion rate
    const conversionRate = leads.length > 0
        ? Math.round((leads.filter(l => l.status === 'qualified').length / leads.length) * 100)
        : 0;

    // ✅ Best day of week
    const bestDay = () => {
        const days = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        leads.forEach(l => {
            const day = new Date(l.createdAt).toLocaleDateString('en-IN', { weekday: 'short' });
            if (days[day] !== undefined) days[day]++;
        });
        return Object.entries(days).map(([day, leads]) => ({ day, leads }));
    };

    if (loading) return <div className="text-slate-400 flex items-center justify-center p-12">Loading analytics...</div>;

    return (
        <div className="space-y-8 fade-in">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">Analytics</h1>
                    <p className="text-slate-400 mt-2">Deep insights into your lead pipeline.</p>
                </div>
                {/* Category Filter */}
                <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                    {['all', 'buy', 'rent'].map(c => (
                        <button
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${category === c ? 'bg-primary text-[#0a0f0a]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                        >
                            {c === 'all' ? '🌐 All' : c === 'buy' ? '🏠 Buy' : '🔑 Rent'}
                        </button>
                    ))}
                </div>
            </header>

            {/* ✅ Top Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-2"><Users className="w-4 h-4" /> Total Leads</div>
                    <p className="text-3xl font-bold text-white">{leads.length}</p>
                </div>
                <div className="bg-slate-900 border border-red-500/20 p-5 rounded-2xl">
                    <div className="flex items-center gap-2 text-red-400 text-sm mb-2"><Flame className="w-4 h-4" /> HOT Leads</div>
                    <p className="text-3xl font-bold text-white">{leads.filter(l => l.qualification?.leadScore === 'hot').length}</p>
                </div>
                <div className="bg-slate-900 border border-primary/20 p-5 rounded-2xl">
                    <div className="flex items-center gap-2 text-primary text-sm mb-2"><TrendingUp className="w-4 h-4" /> Conversion Rate</div>
                    <p className="text-3xl font-bold text-white">{conversionRate}%</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-2"><Calendar className="w-4 h-4" /> Aaj Ke Leads</div>
                    <p className="text-3xl font-bold text-white">
                        {leads.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length}
                    </p>
                </div>
            </div>

            {/* ✅ 30 Days Line Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-slate-100 mb-6">📈 Last 30 Days — Lead Trend</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={getLast30Days()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="day" stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} interval={4} />
                        <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                            labelStyle={{ color: '#94a3b8' }}
                            itemStyle={{ color: '#25D366' }}
                        />
                        <Line type="monotone" dataKey="leads" stroke="#25D366" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#25D366' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* ✅ Pie + Bar Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Score Pie */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-slate-100 mb-6">🥧 Lead Score Breakdown</h2>
                    {scoreData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie data={scoreData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                                    {scoreData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                    itemStyle={{ color: '#94a3b8' }}
                                />
                                <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[240px] flex items-center justify-center text-slate-500">No data yet</div>
                    )}
                </div>

                {/* Property Type Bar */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-slate-100 mb-6">🏠 Property Type Breakdown</h2>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={propertyData()}>
                            <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                itemStyle={{ color: '#25D366' }}
                            />
                            <Bar dataKey="value" fill="#25D366" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ✅ Top Locations + Best Day Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Locations */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-slate-100 mb-6">📍 Top 5 Locations</h2>
                    {topLocations().length > 0 ? (
                        <div className="space-y-3">
                            {topLocations().map((loc, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-slate-500 text-sm w-5">#{i + 1}</span>
                                    <div className="flex-1 bg-slate-800 rounded-full h-8 relative overflow-hidden">
                                        <div
                                            className="absolute left-0 top-0 h-full bg-primary/30 rounded-full transition-all"
                                            style={{ width: `${(loc.value / leads.length) * 100}%` }}
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-200 text-sm font-medium flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-primary" /> {loc.name}
                                        </span>
                                    </div>
                                    <span className="text-primary font-bold text-sm w-6 text-right">{loc.value}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-slate-500 text-sm">No location data yet</div>
                    )}
                </div>

                {/* Best Day Bar */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-slate-100 mb-6">📅 Best Day of Week</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={bestDay()}>
                            <XAxis dataKey="day" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                itemStyle={{ color: '#6366f1' }}
                            />
                            <Bar dataKey="leads" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ✅ Status Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-slate-100 mb-6">🔄 Lead Status Breakdown</h2>
                <div className="flex flex-wrap gap-4">
                    {statusData().map((s, i) => (
                        <div key={i} className="flex items-center gap-3 bg-slate-800 px-5 py-3 rounded-xl border border-slate-700">
                            <div>
                                <p className="text-slate-400 text-xs capitalize">{s.name}</p>
                                <p className="text-white font-bold text-xl">{s.value}</p>
                            </div>
                        </div>
                    ))}
                    {statusData().length === 0 && <p className="text-slate-500 text-sm">No status data yet</p>}
                </div>
            </div>
        </div>
    );
};

export default Analytics;