import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Onboarding from './pages/Onboarding';
import SubscriptionExpired from './pages/SubscriptionExpired';
import Analytics from './pages/Analytics';
import ResetPassword from './pages/ResetPassword';

const ProtectedRoute = ({ children }) => {
    const { user, loading, subscriptionExpired } = useAuth();
    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (subscriptionExpired) return <Navigate to="/subscription-expired" />;
    if (!user.onboarding?.completed) return <Navigate to="/onboarding" />;
    return children;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading...</div>;
    if (user) return <Navigate to="/dashboard" />;
    return children;
};

const OnboardingRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (user.onboarding?.completed) return <Navigate to="/dashboard" />;
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />
                <Route path="/subscription-expired" element={<SubscriptionExpired />} />
                {/* ✅ Reset Password Route */}
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="leads" element={<Leads />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

export default App;