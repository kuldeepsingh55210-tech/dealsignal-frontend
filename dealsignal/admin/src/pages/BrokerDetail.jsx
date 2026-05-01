import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBrokerDetails, updateBrokerSubscription } from '../api/admin';

export default function BrokerDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [plan, setPlan] = useState('');
    const [expiresAt, setExpiresAt] = useState('');

    useEffect(() => {
        getBrokerDetails(id)
            .then(res => {
                setData(res.data?.data);
                setPlan(res.data?.data?.broker?.subscription?.plan || 'trial');
                const exp = res.data?.data?.broker?.subscription?.expiresAt;
                if (exp) setExpiresAt(new Date(exp).toISOString().split('T')[0]);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const handleUpdateSubscription = async () => {
        setUpdating(true);
        try {
            await updateBrokerSubscription(id, { plan, expiresAt });
            alert('✅ Subscription updated!');
        } catch {
            alert('❌ Error updating subscription');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-green-400 text-lg">Loading...</div>
        </div>
    );

    const broker = data?.broker;
    const leadStats = data?.leadStats;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/brokers')} className="text-gray-400 hover:text-white">← Back</button>
                <h1 className="text-2xl font-bold text-white">👤 {broker?.name}</h1>
                <span className={`px-2 py-1 rounded text-xs ${broker?.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {broker?.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Broker Info */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
                    <h2 className="text-lg font-semibold text-white mb-4">Broker Info</h2>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Email</span>
                        <span className="text-white">{broker?.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Mobile</span>
                        <span className="text-white">{broker?.mobile}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">City</span>
                        <span className="text-white">{broker?.city || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">WhatsApp</span>
                        <span className={broker?.wa_connected ? 'text-green-400' : 'text-gray-400'}>
                            {broker?.wa_connected ? '✅ Connected' : '❌ Not Connected'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Joined</span>
                        <span className="text-white">{new Date(broker?.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Lead Stats */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Lead Stats</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                            <p className="text-gray-400 text-xs">Total</p>
                            <p className="text-2xl font-bold text-white">{leadStats?.totalLeads || 0}</p>
                        </div>
                        <div className="bg-red-500/10 rounded-lg p-4 text-center">
                            <p className="text-gray-400 text-xs">🔥 Hot</p>
                            <p className="text-2xl font-bold text-red-400">{leadStats?.hotLeads || 0}</p>
                        </div>
                        <div className="bg-yellow-500/10 rounded-lg p-4 text-center">
                            <p className="text-gray-400 text-xs">🌡️ Warm</p>
                            <p className="text-2xl font-bold text-yellow-400">{leadStats?.warmLeads || 0}</p>
                        </div>
                        <div className="bg-blue-500/10 rounded-lg p-4 text-center">
                            <p className="text-gray-400 text-xs">❄️ Cold</p>
                            <p className="text-2xl font-bold text-blue-400">{leadStats?.coldLeads || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Subscription */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:col-span-2">
                    <h2 className="text-lg font-semibold text-white mb-4">Subscription Management</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Current Plan</label>
                            <select
                                value={plan}
                                onChange={(e) => setPlan(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                            >
                                <option value="trial">Trial</option>
                                <option value="starter">Starter</option>
                                <option value="pro">Pro</option>
                                <option value="business">Business</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Expires At</label>
                            <input
                                type="date"
                                value={expiresAt}
                                onChange={(e) => setExpiresAt(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleUpdateSubscription}
                                disabled={updating}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
                            >
                                {updating ? 'Updating...' : 'Update Subscription'}
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-4 text-sm text-gray-400">
                        <span>Leads Used: <strong className="text-white">{broker?.subscription?.leadsUsed || 0}</strong></span>
                        <span>Leads Limit: <strong className="text-white">{broker?.subscription?.leadsLimit || 0}</strong></span>
                    </div>
                </div>
            </div>
        </div>
    );
}