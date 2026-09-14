import React, { useState } from 'react';
import Icon from '../components/Icon';
import BASE_URL from '../config';

export default function Login({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) { setError('Please enter email and password.'); return; }
        setLoading(true); setError('');
        try {
            const res = await fetch(`${BASE_URL}/owner/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) { onLogin(data.user); }
            else { setError(data.error || 'Login failed.'); }
        } catch (err) {
            setError('Cannot connect to server. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <p className="label-md" style={{ color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Ceylon Compass</p>
                <h2 className="brand-title">Hotel Owner Portal</h2>
                <p className="brand-subtitle">Sign in to manage your listings on the Tourist Guide app.</p>
                <div className="gold-divider" />

                {error && <div className="alert alert-error"><Icon name="error" style={{ width: '18px', height: '18px' }} />{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input className="ledger-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input className="ledger-input" type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn-navy" disabled={loading}>
                        {loading ? 'Signing in...' : <><Icon name="login" style={{ width: '18px', height: '18px' }} /> Sign In</>}
                    </button>
                </form>

                <p className="text-center mt-4" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    Don't have an account?{' '}
                    <a className="link" onClick={onSwitchToRegister}>Register here</a>
                </p>
            </div>
        </div>
    );
}
