import React, { useState } from 'react';
import '../global.css';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import BASE_URL from '../config';
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
import KandyEsalaPerahera from '../assets/KandyEsalaPerahera.jpg';
import KatharagamaFestival from '../assets/KatharagamaFestival.jpg';
import DuruthPerehara from '../assets/DuruthPerehara.jpg';
import GalleLittaraly from '../assets/GalleLittaraly.jpg';
import Posonpoya from '../assets/Posonpoya.jpg';
import VesakFestival from '../assets/VesakFestival.jpg';
import SinhalaTamilNewYear from '../assets/SinhalaTamilNewYear.jpg';
import NallurFestival from '../assets/NallurFestival.jpg';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RELIGION_BADGE = {
    Buddhist: { bg: '#F5F0FF', text: '#6D28D9', darkBg: '#4C1D95', darkText: '#E9D5FF' },
    Hindu: { bg: '#FFF0F3', text: '#BE123C', darkBg: '#881337', darkText: '#FECDD3' },
    Cultural: { bg: '#ECFDF5', text: '#065F46', darkBg: '#064E3B', darkText: '#A7F3D0' },
    Secular: { bg: '#EFF6FF', text: '#1D4ED8', darkBg: '#1E3A8A', darkText: '#BFDBFE' },
    'Multi-faith': { bg: '#FDF4FF', text: '#86198F', darkBg: '#701A75', darkText: '#F5D0FE' },
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
        image: KandyEsalaPerahera,
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
        image: VesakFestival,
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
        image: SinhalaTamilNewYear,
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
        image: NallurFestival,
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
        image: Posonpoya,
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
        image: DuruthPerehara,
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
        image: KatharagamaFestival,
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
        image: GalleLittaraly,
    },
];

const proxyImage = (rawUrl) => {
    if (!rawUrl) return null;
    return rawUrl.replace(/^"|"$/g, '').trim();
};

