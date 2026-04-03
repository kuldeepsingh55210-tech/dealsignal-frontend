import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { Send, Phone, Check, CheckCheck, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

const Chat = () => {
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingLeads, setLoadingLeads] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const messagesEndRef = useRef(null);

    // Fetch Leads
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
                setLoadingLeads(false);
            }
        };
        fetchLeads();
    }, []);

    // Fetch Messages when a lead is selected
    useEffect(() => {
        if (!selectedLead) return;

        const fetchMessages = async () => {
            setLoadingMessages(true);
            try {
                const res = await api.get(`/messages/${selectedLead._id}`);
                if (res.data.success) {
                    setMessages(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setLoadingMessages(false);
            }
        };
        fetchMessages();
    }, [selectedLead]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedLead) return;

        const optimisticMessage = {
            _id: Date.now().toString(),
            direction: 'outbound',
            content: newMessage,
            createdAt: new Date().toISOString(),
            status: 'sent'
        };

        setMessages(prev => [...prev, optimisticMessage]);
        setNewMessage('');

        try {
            const res = await api.post('/whatsapp/send', {
                to: selectedLead.phone,
                message: optimisticMessage.content
            });
            if (!res.data.success) {
                alert("Failed to send message.");
            } else {
                 setMessages(prev => prev.map(m => m._id === optimisticMessage._id ? {...m, status: 'delivered'} : m));
            }
        } catch (error) {
            console.error("Failed to send message", error);
            alert("Error sending message.");
        }
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] glass-card rounded-3xl overflow-hidden shadow-2xl relative z-10 mx-[-1rem] sm:mx-0">
            {/* Left Panel: Leads */}
            <div className="w-1/3 min-w-[320px] max-w-[400px] border-r border-slate-700/50 bg-[#0f1a0f]/60 flex flex-col backdrop-blur-md">
                <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wider">Messages</h2>
                    <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#25D366] animate-pulse"></span>
                </div>

                <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                    {loadingLeads ? (
                        <div className="flex justify-center p-8">
                            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-800/50">
                            {leads.map((lead, idx) => (
                                <li
                                    key={lead._id}
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                    onClick={() => setSelectedLead(lead)}
                                    className={`p-5 cursor-pointer transition-all duration-300 animate-fade-in-up hover:bg-slate-800/50 group ${selectedLead?._id === lead._id ? 'bg-[#152515] border-l-[3px] border-primary' : 'border-l-[3px] border-transparent'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`font-bold text-[15px] group-hover:text-primary transition-colors ${selectedLead?._id === lead._id ? 'text-primary' : 'text-slate-200'}`}>{lead.name}</h3>
                                        {lead.status === 'HOT' && <span className="text-[9px] uppercase font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded shadow-[0_0_8px_rgba(239,68,68,0.2)]">Hot</span>}
                                        {lead.status === 'new' && <span className="text-[9px] uppercase font-bold text-primary bg-primary/10 px-2 py-1 rounded">New</span>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                                        <p className="text-xs text-slate-400 font-mono tracking-wide">{lead.phone}</p>
                                    </div>
                                </li>
                            ))}
                            {leads.length === 0 && <li className="p-8 text-center text-slate-500 font-medium">No leads pipeline.</li>}
                        </ul>
                    )}
                </div>
            </div>

            {/* Right Panel: Chat */}
            <div className="flex-1 bg-[#060c06] flex flex-col relative w-full overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] z-0" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83-5.59 5.591-5.59-5.59 5.59-5.59 4.76 4.759zm-4.76 59.17l-5.59-5.59 5.59-5.59 5.59 5.59-5.59 5.59zm-38.106 0l-5.59-5.59 5.59-5.59 5.59 5.59-5.59 5.59zm0-38.106l-5.59-5.59 5.59-5.59 5.59 5.59-5.59 5.59zm19.053 19.053l-5.59-5.59 5.59-5.59 5.59 5.59-5.59 5.59z\' fill=\'%2325D366\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'}}></div>

                {selectedLead ? (
                    <div className="relative z-10 flex flex-col h-full w-full">
                        {/* Chat Header */}
                        <div className="px-6 py-4 bg-[#0a0f0a]/90 backdrop-blur-md flex items-center gap-4 border-b border-primary/20 shadow-md">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shadow-[0_0_10px_rgba(37,211,102,0.2)]">
                                    {selectedLead.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary border-2 border-[#0a0f0a] rounded-full shadow-[0_0_8px_#25D366]"></span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-100">{selectedLead.name}</h2>
                                <p className="text-sm text-primary font-medium flex items-center gap-2">
                                    <span>{selectedLead.phone}</span>
                                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                    <span className="text-slate-400 capitalize">{selectedLead.qualification?.category || 'uncategorized'}</span>
                                </p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 w-full flex flex-col custom-scrollbar pb-8">
                            {loadingMessages ? (
                                <div className="text-slate-400 text-center py-10 flex flex-col items-center gap-3">
                                   <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                   Loading history...
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isInbound = msg.direction === 'inbound';
                                    const showTriangle = idx === 0 || messages[idx-1].direction !== msg.direction;

                                    return (
                                        <div
                                            key={msg._id || idx}
                                            className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-md animate-message relative ${
                                                isInbound
                                                    ? 'bg-[#152315] border border-slate-700/50 text-slate-200 self-start'
                                                    : 'bg-[#1e462c] border border-primary/30 text-[#e8fbe8] self-end'
                                                } ${showTriangle && isInbound ? 'rounded-tl-sm' : ''} ${showTriangle && !isInbound ? 'rounded-tr-sm' : ''}`}
                                        >
                                            <p className="leading-relaxed whitespace-pre-wrap text-[15px]">{msg.content}</p>
                                            <div className={`text-[10px] mt-2 flex items-center gap-1.5 justify-end font-semibold ${isInbound ? 'text-slate-400' : 'text-[#87df9b]'}`}>
                                                {format(new Date(msg.createdAt), 'h:mm a')}
                                                {!isInbound && (
                                                    msg.status === 'delivered' || msg.status === 'read' ? 
                                                    <CheckCheck className={`w-3.5 h-3.5 ${msg.status === 'read' ? 'text-[#34b7f1]' : ''}`} /> : 
                                                    <Check className="w-3.5 h-3.5" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-5 bg-[#0a0f0a]/90 backdrop-blur-md border-t border-slate-800">
                            <form onSubmit={handleSendMessage} className="flex gap-4 max-w-5xl mx-auto w-full items-end">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full bg-[#060c06] border border-slate-700 text-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner placeholder-slate-600 font-medium text-[15px]"
                                    />
                                    {newMessage && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-semibold text-xs animate-fade-in flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                                            typing
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-primary hover:bg-[#1faa53] text-[#060c06] p-4 rounded-2xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(37,211,102,0.4)]"
                                >
                                    <Send className="w-6 h-6 ml-1" />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-slate-500 space-y-6 w-full animate-fade-in">
                        <div className="w-24 h-24 rounded-full bg-[#152315] border border-slate-700/50 flex items-center justify-center shadow-[0_0_30px_rgba(37,211,102,0.05)]">
                            <MessageSquare className="w-10 h-10 text-primary opacity-80" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-slate-200 mb-2">DealSignal Secure Chat</h2>
                            <p className="text-[15px] max-w-sm text-slate-400">Select a lead to start end-to-end encrypted messaging via WhatsApp Business API.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
