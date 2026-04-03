import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { format } from 'date-fns';
import { Search, MapPin, IndianRupee, Clock, Briefcase, Star, X, Home, Building2, Flame, Snowflake, ThermometerSun } from 'lucide-react';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [mainFilter, setMainFilter] = useState('all'); // all, buy, rent
    const [subFilter, setSubFilter] = useState('all'); // all, plot, flat, ghar, room
    
    // Modal
    const [selectedLead, setSelectedLead] = useState(null);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await api.get('/leads');
                if (res.data.success) {
                    setLeads(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch leads", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    // Handle sub filters changing when main filter changes
    useEffect(() => {
        setSubFilter('all');
    }, [mainFilter]);

    const filteredLeads = leads.filter(l => {
        let match = true;
        const cat = l.qualification?.category || '';
        const propType = (l.qualification?.propertyType || '').toLowerCase();

        if (mainFilter !== 'all' && cat !== mainFilter) match = false;
        
        if (match && subFilter !== 'all') {
            if (subFilter === 'plot' && !propType.includes('plot')) match = false;
            if (subFilter === 'flat' && !propType.includes('flat')) match = false;
            if (subFilter === 'ghar' && !propType.includes('ghar') && !propType.includes('home')) match = false;
            if (subFilter === 'room' && !propType.includes('room') && !propType.includes('single')) match = false;
        }

        return match;
    });

    const getScoreStyles = (score) => {
        switch (score) {
            case 'hot': return 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-red-500/5';
            case 'warm': return 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.15)] bg-orange-500/5';
            case 'cold': return 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)] bg-blue-500/5';
            default: return 'border-slate-800 bg-slate-900';
        }
    };

    const getScoreBadge = (score) => {
        switch (score) {
            case 'hot': return <span className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1"><Flame className="w-3 h-3"/> HOT</span>;
            case 'warm': return <span className="bg-orange-500/20 text-orange-400 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1"><ThermometerSun className="w-3 h-3"/> WARM</span>;
            case 'cold': return <span className="bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1"><Snowflake className="w-3 h-3"/> COLD</span>;
            default: return null;
        }
    };

    if (loading) return <div className="text-slate-400 flex justify-center p-12">Loading leads pipeline...</div>;

    return (
        <div className="flex flex-col h-full space-y-6 fade-in">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">Leads Pipeline</h1>
                    <p className="text-slate-400 mt-2">Manage and qualify your property inquiries.</p>
                </div>
                
                {/* Main Filter Tabs */}
                <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                    <button onClick={() => setMainFilter('all')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${mainFilter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>All</button>
                    <button onClick={() => setMainFilter('buy')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mainFilter === 'buy' ? 'bg-primary text-[#0a0f0a]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
                        <Home className="w-4 h-4" /> Buy
                    </button>
                    <button onClick={() => setMainFilter('rent')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mainFilter === 'rent' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
                        <Building2 className="w-4 h-4" /> Rent
                    </button>
                </div>
            </header>

            {/* Sub Filters */}
            {mainFilter !== 'all' && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    <button onClick={() => setSubFilter('all')} className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${subFilter === 'all' ? 'border-primary text-primary bg-primary/10' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}>All {mainFilter}</button>
                    
                    {mainFilter === 'buy' && (
                        <>
                            <button onClick={() => setSubFilter('plot')} className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${subFilter === 'plot' ? 'border-primary text-primary bg-primary/10' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}>🌳 Plot</button>
                            <button onClick={() => setSubFilter('flat')} className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${subFilter === 'flat' ? 'border-primary text-primary bg-primary/10' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}>🏢 Flat</button>
                            <button onClick={() => setSubFilter('ghar')} className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${subFilter === 'ghar' ? 'border-primary text-primary bg-primary/10' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}>🏡 Ghar</button>
                        </>
                    )}
                    {mainFilter === 'rent' && (
                        <>
                            <button onClick={() => setSubFilter('room')} className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${subFilter === 'room' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}>🚪 Room</button>
                            <button onClick={() => setSubFilter('flat')} className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${subFilter === 'flat' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}>🏢 Flat</button>
                            <button onClick={() => setSubFilter('ghar')} className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${subFilter === 'ghar' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}>🏡 Ghar</button>
                        </>
                    )}
                </div>
            )}

            {/* Leads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredLeads.map(lead => (
                    <div 
                        key={lead._id} 
                        onClick={() => setSelectedLead(lead)}
                        className={`border rounded-2xl p-5 cursor-pointer hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group ${getScoreStyles(lead.qualification?.leadScore)}`}
                    >
                        {/* Status Ribbon */}
                        <div className="absolute top-0 right-0 p-3">
                           {getScoreBadge(lead.qualification?.leadScore)}
                        </div>

                        <div className="mb-4 pr-16">
                            <h3 className="text-lg font-bold text-slate-100 group-hover:text-primary transition-colors">{lead.name}</h3>
                            <p className="text-slate-400 font-mono text-sm">{lead.phone}</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${lead.qualification?.category === 'buy' ? 'bg-primary/20 text-primary' : lead.qualification?.category === 'rent' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                                    {lead.qualification?.category || 'uncategorized'}
                                </span>
                                <span className="text-slate-300 font-medium capitalize text-sm border-l border-slate-700 pl-3">
                                    {lead.qualification?.propertyType || 'Type unknown'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/50">
                                <div className="flex items-start gap-2 text-sm text-slate-400">
                                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                                    <span className="truncate" title={lead.qualification?.location}>{lead.qualification?.location || '-'}</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-slate-400">
                                    <IndianRupee className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                                    <span className="font-mono truncate" title={lead.qualification?.budget}>{lead.qualification?.budget || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {filteredLeads.length === 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                    <Search className="w-12 h-12 text-slate-600 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-300">No leads found</h3>
                    <p className="text-slate-500 mt-2">Try changing your filters or check back later.</p>
                </div>
            )}

            {/* Lead Detail Modal */}
            {selectedLead && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
                    <div className="bg-[#0a0f0a] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800 flex justify-between items-start sticky top-0 bg-[#0a0f0a]/95 backdrop-blur-md z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-100">{selectedLead.name}</h2>
                                <p className="text-primary font-mono mt-1">{selectedLead.phone}</p>
                            </div>
                            <div className="flex items-center gap-3 relative mr-8">
                                {getScoreBadge(selectedLead.qualification?.leadScore)}
                                <button onClick={() => setSelectedLead(null)} className="absolute -right-8 -top-2 p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-8">
                            {/* Requirement Summary */}
                            <div className={`p-5 rounded-xl border ${selectedLead.qualification?.category === 'buy' ? 'bg-primary/5 border-primary/20' : 'bg-indigo-500/5 border-indigo-500/20'}`}>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    {selectedLead.qualification?.category === 'buy' ? <Home className="w-4 h-4"/> : <Building2 className="w-4 h-4"/>} 
                                    Core Requirement
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Intent</p>
                                        <p className="font-bold text-slate-200 capitalize">{selectedLead.qualification?.category || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Property Info</p>
                                        <p className="font-semibold text-slate-200 capitalize">{selectedLead.qualification?.propertyType || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Size/SqFt</p>
                                        <p className="font-semibold text-slate-200">{selectedLead.qualification?.squareFoot || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Status</p>
                                        <p className="font-semibold text-blue-400 uppercase">{selectedLead.status}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Answers */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Full Details</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-start">
                                        <MapPin className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-slate-500">Target Location</p>
                                            <p className="text-slate-200 font-medium">{selectedLead.qualification?.location || 'Not specified'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <IndianRupee className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-slate-500">Budget</p>
                                            <p className="text-slate-200 font-medium">{selectedLead.qualification?.budget || 'Not specified'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <Clock className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-slate-500">Timeline</p>
                                            <p className="text-slate-200 font-medium">{selectedLead.qualification?.timeline || 'Not specified'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <Star className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-slate-500">Preferences</p>
                                            <p className="text-slate-200 font-medium">{selectedLead.qualification?.preference || 'None'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <Briefcase className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-slate-500">Occupation</p>
                                            <p className="text-slate-200 font-medium">{selectedLead.qualification?.occupation || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-slate-600 border-t border-slate-800 pt-4 flex flex-col md:flex-row gap-2 justify-between">
                                <span>Created: {format(new Date(selectedLead.createdAt), 'PPP p')}</span>
                                <span>Last interaction: {format(new Date(selectedLead.lastInteraction), 'PPP p')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leads;
