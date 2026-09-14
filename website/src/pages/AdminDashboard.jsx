import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import BASE_URL from '../config';

export default function AdminDashboard({ onLogout }) {
    const [pending, setPending] = useState({ owners: [], hotels: [] });
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('owners');
    const [msg, setMsg] = useState(null);

    const fetchPending = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/pending`);
            const data = await res.json();
            setPending(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPending(); }, []);

    const approveOwner = async (id, name) => {
        try {
            const res = await fetch(`${BASE_URL}/admin/approve-owner/${id}`, { method: 'PUT' });
            const data = await res.json();
            if (data.success) { setMsg({ type: 'success', text: `Owner "${name}" has been approved.` }); fetchPending(); setTimeout(() => setMsg(null), 3000); }
        } catch (err) { setMsg({ type: 'error', text: 'Approval failed.' }); }
    };

    const approveHotel = async (id, name) => {
        try {
            const res = await fetch(`${BASE_URL}/admin/approve-hotel/${id}`, { method: 'PUT' });
            const data = await res.json();
            if (data.success) { setMsg({ type: 'success', text: `Hotel "${name}" is now live.` }); fetchPending(); setTimeout(() => setMsg(null), 3000); }
        } catch (err) { setMsg({ type: 'error', text: 'Approval failed.' }); }
    };

    return (
        <div className="portal-layout">
            {/* Sidebar */}
            <nav className="sidebar">
                <div className="sidebar-brand">
                    <h1>Admin<br />Dashboard</h1>
                </div>
                <div className="sidebar-user">
                    <div className="avatar" style={{ fontSize: '14px', background: 'rgba(198,155,60,0.2)', color: 'var(--gold)', border: '2px solid var(--gold)' }}>ADM</div>
                    <div className="user-info">
                        <div className="name">Administrator</div>
                        <div className="email" style={{ background: 'rgba(198,155,60,0.15)', color: 'var(--gold)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', fontSize: '11px', fontWeight: 700 }}>ADMIN</div>
                    </div>
                </div>
                <div className="sidebar-nav">
                    <div className={`sidebar-nav-item ${tab === 'owners' ? 'active' : ''}`} onClick={() => setTab('owners')}>
                        <Icon name="group" style={{ fontVariationSettings: tab === 'owners' ? "'FILL' 1" : "'FILL' 0" }} />
                        Pending Owners
                        {pending.owners?.length > 0 && (
                            <span style={{ marginLeft: 'auto', background: '#B5432E', color: 'white', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, padding: '1px 7px', minWidth: '20px', textAlign: 'center' }}>
                                {pending.owners.length}
                            </span>
                        )}
                    </div>
                    <div className={`sidebar-nav-item ${tab === 'hotels' ? 'active' : ''}`} onClick={() => setTab('hotels')}>
                        <Icon name="domain" style={{ fontVariationSettings: tab === 'hotels' ? "'FILL' 1" : "'FILL' 0" }} />
                        Pending Hotels
                        {pending.hotels?.length > 0 && (
                            <span style={{ marginLeft: 'auto', background: '#B5432E', color: 'white', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, padding: '1px 7px', minWidth: '20px', textAlign: 'center' }}>
                                {pending.hotels.length}
                            </span>
                        )}
                    </div>
                </div>
                <div className="sidebar-footer">
                    <div className="sidebar-nav-item danger" onClick={onLogout}>
                        <Icon name="logout" />
                        Sign Out
                    </div>
                </div>
            </nav>

            {/* Main */}
            <div className="main-content">
                <header className="topbar">
                    <div className="title">Ceylon Compass — Admin</div>
                    <button className="sign-out" onClick={onLogout}>
                        Sign Out <Icon name="logout" style={{ width: '18px', height: '18px' }} />
                    </button>
                </header>

                <div className="page-canvas">
                    <div className="flex-between mb-8">
                        <div>
                            <h1 className="display-lg" style={{ color: 'var(--ink)' }}>Admin Panel</h1>
                            <p className="body-md text-muted mt-2">Review and approve hotel owner accounts and listings.</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="stats-row">
                        <div className="stat-block">
                            <div className="num">{pending.owners?.length || 0}</div>
                            <div className="lbl">Pending Owner Accounts</div>
                        </div>
                        <div className="stat-block">
                            <div className="num">{pending.hotels?.length || 0}</div>
                            <div className="lbl">Pending Hotel Listings</div>
                        </div>
                    </div>

                    {msg && (
                        <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{msg.type === 'success' ? 'check_circle' : 'error'}</span>
                            {msg.text}
                        </div>
                    )}

                    {loading ? (
                        <div className="ledger-card text-center" style={{ padding: '48px' }}>
                            <Icon name="hourglass_top" style={{ width: '32px', height: '32px', color: 'var(--gold)', display: 'block', marginBottom: '12px' }} />
                            <p className="body-md text-muted">Loading pending requests...</p>
                        </div>
                    ) : (
                        <>
                            {/* Pending Owners */}
                            {tab === 'owners' && (
                                <div>
                                    <h2 className="headline-md mb-4" style={{ color: 'var(--ink)' }}>Pending Owner Accounts</h2>
                                    {pending.owners?.length === 0 ? (
                                        <div className="empty-state ledger-card">
                                            <Icon name="check_circle" style={{ width: '48px', height: '48px', color: 'var(--tea-green)', display: 'block', marginBottom: '12px' }} />
                                            <h3>All caught up!</h3>
                                            <p>No pending owner accounts to review.</p>
                                        </div>
                                    ) : (
                                        <div className="ledger-card" style={{ padding: 0 }}>
                                            <div className="data-table-wrap">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Email</th>
                                                            <th>Phone</th>
                                                            <th>Registered</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {pending.owners.map(owner => (
                                                            <tr key={owner._id}>
                                                                <td style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600 }}>{owner.name}</td>
                                                                <td>{owner.email}</td>
                                                                <td style={{ color: 'var(--text-muted)' }}>{owner.phone || '—'}</td>
                                                                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                                                    {new Date(owner.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                                </td>
                                                                <td>
                                                                    <div className="stamp stamp-pending" style={{ display: 'inline-flex' }}>
                                                                        <Icon name="schedule" />
                                                                        Pending
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <button className="btn-green" onClick={() => approveOwner(owner._id, owner.name)}>
                                                                        <Icon name="check" style={{ width: '16px', height: '16px' }} /> Approve
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Pending Hotels */}
                            {tab === 'hotels' && (
                                <div>
                                    <h2 className="headline-md mb-4" style={{ color: 'var(--ink)' }}>Pending Hotel Listings</h2>
                                    {pending.hotels?.length === 0 ? (
                                        <div className="empty-state ledger-card">
                                            <Icon name="check_circle" style={{ width: '48px', height: '48px', color: 'var(--tea-green)', display: 'block', marginBottom: '12px' }} />
                                            <h3>All caught up!</h3>
                                            <p>No pending hotel listings to review.</p>
                                        </div>
                                    ) : (
                                        <div className="hotel-grid">
                                            {pending.hotels.map(hotel => (
                                                <article className="hotel-card" key={hotel._id}>
                                                    {hotel.image_url && (
                                                        <img src={hotel.image_url} alt={hotel.hotel_name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '2px', marginBottom: '16px' }} onError={e => e.target.style.display = 'none'} />
                                                    )}
                                                    <div className="flex-between mb-2">
                                                        <h2 className="hotel-name">{hotel.hotel_name}</h2>
                                                        <div className="stamp stamp-pending">
                                                            <Icon name="schedule" />
                                                            Review
                                                        </div>
                                                    </div>
                                                    <div className="gold-divider" style={{ margin: '10px 0' }} />
                                                    <p className="hotel-desc">{hotel.description || 'No description.'}</p>
                                                    {hotel.star_rating && <p className="hotel-meta">{'⭐'.repeat(parseInt(hotel.star_rating))} · {hotel.price_per_night_usd}/night</p>}
                                                    {hotel.nearest_cities && (
                                                        <div className="flex-center gap-2 mt-2">
                                                            <Icon name="location_on" style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                                                            <span className="label-md text-muted">{hotel.nearest_cities}</span>
                                                        </div>
                                                    )}
                                                    <p style={{ fontSize: '12px', color: 'var(--outline)', marginTop: '8px' }}>
                                                        Submitted: {new Date(hotel.createdAt).toLocaleDateString()}
                                                    </p>
                                                    <div className="card-footer">
                                                        <button className="btn-green" style={{ width: '100%', justifyContent: 'center' }} onClick={() => approveHotel(hotel._id, hotel.hotel_name)}>
                                                            <Icon name="check_circle" style={{ width: '16px', height: '16px' }} />
                                                            Approve & Go Live
                                                        </button>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
