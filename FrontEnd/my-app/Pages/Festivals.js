import React, { useState } from 'react';
import '../global.css';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import calendarIcon from '../assets/calendar_blue.png';
import religionIcon from '../assets/lotus_amber.png';
import locationIcon from '../assets/location_red.png';
import targetIcon from '../assets/target_slate.png';
import tshirtIcon from '../assets/tshirt_purple.png';
import cameraIcon from '../assets/camera_emerald.png';
import tipsIcon from '../assets/idea_amber.png';
import cuisineIcon from '../assets/cuisine_orange.png';
import linkIcon from '../assets/link_slate.png';
import searchIcon from '../assets/search.png';
import closeIcon from '../assets/close.png';
import star from '../assets/star.png';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RELIGION_BADGE = {
    Buddhist: { bg: '#F5F0FF', text: '#6D28D9' },
    Hindu: { bg: '#FFF0F3', text: '#BE123C' },
    Cultural: { bg: '#ECFDF5', text: '#065F46' },
    Secular: { bg: '#EFF6FF', text: '#1D4ED8' },
    'Multi-faith': { bg: '#FDF4FF', text: '#86198F' },
};

const FESTIVAL_DATA = [
    {
        id: 'F001', name: 'Kandy Esala Perahera', local_name: 'Esala Perahera',
        religion: 'Buddhist', type: 'Religious Procession',
        location: 'Kandy, Central Province', venue: 'Temple of the Sacred Tooth Relic & Kandy streets',
        month: 'August', start: 'Aug 18', end: 'Aug 27', duration: '10 Days', peak: 'Final 5 nights',
        score: 4.9, crowd: 'Very High',
        desc: 'One of Asia\'s grandest Buddhist pageants — ornate elephants, fire dancers, and drummers parade through Kandy\'s historic streets for 10 spectacular nights.',
        best_for: 'Cultural travellers · Photographers · History lovers',
        dress_code: 'Modest — cover shoulders and knees.',
        photography: 'Best shots at night with torchlight. Use fast lens (f/1.8).',
        tips: 'Arrive at least 2 hours early to secure a good standing spot.',
        cuisine: 'Kandyan rice and curry, buffalo curd with kithul treacle.',
        attractions: ['Temple of the Tooth', 'Bahirawakanda Buddha', 'Kandy Lake'],
        image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&auto=format&fit=crop&q=80',
    },
    {
        id: 'F002', name: 'Vesak Poya Festival', local_name: 'Vesak',
        religion: 'Buddhist', type: 'Religious / Community',
        location: 'Islandwide', venue: 'Colombo, Kandy, Anuradhapura',
        month: 'May', start: 'May 01', end: 'May 02', duration: '7 Days', peak: 'Full moon night',
        score: 4.8, crowd: 'High',
        desc: 'The entire island glows with handmade lanterns, illuminated pandols, and free food stalls (Dansalas) celebrating the birth and enlightenment of the Buddha.',
        best_for: 'Cultural travellers · Spiritual seekers · Photographers',
        dress_code: 'Modestly dressed — white clothing is traditional.',
        photography: 'Night photography of lanterns and pandals with long exposures.',
        tips: 'Walk Colombo streets after dark and try free food from Dansalas.',
        cuisine: 'Vegetarian foods, kokis, kavum, and herbal tea.',
        attractions: ['Kelaniya Temple', 'Gangaramaya Temple', 'Beira Lake'],
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80',
    },
    {
        id: 'F003', name: 'Sinhala & Tamil New Year', local_name: 'Aluth Avurudhu',
        religion: 'Cultural', type: 'Cultural / National',
        location: 'Islandwide', venue: 'Celebrated in every local home',
        month: 'April', start: 'Apr 13', end: 'Apr 14', duration: '2 Days', peak: 'April 13–14',
        score: 4.6, crowd: 'Medium',
        desc: 'A vibrant harvest celebration with oil lamp lighting, traditional village games, and an abundance of homemade sweets shared between families across Sri Lanka.',
        best_for: 'Families · Cultural travellers · Foodies',
        dress_code: 'Casual. New colorful clothes are traditional.',
        photography: 'Capture traditional village games and cooking rituals.',
        tips: 'Accept invitations to local homes — it\'s the best experience.',
        cuisine: 'Kiribath (milk rice), kavum, kokis, and aluwa.',
        attractions: ['Local villages', 'Kandy Botanical Gardens', 'Nuwara Eliya Hills'],
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
    },
    {
        id: 'F004', name: 'Nallur Festival', local_name: 'Nallur Kandaswamy Kovil Festival',
        religion: 'Hindu', type: 'Religious Pilgrimage',
        location: 'Jaffna, Northern Province', venue: 'Nallur Kandaswamy Kovil, Jaffna',
        month: 'August', start: 'Aug 01', end: 'Aug 25', duration: '25 Days', peak: 'Final 3 days',
        score: 4.7, crowd: 'Very High',
        desc: 'A 25-day Hindu pilgrimage culminating in a magnificent golden chariot procession through the streets of Jaffna, drawing hundreds of thousands of devotees.',
        best_for: 'Cultural travellers · Spiritual seekers · Off-beat explorers',
        dress_code: 'Modest. Men must remove shirts inside the temple. No leather.',
        photography: 'Seek permission before photographing devotees. Dawn light is best.',
        tips: 'The final 3 days feature the iconic golden chariot procession.',
        cuisine: 'Jaffna crab curry, mutton rolls, and palmyra fruit sweets.',
        attractions: ['Jaffna Fort', 'Jaffna Library', 'Delft Island'],
        image: 'https://images.unsplash.com/photo-1604514685562-f4b21bb9fd37?w=800&auto=format&fit=crop&q=80',
    },
    {
        id: 'F005', name: 'Poson Poya', local_name: 'Poson',
        religion: 'Buddhist', type: 'Religious Pilgrimage',
        location: 'Mihintale & Anuradhapura', venue: 'Mihintale Rock & Anuradhapura City',
        month: 'June', start: 'Jun 11', end: 'Jun 11', duration: '3 Days', peak: 'Full moon night',
        score: 4.5, crowd: 'High',
        desc: 'Thousands of white-clad pilgrims climb the ancient rock of Mihintale by candlelight to commemorate the arrival of Buddhism in Sri Lanka over 2,300 years ago.',
        best_for: 'Spiritual seekers · History lovers · Pilgrimage travellers',
        dress_code: 'White clothing strongly preferred. Cover all limbs.',
        photography: 'The nighttime candle-lit climb at Mihintale is extraordinary.',
        tips: 'Climb Mihintale after 8PM for the best atmosphere and candles.',
        cuisine: 'Simple village food — rice, dhal, and fresh king coconut.',
        attractions: ['Ruwanwelisaya', 'Isurumuniya', 'Mihintale Rock'],
        image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&auto=format&fit=crop&q=80',
    },
    {
        id: 'F006', name: 'Duruthu Perahera', local_name: 'Duruthu Perahera',
        religion: 'Buddhist', type: 'Religious Procession',
        location: 'Kelaniya (near Colombo)', venue: 'Kelaniya Raja Maha Viharaya',
        month: 'January', start: 'Jan 08', end: 'Jan 10', duration: '3 Days', peak: 'Grand Final night',
        score: 4.3, crowd: 'Medium',
        desc: 'A beautifully accessible perahera just 30 minutes from Colombo — smaller in scale but rich in tradition, featuring dancers, drummers, and decorated elephants.',
        best_for: 'First-time visitors · Photographers · Colombo day-trippers',
        dress_code: 'Modest — cover shoulders and knees.',
        photography: 'Smaller scale allows closer access to dancers and elephants.',
        tips: 'Only 30 minutes from Colombo. Starts around 8PM.',
        cuisine: 'Local street foods, hoppers, and kottu roti.',
        attractions: ['Kelaniya Temple', 'Colombo Fort', 'Galle Face Green'],
        image: 'https://images.unsplash.com/photo-1561361062-85654594183b?w=800&auto=format&fit=crop&q=80',
    },
    {
        id: 'F007', name: 'Kataragama Festival', local_name: 'Kataragama Esala Festival',
        religion: 'Multi-faith', type: 'Religious / Multi-faith',
        location: 'Kataragama, Hambantota', venue: 'Kataragama Sacred Town',
        month: 'July', start: 'Jul 15', end: 'Aug 05', duration: '15 Days', peak: 'Water-cutting ceremony',
        score: 4.7, crowd: 'Very High',
        desc: 'A rare multi-faith festival where Buddhist, Hindu, Muslim, and Vedda pilgrims gather in one sacred town — culminating in fire walking and a dramatic water-cutting ceremony.',
        best_for: 'Cultural travellers · Photographers · Spiritual seekers',
        dress_code: 'Modest. Remove shoes. No leather items.',
        photography: 'Ask permission before photographing intense penances.',
        tips: 'Sacred to Buddhist, Hindu, Muslim, and Vedda people simultaneously.',
        cuisine: 'Simple vegetarian pilgrimage food.',
        attractions: ['Yala Safari', 'Bundala Bird Sanctuary', 'Menik River'],
        image: 'https://images.unsplash.com/photo-1590076275577-c1c992f7b3cc?w=800&auto=format&fit=crop&q=80',
    },
    {
        id: 'F008', name: 'Galle Literary Festival', local_name: 'Galle Literary Festival',
        religion: 'Secular', type: 'Arts & Literature',
        location: 'Galle, Southern Province', venue: 'Galle Fort (UNESCO Site)',
        month: 'February', start: 'Feb 06', end: 'Feb 09', duration: '4 Days', peak: 'All 4 days',
        score: 4.4, crowd: 'Medium-High',
        desc: 'World-class authors, thinkers, and artists gather inside the colonial walls of Galle Fort for four days of readings, panels, and cultural conversations.',
        best_for: 'Literary tourists · Cultural travellers · Couples',
        dress_code: 'Smart casual. Relaxed fort atmosphere.',
        photography: 'Galle Fort offers photogenic colonial architecture and ramparts.',
        tips: 'Book accommodation inside the fort early. Combine with whale-watching.',
        cuisine: 'Seafood, international fusion, and Southern fish curry.',
        attractions: ['Galle Lighthouse', 'Unawatuna Beach', 'Japanese Peace Pagoda'],
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    },
];

