import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import BASE_URL from '../config';

const ALL_FEATURES = [
    { id: "Free WiFi", icon: "wifi" },
    { id: "Swimming Pool", icon: "pool" },
    { id: "Free Parking", icon: "local_parking" },
    { id: "Restaurant On-site", icon: "restaurant" },
    { id: "Air Conditioning", icon: "ac_unit" },
    { id: "Beach Access", icon: "beach_access" },
    { id: "Full Kitchen", icon: "kitchen" },
    { id: "Family Friendly", icon: "child_friendly" },
    { id: "Garden", icon: "yard" },
    { id: "Heritage Property", icon: "account_balance" },
];

const emptyForm = {
    hotel_name: '', description: '', star_rating: '', price_per_night_usd: '',
    review_count: '', features: '', latitude: '', longitude: '', nearest_cities: '', image_url: ''
};

// Section Header component
function SectionHeader({ icon, title }) {
    return (
        <div>
            <div className="ledger-section-header">
                <div className="section-icon">
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <h2 className="headline-sm" style={{ color: 'var(--ink)' }}>{title}</h2>
            </div>
            <hr className="ledger-hr" />
        </div>
    );
}

// HotelForm OUTSIDE to prevent focus-loss bug
function HotelForm({ form, setForm, onSubmit, title, subtitle, submitLabel, loading, msg, onCancel }) {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = React.useRef(null);

    const selectedFeatures = form.features ? form.features.split(';').map(f => f.trim()).filter(Boolean) : [];

    const toggleFeature = (id) => {
        const updated = selectedFeatures.includes(id)
            ? selectedFeatures.filter(f => f !== id)
            : [...selectedFeatures, id];
        setForm(f => ({ ...f, features: updated.join(';') }));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        setUploadError('');
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(`${BASE_URL}/upload/image`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                setForm(f => ({ ...f, image_url: data.url }));
            } else {
                setUploadError(data.error || 'Upload failed.');
            }
        } catch (err) {
            setUploadError('Cannot connect to server. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <div className="flex-between mb-6">
                <div>
                    <h1 className="headline-lg" style={{ color: 'var(--ink)' }}>{title}</h1>
                    <p className="body-md text-muted mt-2">{subtitle}</p>
                </div>
                <button className="btn-outline" onClick={onCancel}>
                    <Icon name="arrow_back" style={{ width: '18px', height: '18px' }} /> Back
                </button>
            </div>

            {msg && (
                <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{msg.type === 'success' ? 'check_circle' : 'error'}</span>
                    {msg.text}
                </div>
            )}

            <form onSubmit={onSubmit}>
                {/* Basic Information */}
                <div className="ledger-card mb-6">
                    <SectionHeader icon="info" title="Basic Information" />
                    <div className="form-group">
                        <label>Hotel Name *</label>
                        <input className="ledger-input" type="text" placeholder="e.g. Sunset Beach Resort" value={form.hotel_name} onChange={e => setForm(f => ({ ...f, hotel_name: e.target.value }))} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="ledger-input" rows={4} placeholder="Describe your hotel, atmosphere, and what makes it special..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                    </div>
                </div>

                {/* Details & Pricing */}
                <div className="ledger-card mb-6">
                    <SectionHeader icon="star_rate" title="Details & Pricing" />
                    <div className="form-row-3">
                        <div className="form-group">
                            <label>Star Rating</label>
                            <div style={{ position: 'relative' }}>
                                <select className="ledger-input" value={form.star_rating} onChange={e => setForm(f => ({ ...f, star_rating: e.target.value }))}>
                                    <option value="">Select rating</option>
                                    <option value="1">1 Star</option>
                                    <option value="2">2 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="5">5 Stars</option>
                                </select>
                                <Icon name="expand_more" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'var(--outline)', pointerEvents: 'none' }} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Price Per Night (USD)</label>
                            <div style={{ position: 'relative' }}>
                                <Icon name="attach_money" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: 'var(--outline)' }} />
                                <input className="ledger-input" type="text" placeholder="e.g. $85" value={form.price_per_night_usd} onChange={e => setForm(f => ({ ...f, price_per_night_usd: e.target.value }))} style={{ paddingLeft: '36px' }} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Review Count</label>
                            <input className="ledger-input" type="number" placeholder="e.g. 124" value={form.review_count} onChange={e => setForm(f => ({ ...f, review_count: e.target.value }))} />
                        </div>
                    </div>
                </div>

                {/* Amenities */}
                <div className="ledger-card mb-6">
                    <SectionHeader icon="check" title="Amenities & Features" />
                    <p className="body-md text-muted mb-4">Select all features your hotel offers:</p>
                    <div className="chips-wrap">
                        {ALL_FEATURES.map(f => {
                            const isSelected = selectedFeatures.includes(f.id);
                            return (
                                <button key={f.id} type="button" className={`chip ${isSelected ? 'selected' : ''}`} onClick={() => toggleFeature(f.id)}>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}>{f.icon}</span>
                                    {f.id}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Location */}
                <div className="ledger-card mb-6">
                    <SectionHeader icon="location_on" title="Location" />
                    <p className="body-md text-muted mb-4">Nearby attractions are auto-generated from your coordinates — just enter your hotel's GPS location.</p>
                    <div className="form-row mb-4">
                        <div className="form-group">
                            <label>Latitude</label>
                            <input className="ledger-input" type="number" step="any" placeholder="e.g. 6.9271" value={form.latitude} onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label>Longitude</label>
                            <input className="ledger-input" type="number" step="any" placeholder="e.g. 79.8612" value={form.longitude} onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Nearest Cities</label>
                        <input className="ledger-input" type="text" placeholder="e.g. Colombo, Negombo" value={form.nearest_cities} onChange={e => setForm(f => ({ ...f, nearest_cities: e.target.value }))} />
                    </div>
                </div>

                {/* Photo */}
                <div className="ledger-card mb-6">
                    <SectionHeader icon="image" title="Photo" />
                    <div className="form-group">
                        <label>Hotel Image</label>

                        {/* Upload from computer */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                            <button
                                type="button"
                                className="btn-outline"
                                style={{ flexShrink: 0 }}
                                onClick={() => fileInputRef.current.click()}
                                disabled={uploading}
                            >
                                <Icon name="upload" style={{ width: '18px', height: '18px' }} />
                                {uploading ? 'Uploading...' : 'Upload from Computer'}
                            </button>
                            <span style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: 'var(--text-muted)', flexShrink: 0 }}>or</span>
                            <input
                                className="ledger-input"
                                type="url"
                                placeholder="Paste image URL..."
                                value={form.image_url}
                                onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                                style={{ flex: 1 }}
                            />
                        </div>

                        {uploadError && (
                            <div className="alert alert-error" style={{ padding: '8px 12px', fontSize: '13px' }}>
                                <Icon name="error" style={{ width: '16px', height: '16px' }} />
                                {uploadError}
                            </div>
                        )}

                        {/* Preview */}
                        {form.image_url && (
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <img
                                    src={form.image_url}
                                    alt="preview"
                                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--hairline)', display: 'block' }}
                                    onError={e => e.target.style.display = 'none'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                                    style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '4px', color: 'white', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Icon name="close" style={{ width: '16px', height: '16px' }} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingBottom: '48px' }}>
                    <button type="button" className="btn-outline" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn-navy" style={{ width: 'auto' }} disabled={loading}>
                        {loading ? 'Saving...' : submitLabel}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function OwnerDashboard({ user, onLogout }) {
    const [hotels, setHotels] = useState([]);
    const [view, setView] = useState('my-hotels');
    const [editHotel, setEditHotel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const fetchHotels = async () => {
        try {
            const res = await fetch(`${BASE_URL}/owner/hotels/${user.id}`);
            const data = await res.json();
            setHotels(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchHotels(); }, []);

    const resetForm = () => { setForm(emptyForm); setEditHotel(null); setMsg(null); };
    const goBack = () => { resetForm(); setView('my-hotels'); };

    const handleAddHotel = async (e) => {
        e.preventDefault();
        if (!form.hotel_name) { setMsg({ type: 'error', text: 'Hotel name is required.' }); return; }
        setLoading(true); setMsg(null);
        try {
            const res = await fetch(`${BASE_URL}/owner/hotels`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, ownerId: user.id })
            });
            const data = await res.json();
            if (data.success) {
                setMsg({ type: 'success', text: 'Hotel submitted. It will appear in the app once approved by admin.' });
                resetForm(); fetchHotels();
                setTimeout(() => setView('my-hotels'), 1500);
            } else { setMsg({ type: 'error', text: data.error || 'Failed to add hotel.' }); }
        } catch (err) { setMsg({ type: 'error', text: 'Server error. Please try again.' }); }
        finally { setLoading(false); }
    };

    const handleUpdateHotel = async (e) => {
        e.preventDefault();
        setLoading(true); setMsg(null);
        try {
            const res = await fetch(`${BASE_URL}/owner/hotels/${editHotel._id}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                setMsg({ type: 'success', text: 'Hotel updated. Waiting for admin re-approval.' });
                fetchHotels();
                setTimeout(() => { resetForm(); setView('my-hotels'); }, 1500);
            } else { setMsg({ type: 'error', text: data.error || 'Update failed.' }); }
        } catch (err) { setMsg({ type: 'error', text: 'Server error. Please try again.' }); }
        finally { setLoading(false); }
    };

    const startEdit = (hotel) => {
        setEditHotel(hotel);
        setForm({
            hotel_name: hotel.hotel_name || '', description: hotel.description || '',
            star_rating: hotel.star_rating || '', price_per_night_usd: hotel.price_per_night_usd || '',
            review_count: hotel.review_count || '', features: hotel.features || '',
            latitude: hotel.latitude || '', longitude: hotel.longitude || '',
            nearest_cities: hotel.nearest_cities || '', image_url: hotel.image_url || ''
        });
        setMsg(null); setView('edit-hotel');
    };

    const initials = user.name ? user.name.charAt(0).toUpperCase() : '?';

    return (
        <div className="portal-layout">
            {/* Sidebar */}
            <nav className="sidebar">
                <div className="sidebar-brand">
                    <h1>Hotel Owner<br />Portal</h1>
                </div>
                <div className="sidebar-user">
                    <div className="avatar">{initials}</div>
                    <div className="user-info">
                        <div className="name">{user.name}</div>
                        <div className="email">{user.email}</div>
                    </div>
                </div>
                <div className="sidebar-nav">
                    <div className={`sidebar-nav-item ${view === 'my-hotels' ? 'active' : ''}`} onClick={() => { setView('my-hotels'); resetForm(); }}>
                        <Icon name="domain" style={{ fontVariationSettings: view === 'my-hotels' ? "'FILL' 1" : "'FILL' 0" }} />
                        My Hotels
                    </div>
                    <div className={`sidebar-nav-item ${view === 'add-hotel' ? 'active' : ''}`} onClick={() => { setView('add-hotel'); resetForm(); }}>
                        <Icon name="add_business" style={{ fontVariationSettings: view === 'add-hotel' ? "'FILL' 1" : "'FILL' 0" }} />
                        Add New Hotel
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
                    <div className="title">Ceylon Compass — Hotel Portal</div>
                    <button className="sign-out" onClick={onLogout}>
                        Sign Out <Icon name="logout" style={{ width: '18px', height: '18px' }} />
                    </button>
                </header>

                <div className="page-canvas">
                    {view === 'my-hotels' && (
                        <div>
                            <div className="flex-between mb-8">
                                <div>
                                    <h1 className="display-lg" style={{ color: 'var(--ink)' }}>My Hotels</h1>
                                    <p className="body-md text-muted mt-2">Manage your listings on the Tourist Guide app.</p>
                                </div>
                                <button className="btn-navy" style={{ width: 'auto' }} onClick={() => { setView('add-hotel'); resetForm(); }}>
                                    <Icon name="add" style={{ width: '18px', height: '18px' }} /> Add Hotel
                                </button>
                            </div>

                            {hotels.length === 0 ? (
                                <div className="empty-state ledger-card">
                                    <Icon name="domain" style={{ width: '48px', height: '48px', color: 'var(--gold)', marginBottom: '16px' }} />
                                    <h3>No hotels yet</h3>
                                    <p>Add your first hotel. It will appear in the Tourist Guide app after admin approval.</p>
                                    <button className="btn-navy" style={{ width: 'auto' }} onClick={() => setView('add-hotel')}>
                                        <Icon name="add_business" style={{ width: '18px', height: '18px' }} /> Add Your First Hotel
                                    </button>
                                </div>
                            ) : (
                                <div className="hotel-grid">
                                    {hotels.map(hotel => (
                                        <article className="hotel-card" key={hotel._id}>
                                            <div className="flex-between mb-2">
                                                <h2 className="hotel-name">{hotel.hotel_name}</h2>
                                                <div className={`stamp ${hotel.isApproved ? 'stamp-live' : 'stamp-pending'}`}>
                                                    <span className="material-symbols-outlined">{hotel.isApproved ? 'check_circle' : 'schedule'}</span>
                                                    {hotel.isApproved ? 'Live' : 'Pending'}
                                                </div>
                                            </div>
                                            <div className="gold-divider" style={{ margin: '10px 0' }} />
                                            <p className="hotel-desc">{hotel.description || 'No description provided.'}</p>
                                            {hotel.star_rating && (
                                                <p className="hotel-meta">{'⭐'.repeat(parseInt(hotel.star_rating))} · {hotel.price_per_night_usd || 'N/A'}/night</p>
                                            )}
                                            {hotel.nearest_cities && (
                                                <div className="flex-center gap-2 mt-2">
                                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0 }}>
                                                        <Icon name="location_on" style={{ fontSize: '14px', lineHeight: 1 }} />
                                                    </div>
                                                    <span className="label-md text-muted">{hotel.nearest_cities}</span>
                                                </div>
                                            )}
                                            {!hotel.isApproved && (
                                                <div className="alert alert-warning" style={{ marginTop: '12px', padding: '8px 12px', fontSize: '13px' }}>
                                                    <Icon name="schedule" style={{ width: '16px', height: '16px' }} />
                                                    Waiting for admin approval
                                                </div>
                                            )}
                                            <div className="card-footer">
                                                <button className="btn-outline" style={{ fontSize: '13px', padding: '8px 16px' }} onClick={() => startEdit(hotel)}>
                                                    <Icon name="edit" style={{ width: '16px', height: '16px' }} /> Edit Details
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                    {/* Add placeholder */}
                                    <div className="add-hotel-placeholder" onClick={() => { setView('add-hotel'); resetForm(); }}>
                                        <div className="add-icon-circle">
                                            <Icon name="add" style={{ color: 'var(--text-muted)' }} />
                                        </div>
                                        <h3 className="headline-md" style={{ color: 'var(--ink)', marginBottom: '8px' }}>Expand Your Portfolio</h3>
                                        <p className="body-md text-muted">Register a new property to reach more tourists.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {view === 'add-hotel' && (
                        <HotelForm
                            form={form} setForm={setForm}
                            onSubmit={handleAddHotel}
                            title="Add New Hotel"
                            subtitle="Fill in your hotel details. Admin will review before it appears in the app."
                            submitLabel="Submit Hotel"
                            loading={loading} msg={msg} onCancel={goBack}
                        />
                    )}

                    {view === 'edit-hotel' && editHotel && (
                        <HotelForm
                            form={form} setForm={setForm}
                            onSubmit={handleUpdateHotel}
                            title={`Edit: ${editHotel.hotel_name}`}
                            subtitle="Update details — admin will need to re-approve before changes go live."
                            submitLabel="Update Hotel"
                            loading={loading} msg={msg} onCancel={goBack}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
