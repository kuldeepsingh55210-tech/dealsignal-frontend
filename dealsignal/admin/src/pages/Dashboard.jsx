import { useState, useEffect } from 'react';
import { getStats } from '../api/admin';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStats()
            .then(res => setStats(res.data?.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-green-400 text-lg">Loading...</div>
        </div>
    );

    const planColors = {
        trial: 'bg-gray-500',
        starter: 'bg-blue-500',
        pro: 'bg-purple-500',
        business: 'bg-green-500'
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">📊 Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <p className="text-gray-400 text-sm">Total Brokers</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats?.totalBrokers || 0}</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <p className="text-gray-400 text-sm">Active Brokers</p>
                    <p className="text-3xl font-bold text-green-400 mt-1">{stats?.activeBrokers || 0}</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <p className="text-gray-400 text-sm">Total Leads</p>
                    <p className="text-3xl font-bold text-blue-400 mt-1">{stats?.totalLeads || 0}</p>
                </div>
            </div>

            {/* Plan Stats */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Plan Distribution</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {stats?.planStats?.map(plan => (
                        <div key={plan._id} className="bg-gray-800 rounded-lg p-4 text-center">
                            <span className={`inline-block px-2 py-1 rounded text-xs text-white ${planColors[plan._id] || 'bg-gray-500'}`}>
                                {plan._id}
                            </span>
                            <p className="text-2xl font-bold text-white mt-2">{plan.count}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Brokers */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Recent Brokers</h2>
                <div className="space-y-3">
                    {stats?.recentBrokers?.map(broker => (
                        <div key={broker._id} className="flex items-center justify-between py-2 border-b border-gray-800">
                            <div>
                                <p className="text-white font-medium">{broker.name}</p>
                                <p className="text-gray-400 text-sm">{broker.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded text-xs text-white ${planColors[broker.subscription?.plan] || 'bg-gray-500'}`}>
                                    {broker.subscription?.plan}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${broker.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {broker.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}