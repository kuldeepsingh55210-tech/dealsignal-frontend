import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBrokers, updateBrokerStatus } from '../api/admin';

export default function Brokers() {
    const [brokers, setBrokers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getAllBrokers()
            .then(res => setBrokers(res.data?.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await updateBrokerStatus(id, !currentStatus);
            setBrokers(brokers.map(b => b._id === id ? { ...b, isActive: !currentStatus } : b));
        } catch (err) {
            alert('Error updating status');
        }
    };

    const planColors = {
        trial: 'bg-gray-500',
        starter: 'bg-blue-500',
        pro: 'bg-purple-500',
        business: 'bg-green-500'
    };

    const filtered = brokers.filter(b =>
        b.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.email?.toLowerCase().includes(search.toLowerCase()) ||
        b.mobile?.includes(search)
    );

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-green-400 text-lg">Loading...</div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">👥 Brokers ({brokers.length})</h1>
                <input
                    type="text"
                    placeholder="Search brokers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500 w-64"
                />
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-800">
                            <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Broker</th>
                            <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Mobile</th>
                            <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Plan</th>
                            <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">WhatsApp</th>
                            <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Status</th>
                            <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(broker => (
                            <tr key={broker._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-all">
                                <td className="px-6 py-4">
                                    <p className="text-white font-medium">{broker.name}</p>
                                    <p className="text-gray-400 text-sm">{broker.email}</p>
                                </td>
                                <td className="px-6 py-4 text-gray-300">{broker.mobile}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs text-white ${planColors[broker.subscription?.plan] || 'bg-gray-500'}`}>
                                        {broker.subscription?.plan}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs ${broker.wa_connected ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                        {broker.wa_connected ? '✅ Connected' : '❌ Not Connected'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs ${broker.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {broker.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/brokers/${broker._id}`)}
                                            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition-all"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus(broker._id, broker.isActive)}
                                            className={`px-3 py-1 rounded text-xs transition-all ${broker.isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                                        >
                                            {broker.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        No brokers found
                    </div>
                )}
            </div>
        </div>
    );
}