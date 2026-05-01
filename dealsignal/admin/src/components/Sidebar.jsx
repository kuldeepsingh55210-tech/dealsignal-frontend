import { NavLink, useNavigate } from 'react-router-dom';
import { adminLogout } from '../api/admin';

const navItems = [
    { path: '/', label: '📊 Dashboard' },
    { path: '/brokers', label: '👥 Brokers' },
    { path: '/leads', label: '🎯 Leads' },
];

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await adminLogout();
        } catch {}
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <div className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold text-green-400">⚡ DealSignal</h1>
                <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                isActive
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-left"
                >
                    🚪 Logout
                </button>
            </div>
        </div>
    );
}