export default function Festivals({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCard, setExpandedCard] = useState(null);
    const [nearbymap, setNearByMap] = useState({});
    const [nearbyLoading, setNearbyLoading] = useState({});

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const fetchNearbyAttractionPlaces = async (fest) => {
        if (nearbymap[fest.id]) return;
        const names = fest.attractions;
        if (!names || names.length === 0) return;
        try {
            setNearbyLoading(prev => ({ ...prev, [fest.id]: true }));
            const query = names.join(',');
            const res = await fetch(`${BASE_URL}/Attraction/Names?names=${encodeURIComponent(query)}`);
            const data = await res.json();
            setNearByMap(prev => ({ ...prev, [fest.id]: data }));
        } catch (err) {
            console.error('Failed to fetch nearby attractions:', err);
        } finally {
            setNearbyLoading(prev => ({ ...prev, [fest.id]: false }));
        }
    };

    const toggle = (fest) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const isOpening = expandedCard !== fest.id;
        setExpandedCard(prev => prev === fest.id ? null : fest.id);
        if (isOpening) {
            fetchNearbyAttractionPlaces(fest);
        }
    };

    const filtered = FESTIVAL_DATA.filter(f => {
        const q = searchQuery.toLowerCase();
        return f.name.toLowerCase().includes(q) || f.month.toLowerCase().includes(q) || f.religion.toLowerCase().includes(q);
    });

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top', 'left', 'right']}>

                {/* Header */}
                <View className="bg-white dark:bg-gray-900 px-5 pt-4 pb-4 border-b border-slate-200 dark:border-gray-800">
                    <View className="flex-row items-center justify-between mb-4">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
                            <Text className="text-violet-700 dark:text-violet-400 font-extrabold text-sm">← Back</Text>
                        </TouchableOpacity>
                        <View className="items-center">
                            <Text className="text-slate-950 dark:text-white font-black text-lg">Sri Lankan Festivals</Text>
                            <Text className="text-slate-400 dark:text-slate-500 font-semibold text-[10px] tracking-[0.2em] mt-1">CULTURAL GUIDE</Text>
                        </View>
                        <View className="w-12" />
                    </View>

                    {/* Search */}
                    <View className="flex-row items-center bg-slate-100 dark:bg-gray-800 rounded-[14px] px-4 py-3 border border-slate-200 dark:border-gray-700">
                        <Image source={searchIcon} className="w-3.5 h-3.5 mr-2.5 opacity-40" resizeMode="contain" style={isDark ? { tintColor: 'white' } : {}} />
                        <TextInput
                            placeholder="Search by name, religion or month…"
                            placeholderTextColor={isDark ? "#9CA3AF" : "#CBD5E1"}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="flex-1 text-[13px] text-slate-900 dark:text-white font-medium"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1">
                                <Image source={closeIcon} className="w-3.5 h-3.5 opacity-40" resizeMode="contain" style={isDark ? { tintColor: 'white' } : {}} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* collapsed Cards */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    className="flex-1 bg-slate-50 dark:bg-gray-950"
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 18, paddingBottom: 70 }}
                >
                    {filtered.length === 0 ? (
                        <View className="items-center py-20">
                            <Text className="text-slate-500 font-bold text-[15px] mt-3">No festivals found</Text>
                            <Text className="text-slate-400 text-[12px] mt-1">Try a different name or month</Text>
                        </View>
                    ) : filtered.map((fest) => {
                        const isExpanded = expandedCard === fest.id;
                        const badge = RELIGION_BADGE[fest.religion] || RELIGION_BADGE['Secular'];

                        return (
                            <TouchableOpacity
                                key={fest.id}
                                activeOpacity={0.97}
                                onPress={() => toggle(fest)}
                                className="bg-white dark:bg-gray-800 rounded-[22px] mb-4 overflow-hidden shadow-sm border dark:border-gray-700"
                                style={{ elevation: isDark ? 0 : 2 }}
                            >
                                {/* Image */}
                                <View className="h-48 bg-slate-200 dark:bg-gray-700">
                                    <Image source={fest.image} className="w-full h-full" resizeMode="cover" />
                                    {/* Month*/}
                                    <View className="absolute top-3.5 left-3.5 bg-slate-950/65 px-3 py-1 rounded-full">
                                        <Text className="text-white font-bold text-[11px]">{fest.month}</Text>
                                    </View>
                                    {/* Duration*/}
                                    <View className="absolute top-3.5 right-3.5 bg-slate-950/65 px-3 py-1 rounded-full">
                                        <Text className="text-amber-300 font-bold text-[11px]">{fest.duration}</Text>
                                    </View>
                                </View>

                                {/* collapsed Card Body */}
                                <View className="px-5 pt-4 pb-5">

                                    {/* Title */}
                                    <View className="flex-row items-start justify-between mb-1.5">
                                        <Text className="text-slate-950 dark:text-white font-extrabold text-[18px] leading-6 flex-1 mr-3" numberOfLines={2}>{fest.name}</Text>
                                        <View className="rounded-full px-3 py-1.5 flex-shrink-0 mt-0.5" style={{ backgroundColor: isDark ? badge.darkBg : badge.bg }}>
                                            <Text className="font-bold text-[12px]" style={{ color: isDark ? badge.darkText : badge.text }}>{fest.religion}</Text>
                                        </View>
                                    </View>

                                    {/* Rating */}
                                    <View className="flex-row items-center mb-2.5">
                                        <Image source={star} className="w-3.5 h-3.5" resizeMode="contain" />
                                        <Text className="text-slate-950 dark:text-white font-bold text-[13px] ml-1">{fest.score.toFixed(1)}</Text>
                                        <View className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-600 mx-2" />
                                        <Text className="text-slate-400 dark:text-slate-400 text-[12px] font-medium flex-1" numberOfLines={1}>{fest.location}</Text>
                                    </View>

                                    {/* Description */}
                                    <Text className="text-slate-500 dark:text-slate-300 text-[13px] leading-5 font-normal mb-3.5" numberOfLines={isExpanded ? undefined : 2}>{fest.desc}</Text>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <View>
                                            <View className="h-px bg-slate-200 dark:bg-slate-700 mb-4" />

                                            {/* Info Grid */}
                                            <View className="mb-1.5">
                                                <InfoGrid
                                                    isDark={isDark}
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

                                            <View className="h-px bg-slate-200 dark:bg-slate-700 my-4" />

                                            {/* Icon detail */}
                                            <DetailRow isDark={isDark} icon={tshirtIcon} label="Dress Code" value={fest.dress_code} />
                                            <DetailRow isDark={isDark} icon={cameraIcon} label="Photography" value={fest.photography} />
                                            <DetailRow isDark={isDark} icon={tipsIcon} label="Travel Tip" value={fest.tips} />
                                            <DetailRow isDark={isDark} icon={cuisineIcon} label="Cuisine" value={fest.cuisine} />

                                            <View className="h-px bg-slate-200 dark:bg-slate-700 my-4" />

                                            <View>
                                             <View className="flex-row items-center mb-2.5">
                                                 <Image source={locationIcon} className="w-3.5 h-3.5 mr-2" resizeMode="contain" />
                                                 <Text className="text-slate-950 dark:text-white font-bold text-[13px]">Nearby Attraction places</Text>
                                             </View>

                                             {nearbyLoading[fest.id] ? (
                                                 <ActivityIndicator size="large" color="#f87171" className="my-6" />
                                             ) : (
                                                 <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                     <View className="flex-row py-3 px-6 -ml-6">
                                                         {(nearbymap[fest.id] && nearbymap[fest.id].length > 0) ? nearbymap[fest.id].map((attraction, i) => (
                                                             <View key={i} className="pl-6">
                                                                 <View className="bg-white dark:bg-gray-800 h-80 w-64 rounded-xl overflow-hidden relative border border-gray-100 dark:border-gray-700">
                                                                     <Image source={{ uri: proxyImage(attraction.image_url) }} className="w-full h-36" />
                                                                     <View className="left-0 right-0 top-[50%] bg-white dark:bg-gray-800 rounded-b-xl bottom-0 absolute">
                                                                         <Text className="text-black dark:text-white text-l font-bold pt-2 pl-4">{attraction.attraction_name}</Text>
                                                                         <View className="flex-row py-2 pl-4">
                                                                             <Image source={star} className="h-4 w-4" />
                                                                             <Text className="text-sm font-medium text-black dark:text-white pl-2">{attraction.rating}</Text>
                                                                             {attraction.distanceKm != null && (
                                                                                 <Text className="text-sm font-medium text-gray-400 pl-2">• {attraction.distanceKm} km away</Text>
                                                                             )}
                                                                         </View>
                                                                         <ScrollView style={{ maxHeight: 90 }} showsVerticalScrollIndicator={true}>
                                                                             <Text className="text-sm font-medium text-gray-400 px-4">{attraction.description}</Text>
                                                                         </ScrollView>
                                                                     </View>
                                                                 </View>
                                                             </View>
                                                         )) : (
                                                             <Text className="text-gray-400 text-sm">No attraction details found.</Text>
                                                         )}
                                                     </View>
                                                 </ScrollView>
                                             )}
                                            </View>
                                        </View>
                                    )}

                                    {!isExpanded && (
                                        <Text className="text-slate-300 dark:text-slate-500 text-[11px] font-semibold mt-0.5">Tap to see full details</Text>
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

function InfoGrid({ items, isDark }) {
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
        rows.push(items.slice(i, i + 2));
    }
    return (
        <View>
            {rows.map((row, ri) => (
                <View key={ri} className="flex-row mb-3">
                    {row.map((item, ci) => (
                        <View key={ci} className={`flex-1 ${ci === 0 ? 'pr-4' : ''}`}>
                            <Text className="text-slate-400 text-[11px] font-semibold mb-1">{item.label}</Text>
                            <Text className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>{item.value}</Text>
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
}

function DetailRow({ icon, label, value, isDark }) {
    return (
        <View className="flex-row items-start mb-3.5">
            <View className={`w-8 h-8 rounded-[8px] items-center justify-center mr-3 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#F8FAFC] border-[#F1F5F9]'}`}>
                <Image source={icon} style={{ width: 17, height: 17 }} resizeMode="contain" />
            </View>
            <View className="flex-1">
                <Text className="text-[#94A3B8] text-[11px] font-semibold mb-1">{label}</Text>
                <Text className={`text-[13px] font-semibold ${isDark ? 'text-white' : 'text-[#1E293B]'}`} style={{ lineHeight: 19 }}>{value}</Text>
            </View>
        </View>
    );
}
