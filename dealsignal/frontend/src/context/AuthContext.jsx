import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subscriptionExpired, setSubscriptionExpired] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await api.get('/auth/me');
                if (res.data.success) {
                    setUser(res.data.data);
                }
            } catch (error) {
                console.log('User not authenticated');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();

        // 401 - Logout
        const handleUnauthorized = () => {
            setUser(null);
            setSubscriptionExpired(false);
        };

        // ✅ 403 - Subscription expired
        const handleSubscriptionExpired = () => {
            setSubscriptionExpired(true);
        };

        window.addEventListener('unauthorized', handleUnauthorized);
        window.addEventListener('subscription_expired', handleSubscriptionExpired);

        return () => {
            window.removeEventListener('unauthorized', handleUnauthorized);
            window.removeEventListener('subscription_expired', handleSubscriptionExpired);
        };
    }, []);

    const login = (userData) => {
        setUser(userData);
        setSubscriptionExpired(false);
    };

    const logout = async () => {
        try {
            await api.get('/auth/logout');
            setUser(null);
            setSubscriptionExpired(false);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, subscriptionExpired }}>
            {children}
        </AuthContext.Provider>
    );
};