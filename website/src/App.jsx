import React, { useState, useEffect } from 'react';
import Icon from './components/Icon';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

const ADMIN_PASSWORD = 'admin123';

function AdminLogin({ onAdminLogin, onBack }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) { onAdminLogin(); }
        else { setError('Incorrect admin password.'); }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <p className="label-md" style={{ color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Ceylon Compass</p>
                <h2 className="brand-title">Admin Access</h2>
                <p className="brand-subtitle">Enter the admin password to manage owner approvals and hotel listings.</p>
                <div className="gold-divider" />

                {error && (
                    <div className="alert alert-error">
                        <Icon name="lock" style={{ width: '18px', height: '18px' }} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Admin Password</label>
                        <input className="ledger-input" type="password" placeholder="Enter admin password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn-navy">
                        <Icon name="shield" style={{ width: '18px', height: '18px' }} />
                        Access Admin Panel
                    </button>
                </form>

                <p className="text-center mt-4" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    <a className="link" onClick={onBack}>← Back to Owner Login</a>
                </p>
            </div>
        </div>
    );
}

export default function App() {
    const [page, setPage] = useState('login');
    const [user, setUser] = useState(null);

    const handleLogin = (userData) => { setUser(userData); setPage('owner-dash'); };
    const handleAdminLogin = () => { setPage('admin-dash'); };
    const handleLogout = () => { setUser(null); setPage('login'); };

    useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash === '#admin') {
                setPage('admin-login');
            } else if (page === 'admin-login') {
                setPage('login');
            }
        };
        
        // Check on initial load
        handleHashChange();

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [page]);

    // Minimal top nav for auth screens
    const AuthNav = () => (
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '56px', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', zIndex: 100 }}>
            <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: '16px', fontWeight: 700, color: 'white' }}>
                Ceylon Compass — Hotel Portal
            </span>
            {/* The Admin button has been intentionally removed for security/professionalism. 
                Access is now restricted to the /#admin URL hash. */}
        </nav>
    );

    if (page === 'owner-dash' && user) {
        return <OwnerDashboard user={user} onLogout={handleLogout} />;
    }

    if (page === 'admin-dash') {
        return <AdminDashboard onLogout={handleLogout} />;
    }

    return (
        <>
            <AuthNav />
            <div style={{ paddingTop: '56px' }}>
                {page === 'login' && <Login onLogin={handleLogin} onSwitchToRegister={() => setPage('register')} />}
                {page === 'register' && <Register onSwitchToLogin={() => setPage('login')} />}
                {page === 'admin-login' && <AdminLogin onAdminLogin={handleAdminLogin} onBack={() => setPage('login')} />}
            </div>
        </>
    );
}
