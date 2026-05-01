import { useState, useEffect } from 'react';
import { getAllLeads } from '../api/admin';

export default function Leads() {
    const [leads, setLeads] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [score, setScore] = useState('');

    useEffect(() => {
        setLoading(true);
        getAllLeads({ page, score: score || undefined })
            .then(res => {
                setLeads(res.data?.data?.leads || []);
                setTotal(res.data?.data?.total || 0);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [page, score]);

    const scoreColors = {
        hot: 'bg-red-500/20 text-red-400',
        warm: 'bg-yellow-500/20 text-yellow-400',
        cold: 'bg-blue-500/20 text-blue-400'
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">🎯 Leads ({total})</h1>
                <select
                    value={score}
                    onChange={(e) => { setScore(e.target.value); setPage(1); }}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                >
                    <option value="">All Leads</option>
                    <option value="hot">🔥 Hot</option>
                    <option value="warm">🌡️ Warm</option>
                    <option value="cold">❄️ Cold</option>
                </select>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-800">
                            <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Lead</th>
                            <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Category</th>
                            <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Location</th>
                            <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Budget</th>
                            <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Score</th>
                            <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-12 text-green-400">Loading...</td>
                            </tr>
                        ) : leads.map(lead => (
                            <tr key={lead._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-all">
                                <td className="px-6 py-4">
                                    <p className="text-white font-medium">{lead.name}</p>
                                    <p className="text-gray-400 text-sm">{lead.phone}</p>
                                </td>
                                <td className="px-6 py-4 text-gray-300 capitalize">
                                    {lead.qualification?.category || 'N/A'} - {lead.qualification?.propertyType || ''}
                                </td>
                                <td className="px-6 py-4 text-gray-300">{lead.qualification?.location || 'N/A'}</td>
                                <td className="px-6 py-4 text-gray-300">{lead.qualification?.budget || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs ${scoreColors[lead.qualification?.leadScore] || 'bg-gray-500/20 text-gray-400'}`}>
                                        {lead.qualification?.leadScore || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!loading && leads.length === 0 && (
                    <div className="text-center py-12 text-gray-400">No leads found</div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">Page {page} of {Math.ceil(total / 20)}</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-gray-700"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= Math.ceil(total / 20)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-gray-700"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}