export default function Festivals({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCard, setExpandedCard] = useState(null);

    const toggle = (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedCard(prev => prev === id ? null : id);
    };

    const filtered = FESTIVAL_DATA.filter(f => {
        const q = searchQuery.toLowerCase();
        return f.name.toLowerCase().includes(q) || f.month.toLowerCase().includes(q) || f.religion.toLowerCase().includes(q);
    });

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>

                {/* Header */}
                <View style={{ backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                            <Text style={{ color: '#6D28D9', fontWeight: '700', fontSize: 14 }}>← Back</Text>
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 18 }}>Sri Lankan Festivals</Text>
                            <Text style={{ color: '#94A3B8', fontWeight: '600', fontSize: 10, letterSpacing: 2, marginTop: 1 }}>CULTURAL GUIDE</Text>
                        </View>
                        <View style={{ width: 48 }} />
                    </View>

                    {/* Search */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <Image source={searchIcon} style={{ width: 14, height: 14, marginRight: 10, opacity: 0.4 }} resizeMode="contain" />
                        <TextInput
                            placeholder="Search by name, religion or month…"
                            placeholderTextColor="#CBD5E1"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={{ flex: 1, fontSize: 13, color: '#0F172A', fontWeight: '500' }}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 2 }}>
                                <Image source={closeIcon} style={{ width: 13, height: 13, opacity: 0.4 }} resizeMode="contain" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* collapsed Cards */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1, backgroundColor: '#F8FAFC' }}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 18, paddingBottom: 70 }}
                >
                    {filtered.length === 0 ? (
                        <View style={{ alignItems: 'center', paddingVertical: 80 }}>
                            <Text style={{ fontSize: 36 }}>🎭</Text>
                            <Text style={{ color: '#64748B', fontWeight: '700', fontSize: 15, marginTop: 12 }}>No festivals found</Text>
                            <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 4 }}>Try a different name or month</Text>
                        </View>
                    ) : filtered.map((fest) => {
                        const isExpanded = expandedCard === fest.id;
                        const badge = RELIGION_BADGE[fest.religion] || RELIGION_BADGE['Secular'];

                        return (
                            <TouchableOpacity
                                key={fest.id}
                                activeOpacity={0.97}
                                onPress={() => toggle(fest.id)}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: 22,
                                    marginBottom: 16,
                                    overflow: 'hidden',
                                    elevation: 2,
                                    shadowColor: '#64748B',
                                    shadowOffset: { width: 0, height: 3 },
                                    shadowOpacity: 0.08,
                                    shadowRadius: 14,
                                }}
                            >
                                {/* Image */}
                                <View style={{ height: 190, backgroundColor: '#E2E8F0' }}>
                                    <Image source={{ uri: fest.image }} style={{ width: '100%', height: 190 }} resizeMode="cover" />
                                    {/* Month*/}
                                    <View style={{ position: 'absolute', top: 14, left: 14, backgroundColor: 'rgba(15,23,42,0.65)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 }}>
                                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 11 }}>{fest.month}</Text>
                                    </View>
                                    {/* Duration*/}
                                    <View style={{ position: 'absolute', top: 14, right: 14, backgroundColor: 'rgba(15,23,42,0.65)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 }}>
                                        <Text style={{ color: '#FCD34D', fontWeight: '700', fontSize: 11 }}>{fest.duration}</Text>
                                    </View>
                                </View>

                                {/* collapsed Card Body */}
                                <View style={{ padding: 18, paddingTop: 16 }}>

                                    {/* Title */}
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', flex: 1, marginRight: 12, lineHeight: 24 }}>{fest.name}</Text>
                                        <View style={{ backgroundColor: badge.bg, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, flexShrink: 0, marginTop: 2 }}>
                                            <Text style={{ color: badge.text, fontWeight: '700', fontSize: 12 }}>{fest.religion}</Text>
                                        </View>
                                    </View>

                                    {/* Rating */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                        <Image source={star} style={{ width: 14, height: 14 }} resizeMode="contain" />
                                        <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 13, marginLeft: 4 }}>{fest.score.toFixed(1)}</Text>
                                        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0', marginHorizontal: 8 }} />
                                        <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '500', flex: 1 }} numberOfLines={1}>{fest.location}</Text>
                                    </View>

                                    {/* Description */}
                                    <Text style={{ color: '#64748B', fontSize: 13, lineHeight: 20, fontWeight: '400', marginBottom: 14 }} numberOfLines={isExpanded ? undefined : 2}>{fest.desc}</Text>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <View>
                                            <View style={{ height: 1, backgroundColor: '#F1F5F9', marginBottom: 16 }} />

                                            {/* Info Grid */}
                                            <View style={{ marginBottom: 6 }}>
                                                <InfoGrid
                                                    items={[
                                                        { label: 'Dates', value: `${fest.start} – ${fest.end}` },
                                                        { label: 'Peak', value: fest.peak },
                                                        { label: 'Crowd', value: fest.crowd },
                                                        { label: 'Type', value: fest.type },
                                                        { label: 'Venue', value: fest.venue },
                                                        { label: 'Best For', value: fest.best_for },
                                                    ]}
                                                />
                                            </View>

                                            <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 }} />

                                            {/* Icon detail */}
                                            <DetailRow icon={tshirtIcon} label="Dress Code" value={fest.dress_code} />
                                            <DetailRow icon={cameraIcon} label="Photography" value={fest.photography} />
                                            <DetailRow icon={tipsIcon} label="Travel Tip" value={fest.tips} />
                                            <DetailRow icon={cuisineIcon} label="Cuisine" value={fest.cuisine} />

                                            <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 }} />

                                            {/* Nearby attractions */}
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                                <Image source={linkIcon} style={{ width: 14, height: 14, marginRight: 8 }} resizeMode="contain" />
                                                <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 13 }}>Nearby Attractions</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
                                                {fest.attractions.map((a, i) => (
                                                    <View key={i} style={{ backgroundColor: '#F5F0FF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 7, marginBottom: 7 }}>
                                                        <Text style={{ color: '#6D28D9', fontWeight: '700', fontSize: 12 }}>{a}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )}

                                    {!isExpanded && (
                                        <Text style={{ color: '#CBD5E1', fontSize: 11, fontWeight: '600', marginTop: 2 }}>Tap to see full details</Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

function InfoGrid({ items }) {
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
        rows.push(items.slice(i, i + 2));
    }
    return (
        <View>
            {rows.map((row, ri) => (
                <View key={ri} style={{ flexDirection: 'row', marginBottom: 12 }}>
                    {row.map((item, ci) => (
                        <View key={ci} style={{ flex: 1, paddingRight: ci === 0 ? 16 : 0 }}>
                            <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '600', marginBottom: 2 }}>{item.label}</Text>
                            <Text style={{ color: '#1E293B', fontSize: 13, fontWeight: '700' }}>{item.value}</Text>
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
}

function DetailRow({ icon, label, value }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 }}>
            <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: '#F1F5F9' }}>
                <Image source={icon} style={{ width: 17, height: 17 }} resizeMode="contain" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '600', marginBottom: 2 }}>{label}</Text>
                <Text style={{ color: '#1E293B', fontSize: 13, fontWeight: '600', lineHeight: 19 }}>{value}</Text>
            </View>
        </View>
    );
}
