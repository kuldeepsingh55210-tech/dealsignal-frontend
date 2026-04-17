import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks';
import api from '../services/api';
import {
    Users, Flame, ThermometerSun, Snowflake, Home, Building2,
    MapPin, IndianRupee, Download, FileSpreadsheet, FileText
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#25D366', '#6366f1'];

const Dashboard = () => {
    const { user } = useAuth();
    const [allLeads, setAllLeads] = useState([]);
    const [category, setCategory] = useState('buy');
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

    // ✅ Last 7 days chart data
    const getLast7DaysData = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const label = date.toLocaleDateString('en-IN', { weekday: 'short' });
            const count = filteredLeads.filter(l => {
                const created = new Date(l.createdAt);
                return created.toDateString() === date.toDateString();
            }).length;
            days.push({ day: label, leads: count });
        }
        return days;
    };

    // ✅ Pie chart data
    const pieData = [
        { name: 'HOT', value: stats.hot },
        { name: 'WARM', value: stats.warm },
        { name: 'COLD', value: stats.cold },
    ].filter(d => d.value > 0);

    // ✅ Property type breakdown
    const propertyBreakdown = () => {
        const types = {};
        filteredLeads.forEach(l => {
            const t = l.qualification?.propertyType || 'unknown';
            types[t] = (types[t] || 0) + 1;
        });
        return Object.entries(types).map(([name, value]) => ({ name, value }));
    };

    // ✅ Export Excel
    const exportExcel = () => {
        const data = filteredLeads.map(l => ({
            Name: l.name,
            Phone: l.phone,
            Category: l.qualification?.category || '-',
            'Property Type': l.qualification?.propertyType || '-',
            Location: l.qualification?.location || '-',
            Budget: l.qualification?.budget || '-',
            Timeline: l.qualification?.timeline || '-',
            Occupation: l.qualification?.occupation || '-',
            Score: l.qualification?.leadScore || '-',
            Status: l.status || '-',
            Notes: l.notes || '-',
            'Created At': new Date(l.createdAt).toLocaleDateString('en-IN'),
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Leads');
        XLSX.writeFile(wb, `DealSignal_${category}_leads.xlsx`);
    };

    // ✅ Export PDF
    const exportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`DealSignal - ${category.toUpperCase()} Leads Report`, 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 22);

        autoTable(doc, {
            startY: 28,
            head: [['Name', 'Phone', 'Property', 'Location', 'Budget', 'Score', 'Status']],
            body: filteredLeads.map(l => [
                l.name,
                l.phone,
                l.qualification?.propertyType || '-',
                l.qualification?.location || '-',
                l.qualification?.budget || '-',
                (l.qualification?.leadScore || '-').toUpperCase(),
                l.status || '-',
            ]),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [37, 211, 102], textColor: [0, 0, 0] },
        });

        doc.save(`DealSignal_${category}_leads.pdf`);
    };

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
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">Overview</h1>
                    <p className="text-slate-400 mt-2">Welcome back, <span className="text-primary">{user?.name || 'Broker'}</span>.</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Export Buttons */}
                    <button
                        onClick={exportExcel}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 rounded-xl text-sm font-medium hover:bg-emerald-600/30 transition-colors"
                    >
                        <FileSpreadsheet className="w-4 h-4" /> Excel
                    </button>
                    <button
                        onClick={exportPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-xl text-sm font-medium hover:bg-red-600/30 transition-colors"
                    >
                        <FileText className="w-4 h-4" /> PDF
                    </button>

                    {/* Category Toggle */}
                    <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                        <button
                            onClick={() => setCategory('buy')}
                            className={`px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all ${category === 'buy' ? 'bg-primary text-[#0a0f0a] shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                        >
                            <Home className="w-4 h-4" /> Buy
                        </button>
                        <button
                            onClick={() => setCategory('rent')}
                            className={`px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all ${category === 'rent' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                        >
                            <Building2 className="w-4 h-4" /> Rent
                        </button>
                    </div>
                </div>
            </header>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={`${category === 'buy' ? 'Buy' : 'Rent'} Leads`} value={stats.total} icon={Users} color={category === 'buy' ? "bg-primary/10 text-primary" : "bg-indigo-500/10 text-indigo-500"} />
                <StatCard title="HOT Leads" value={stats.hot} icon={Flame} color="bg-red-500/10 text-red-500" />
                <StatCard title="WARM Leads" value={stats.warm} icon={ThermometerSun} color="bg-orange-500/10 text-orange-500" />
                <StatCard title="COLD Leads" value={stats.cold} icon={Snowflake} color="bg-blue-500/10 text-blue-500" />
            </div>

            {/* ✅ Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart - Last 7 Days */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-slate-100 mb-6">Last 7 Days — Lead Activity</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={getLast7DaysData()}>
                            <XAxis dataKey="day" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                labelStyle={{ color: '#94a3b8' }}
                                itemStyle={{ color: '#25D366' }}
                            />
                            <Bar dataKey="leads" fill={category === 'buy' ? '#25D366' : '#6366f1'} radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart - Lead Score */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-slate-100 mb-6">Lead Score Breakdown</h2>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                                    {pieData.map((entry, index) => (
                                        <Cell key={index} fill={['#ef4444', '#f97316', '#3b82f6'][index]} />
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
                        <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">No data yet</div>
                    )}
                </div>
            </div>

            {/* ✅ Property Type Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-slate-100 mb-6">Property Type Breakdown</h2>
                <div className="flex flex-wrap gap-4">
                    {propertyBreakdown().length > 0 ? propertyBreakdown().map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-slate-800 px-5 py-3 rounded-xl border border-slate-700">
                            <span className="text-xl">{getPropertyIcon(item.name)}</span>
                            <div>
                                <p className="text-slate-400 text-xs capitalize">{item.name}</p>
                                <p className="text-white font-bold text-lg">{item.value}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-slate-500 text-sm">No property data yet</p>
                    )}
                </div>
            </div>

            {/* Recent Leads Table */}
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