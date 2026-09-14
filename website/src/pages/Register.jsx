import React, { useState } from 'react';
import Icon from '../components/Icon';
import BASE_URL from '../config';

export default function Register({ onSwitchToLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) { setMsg({ type: 'error', text: 'Please fill in all required fields.' }); return; }
        setLoading(true); setMsg(null);
        try {
            const res = await fetch(`${BASE_URL}/owner/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, phone })
            });
            const data = await res.json();
            if (data.success) {
                setMsg({ type: 'success', text: 'Registration submitted. Our admin team will review and activate your account within 24 hours.' });
                setName(''); setEmail(''); setPassword(''); setPhone('');
            } else {
                setMsg({ type: 'error', text: data.error || 'Registration failed.' });
            }
        } catch (err) {
            setMsg({ type: 'error', text: 'Cannot connect to server. Please try again.' });
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <p className="label-md" style={{ color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Ceylon Compass</p>
                <h2 className="brand-title">Create Account</h2>
                <p className="brand-subtitle">Register as a hotel owner. An admin will review your account before activation.</p>
                <div className="gold-divider" />

                {msg && (
                    <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{msg.type === 'success' ? 'check_circle' : 'error'}</span>
                        {msg.text}
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Full Name *</label>
                        <input className="ledger-input" type="text" placeholder="John Silva" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Email Address *</label>
                        <input className="ledger-input" type="email" placeholder="john@yourhotel.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Password *</label>
                        <input className="ledger-input" type="password" placeholder="Create a strong password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input className="ledger-input" type="tel" placeholder="+94 77 123 4567" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                    <button type="submit" className="btn-navy" disabled={loading}>
                        {loading ? 'Submitting...' : <><Icon name="person_add" style={{ width: '18px', height: '18px' }} /> Create Account</>}
                    </button>
                </form>

                <p className="text-center mt-4" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    Already have an account?{' '}
                    <a className="link" onClick={onSwitchToLogin}>Sign in</a>
                </p>
            </div>
        </div>
    );
}
