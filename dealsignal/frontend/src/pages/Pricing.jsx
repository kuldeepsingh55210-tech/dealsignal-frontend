import React, { useState } from 'react';
import { useAuth } from '../hooks';
import api from '../services/api';
import { Crown, Check, Zap, Building2, ArrowRight } from 'lucide-react';

const Pricing = () => {
    const { user, login } = useAuth();
    const [billing, setBilling] = useState('monthly');
    const [loading, setLoading] = useState('');

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            icon: <Zap className="w-6 h-6" />,
            monthlyPrice: 2999,
            yearlyPrice: 26990,
            leadsLimit: '1,200 leads/month',
            color: 'border-slate-700',
            btnClass: 'bg-slate-700 hover:bg-slate-600 text-white',
            features: [
                'WhatsApp Bot Active',
                '1,200 Leads/month',
                'HOT/WARM/COLD Scoring',
                'Full Dashboard',
                'Lead Export Excel/PDF',
                'Follow-up Reminders',
                'Email Support'
            ]
        },
        {
            id: 'pro',
            name: 'Pro',
            icon: <Crown className="w-6 h-6" />,
            monthlyPrice: 4999,
            yearlyPrice: 44990,
            leadsLimit: '3,000 leads/month',
            popular: true,
            color: 'border-primary',
            btnClass: 'bg-primary hover:bg-primary/90 text-slate-900',
            features: [
                'WhatsApp Bot Active',
                '3,000 Leads/month',
                'HOT/WARM/COLD Scoring',
                'Full Dashboard',
                'Lead Export Excel/PDF',
                'Follow-up Reminders',
                'Analytics Dashboard',
                'WhatsApp Notifications',
                'Priority Support'
            ]
        },
        {
            id: 'business',
            name: 'Business',
            icon: <Building2 className="w-6 h-6" />,
            monthlyPrice: 9999,
            yearlyPrice: 89990,
            leadsLimit: 'Unlimited leads',
            color: 'border-indigo-500',
            btnClass: 'bg-indigo-500 hover:bg-indigo-600 text-white',
            features: [
                'WhatsApp Bot Active',
                'Unlimited Leads',
                'HOT/WARM/COLD Scoring',
                'Full Dashboard',
                'Lead Export Excel/PDF',
                'Follow-up Reminders',
                'Analytics Dashboard',
                'WhatsApp Notifications',
                '3 Team Members',
                'Dedicated Support'
            ]
        }
    ];

    const handlePayment = async (planId) => {
        const billingKey = `${planId}_${billing}`;
        setLoading(billingKey);

        try {
            // ✅ Create order
            const { data } = await api.post('/payments/create-order', {
                planId: billingKey
            });

            const { orderId, amount, currency, keyId } = data.data;

            // ✅ Razorpay checkout open karo
            const options = {
                key: keyId,
                amount: amount,
                currency: currency,
                name: 'DealSignal',
                description: `${planId.toUpperCase()} Plan - ${billing === 'monthly' ? 'Monthly' : 'Yearly'}`,
                order_id: orderId,
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.mobile
                },
                theme: {
                    color: '#25D366'
                },
                handler: async (response) => {
                    try {
                        const verifyRes = await api.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId: billingKey
                        });

                        if (verifyRes.data.success) {
                            login(verifyRes.data.data);
                            alert('🎉 Payment Successful! Plan activated ho gaya!');
                        }
                    } catch (err) {
                        alert('Payment verification failed. Support se contact karo.');
                    }
                },
                modal: {
                    ondismiss: () => {
                        setLoading('');
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            alert(err.response?.data?.message || 'Payment initiate karne mein error aaya');
        } finally {
            setLoading('');
        }
    };

    const currentPlan = user?.subscription?.plan || 'trial';

    return (
        <div className="space-y-8 fade-in">
            {/* Header */}
            <header className="text-center">
                <h1 className="text-3xl font-bold text-slate-100">Choose Your Plan</h1>
                <p className="text-slate-400 mt-2">Apne business ke liye best plan chunein</p>
            </header>

            {/* Current Plan */}
            {currentPlan !== 'trial' && (
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
                    <p className="text-primary font-bold">
                        ✅ Current Plan: {currentPlan.toUpperCase()} — Expires: {new Date(user?.subscription?.expiresAt).toLocaleDateString('en-IN')}
                    </p>
                </div>
            )}

            {currentPlan === 'trial' && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-center">
                    <p className="text-orange-400 font-bold">
                        ⏳ Trial Plan — Upgrade karo unlimited access ke liye!
                    </p>
                </div>
            )}

            {/* Billing Toggle */}
            <div className="flex justify-center">
                <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setBilling('monthly')}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all ${billing === 'monthly' ? 'bg-primary text-slate-900' : 'text-slate-400 hover:text-white'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBilling('yearly')}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${billing === 'yearly' ? 'bg-primary text-slate-900' : 'text-slate-400 hover:text-white'}`}
                    >
                        Yearly
                        <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">25% OFF</span>
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div
                        key={plan.id}
                        className={`bg-slate-900 border-2 rounded-2xl p-6 relative transition-all ${plan.color} ${plan.popular ? 'shadow-[0_0_30px_rgba(37,211,102,0.15)]' : ''}`}
                    >
                        {/* Popular Badge */}
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-slate-900 text-xs font-bold px-4 py-1 rounded-full">
                                MOST POPULAR
                            </div>
                        )}

                        {/* Plan Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-xl ${plan.popular ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-300'}`}>
                                {plan.icon}
                            </div>
                            <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                        </div>

                        {/* Price */}
                        <div className="mb-2">
                            <span className="text-4xl font-bold text-white">
                                ₹{billing === 'monthly' ? plan.monthlyPrice.toLocaleString('en-IN') : plan.yearlyPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-slate-400 text-sm">
                                /{billing === 'monthly' ? 'month' : 'year'}
                            </span>
                        </div>

                        {billing === 'yearly' && (
                            <p className="text-primary text-sm mb-2 font-medium">
                                ₹{Math.round(plan.yearlyPrice / 12).toLocaleString('en-IN')}/month equivalent
                            </p>
                        )}

                        <p className="text-slate-400 text-sm mb-6">{plan.leadsLimit}</p>

                        {/* Features */}
                        <ul className="space-y-3 mb-8">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {/* Button */}
                        <button
                            onClick={() => handlePayment(plan.id)}
                            disabled={loading === `${plan.id}_${billing}` || currentPlan === plan.id}
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${plan.btnClass}`}
                        >
                            {loading === `${plan.id}_${billing}` ? (
                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : currentPlan === plan.id ? (
                                '✅ Current Plan'
                            ) : (
                                <>Get Started <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Trial Info */}
            <div className="text-center text-slate-500 text-sm">
                <p>🔒 Secure payment by Razorpay • GST extra as applicable</p>
            </div>
        </div>
    );
};

export default Pricing;