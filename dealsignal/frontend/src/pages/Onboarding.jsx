import React, { useState } from 'react';
import { useAuth } from '../hooks';
import api from '../services/api';
import { MapPin, Clock, Home, TrendingUp, Users, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const steps = [
    { id: 1, title: 'Basic Info', subtitle: 'Tell us about yourself' },
    { id: 2, title: 'Your Business', subtitle: 'Help us understand your work' },
    { id: 3, title: 'Pain Points', subtitle: 'What challenges do you face?' },
];

const Onboarding = () => {
    const { user, login } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        city: '',
        experience: '',
        propertyType: '',
        dealType: '',
        monthlyLeads: '',
        leadSource: '',
        painPoint: '',
    });

    const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleNext = () => {
        // Validate current step
        if (currentStep === 1 && (!formData.city || !formData.experience)) {
            setError('Please fill all fields');
            return;
        }
        if (currentStep === 2 && (!formData.propertyType || !formData.dealType || !formData.monthlyLeads)) {
            setError('Please fill all fields');
            return;
        }
        setError(null);
        setCurrentStep(prev => prev + 1);
    };

    const handleSubmit = async () => {
        if (!formData.leadSource || !formData.painPoint) {
            setError('Please fill all fields');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/onboarding', formData);
            login(data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const OptionButton = ({ value, label, field, icon }) => (
        <button
            type="button"
            onClick={() => update(field, value)}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all font-medium text-left w-full ${
                formData[field] === value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
            }`}
        >
            {icon && <span className="text-xl">{icon}</span>}
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-[#0a0f0a] flex flex-col justify-center items-center px-6">
            <div className="w-full max-w-lg">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome, {user?.name?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-slate-400">Help us personalize your experience</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    {steps.map((step, idx) => (
                        <React.Fragment key={step.id}>
                            <div className={`flex items-center gap-2 ${currentStep >= step.id ? 'text-primary' : 'text-slate-600'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                                    currentStep > step.id
                                        ? 'bg-primary border-primary text-slate-900'
                                        : currentStep === step.id
                                        ? 'border-primary text-primary'
                                        : 'border-slate-700 text-slate-600'
                                }`}>
                                    {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
                                </div>
                                <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 max-w-[60px] transition-all ${currentStep > step.id ? 'bg-primary' : 'bg-slate-700'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-1">{steps[currentStep - 1].title}</h2>
                    <p className="text-slate-400 text-sm mb-6">{steps[currentStep - 1].subtitle}</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Step 1 */}
                    {currentStep === 1 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    City/Area kahan kaam karte ho?
                                </label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => update('city', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="e.g. Mumbai, Andheri West"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-3">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    Kitne saal se broker ho?
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: '0-1', label: '0-1 saal', icon: '🌱' },
                                        { value: '1-3', label: '1-3 saal', icon: '📈' },
                                        { value: '3-5', label: '3-5 saal', icon: '💼' },
                                        { value: '5+', label: '5+ saal', icon: '🏆' },
                                    ].map(opt => (
                                        <OptionButton key={opt.value} value={opt.value} label={opt.label} field="experience" icon={opt.icon} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2 */}
                    {currentStep === 2 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-3">
                                    <Home className="w-4 h-4 inline mr-1" />
                                    Property type?
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'residential', label: 'Residential', icon: '🏠' },
                                        { value: 'commercial', label: 'Commercial', icon: '🏢' },
                                        { value: 'both', label: 'Both', icon: '🏗️' },
                                    ].map(opt => (
                                        <OptionButton key={opt.value} value={opt.value} label={opt.label} field="propertyType" icon={opt.icon} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-3">
                                    Deal type?
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'buy', label: 'Buy', icon: '💰' },
                                        { value: 'rent', label: 'Rent', icon: '🔑' },
                                        { value: 'both', label: 'Both', icon: '✨' },
                                    ].map(opt => (
                                        <OptionButton key={opt.value} value={opt.value} label={opt.label} field="dealType" icon={opt.icon} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-3">
                                    <TrendingUp className="w-4 h-4 inline mr-1" />
                                    Monthly kitne leads handle karte ho?
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: '0-10', label: '0-10 leads', icon: '🌱' },
                                        { value: '10-30', label: '10-30 leads', icon: '📊' },
                                        { value: '30-50', label: '30-50 leads', icon: '🚀' },
                                        { value: '50+', label: '50+ leads', icon: '🔥' },
                                    ].map(opt => (
                                        <OptionButton key={opt.value} value={opt.value} label={opt.label} field="monthlyLeads" icon={opt.icon} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3 */}
                    {currentStep === 3 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-3">
                                    <Users className="w-4 h-4 inline mr-1" />
                                    Abhi leads kahan se aate hain?
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'referral', label: 'Referral', icon: '🤝' },
                                        { value: 'justdial', label: 'JustDial', icon: '📞' },
                                        { value: 'magicbricks', label: 'MagicBricks', icon: '🏠' },
                                        { value: '99acres', label: '99acres', icon: '🌐' },
                                        { value: 'social', label: 'Social Media', icon: '📱' },
                                        { value: 'other', label: 'Other', icon: '✨' },
                                    ].map(opt => (
                                        <OptionButton key={opt.value} value={opt.value} label={opt.label} field="leadSource" icon={opt.icon} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-3">
                                    Sabse badi problem kya hai?
                                </label>
                                <div className="space-y-3">
                                    {[
                                        { value: 'lead_quality', label: 'Lead quality kharab hoti hai', icon: '😤' },
                                        { value: 'followup', label: 'Follow up karna mushkil hai', icon: '📋' },
                                        { value: 'time', label: 'Time management problem', icon: '⏰' },
                                        { value: 'conversion', label: 'Lead to deal conversion kam hai', icon: '📉' },
                                    ].map(opt => (
                                        <OptionButton key={opt.value} value={opt.value} label={opt.label} field="painPoint" icon={opt.icon} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 mt-8">
                        {currentStep > 1 && (
                            <button
                                onClick={() => { setCurrentStep(prev => prev - 1); setError(null); }}
                                className="flex items-center gap-2 px-5 py-3 bg-slate-800 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                        )}
                        {currentStep < 3 ? (
                            <button
                                onClick={handleNext}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-slate-900 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                            >
                                Next <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-slate-900 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {loading
                                    ? <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                    : <><CheckCircle className="w-5 h-5" /> Complete Setup</>
                                }
                            </button>
                        )}
                    </div>
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    Ye baad mein Profile page se change kar sakte ho
                </p>
            </div>
        </div>
    );
};

export default Onboarding;