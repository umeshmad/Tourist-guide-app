import "../global.css";
import React, { useState } from "react";
import { Text, View, Image, ScrollView, TouchableOpacity, Alert, Linking, TextInput } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import explore from '../assets/explore.jpg';
import { useNavigation } from "@react-navigation/native";
import Sleep from '../assets/sleep.png';
import rest from '../assets/rest.png';
import Locationping from '../assets/location-pin.png';
import Hiking from '../assets/hiking.png';
import train from '../assets/train.png';
import clock from '../assets/clock.png';
import lantern from '../assets/lantern.png';
import star from '../assets/star.png';
import arrowRightIcon from '../assets/arrow_right.png';
import closeIcon from '../assets/close.png';
import KandyEsalaPerahera from '../assets/KandyEsalaPerahera.jpg';
import VesakFestival from '../assets/VesakFestival.jpg';
import SinhalaTamilNewYear from '../assets/SinhalaTamilNewYear.jpg';
import KatharagamaFestival from '../assets/KatharagamaFestival.jpg';
import BASE_URL from "../config";
const RECOMMENDED = [
    {
        name: "Browns Beach",
        desc: "A stunning coastline with golden sands and clear waters, perfect for relaxing and swimming.",
        dist: "0.5 Km away",
        score: "4.8",
        uri: "https://res.cloudinary.com/dojoopvkn/image/upload/v1780993591/photo%20spots/Mirissa%20Beach.jpg",
    },
    {
        name: "Negombo Fort",
        desc: "Explore the historic ruins and learn about the Dutch colonial period in Sri Lanka.",
        dist: "1.2 Km away",
        score: "4.5",
        uri: "https://res.cloudinary.com/dojoopvkn/image/upload/v1780994134/photo%20spots/Nine%20Arch%20Bridge.jpg",
    },
];

const TRAIN_ROUTES = [
    {
        route: "Colombo Fort ↔ Ella (Highlands Ride)",
        duration: "8 - 9 Hours",
        tips: "Book 1st class observation deck or 2nd class reserved seats. Sit on the RIGHT side when traveling from Colombo/Kandy to Ella for the best valley views.",
        image: "https://res.cloudinary.com/dojoopvkn/image/upload/v1780994134/photo%20spots/Nine%20Arch%20Bridge.jpg",
    },
    {
        route: "Colombo ↔ Galle (Coastal Ride)",
        duration: "2 - 2.5 Hours",
        tips: "Sit on the RIGHT side from Colombo to Galle for uninterrupted Indian Ocean views right next to the tracks.",
        image: "https://res.cloudinary.com/dojoopvkn/image/upload/v1780993591/photo%20spots/Mirissa%20Beach.jpg"
    }
];

const FESTIVALS = [
    {
        title: "Kandy Esala Perahera",
        badge: "Buddhist",
        badgeBg: "#FEF3C7", // Will be overridden in render for dark mode
        badgeText: "#92400E",
        date: "August",
        score: "4.9",
        desc: "One of Asia's grandest pageants — ornate elephants, fire dancers, and drummers parade through Kandy's historic streets for 10 spectacular nights.",
        location: "Kandy, Central Province",
        image: KandyEsalaPerahera,
    },
    {
        title: "Vesak Poya Festival",
        badge: "Buddhist",
        badgeBg: "#FEF3C7",
        badgeText: "#92400E",
        date: "May",
        score: "4.8",
        desc: "The entire island glows with handmade lanterns, illuminated pandols, and free food stalls celebrating the birth and enlightenment of the Buddha.",
        location: "Islandwide — Best in Colombo",
        image: VesakFestival,
    },
    {
        title: "Sinhala & Tamil New Year",
        badge: "Cultural",
        badgeBg: "#ECFDF5",
        badgeText: "#065F46",
        date: "April",
        score: "4.6",
        desc: "A vibrant harvest celebration with traditional games, oil lamp rituals, and an abundance of homemade sweets shared between families across Sri Lanka.",
        location: "Islandwide — Cultural homes",
        image: SinhalaTamilNewYear,
    },
    {
        title: "Kataragama Festival",
        badge: "Multi-faith",
        badgeBg: "#FDF4FF",
        badgeText: "#86198F",
        date: "July",
        score: "4.7",
        desc: "A rare multi-faith gathering where Buddhist, Hindu, Muslim, and Vedda pilgrims unite — culminating in fire-walking and a dramatic water-cutting ceremony.",
        location: "Kataragama, Hambantota",
        image: KatharagamaFestival,
    },
];

const ROUTE_SAMPLE_PLACES = [
    {
        name: 'Pinnawala Elephant Orphanage',
        type: 'Nature',
        dist: '42 km from Colombo',
        score: '4.7',
        desc: 'A famous sanctuary where rescued elephants are raised and cared for, located midway on the Colombo–Kandy route.',
        image: 'https://res.cloudinary.com/dojoopvkn/image/upload/v1780993591/photo%20spots/Mirissa%20Beach.jpg',
    },
    {
        name: 'Kegalle Town Viewpoint',
        type: 'Scenic',
        dist: '75 km from Colombo',
        score: '4.3',
        desc: 'A peaceful hilltop viewpoint offering panoramic views of lush green valleys on your way to Kandy.',
        image: 'https://res.cloudinary.com/dojoopvkn/image/upload/v1780994134/photo%20spots/Nine%20Arch%20Bridge.jpg',
    },
    {
        name: 'Ambuluwawa Tower',
        type: 'Adventure',
        dist: '95 km from Colombo',
        score: '4.5',
        desc: 'A unique spiral tower nestled in the highlands just before Kandy, surrounded by misty forest and stunning views.',
        image: 'https://res.cloudinary.com/dojoopvkn/image/upload/v1780993591/photo%20spots/Mirissa%20Beach.jpg',
    },
];

export default function Explore() {
    const navigation = useNavigation();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [start, setStart] = useState('Colombo');
    const [destination, setDestination] = useState('Kandy');
    const [routePlaces, setRoutePlaces] = useState([]);
    const [searched, setSearched] = useState(false);
    const [Loading, setLoading]=useState(false);

    const handleSearch = async() => {
        if(!start.trim()||!destination.trim()){
            Alert.alert("Missing info", "Please enter both a starting point and a destination.");
            return
        }
        setLoading(true);
        try{
            const res=await fetch(`${BASE_URL}/route/recommendations?start=${encodeURIComponent(start)}&destination=${encodeURIComponent(destination)}&buffer=20&limit=50`);
            const data=await res.json();
            
            if(!res.ok){
                Alert.alert("No route found", data.error || "Could not find places along this route.");
                setRoutePlaces([]);
                setSearched(false);
                return;
            }
            const mapped = data.places.map((place) => ({
                name: place.attraction_name,
                type: place.category || "Attraction",
                desc: place.description || "A great stop along your route.",
                score: place.rating ? String(place.rating) : "4.5",
                dist: `${place.distanceAlongRouteKm} km from ${start}`,
                image: place.image_url || place.uri, 
        }));

        setRoutePlaces(mapped);
        setSearched(true);
        }catch (err) {
            console.error("Route search error:", err);
            Alert.alert("Error", "Something went wrong finding your route. Check your connection.");
        }
        finally{
            setLoading(false);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="bg-white dark:bg-gray-900 flex-1" edges={['top', 'left', 'right']}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

                    {/* Hero Section */}
                    <View className="px-5 pt-4">
                        <View className="rounded-3xl overflow-hidden relative" style={{ elevation: isDark ? 0 : 5 }}>
                            <Image source={explore} className="w-full h-52" resizeMode="cover" />
                            <View className="absolute inset-0 bg-black/35 rounded-3xl" />
                            <View className="absolute bottom-0 left-0 right-0 p-5">
                                <Text className="text-white font-bold text-2xl">Explore</Text>
                                <Text className="text-white/80 text-sm mt-1">Find your next adventure</Text>
                            </View>
                        </View>
                    </View>

                    {/* Categories */}
                    <View className="px-5 pt-6">
                        <Text className="font-bold text-lg text-gray-900 dark:text-white">Categories</Text>
                    </View>
                    <View className="pt-3 px-5 flex-row justify-between">

                        <TouchableOpacity className="flex rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 items-center justify-center h-20 w-[22%]"
                            style={{ elevation: isDark ? 0 : 3 }}
                            onPress={() => navigation.navigate("Hotels")}
                        >
                            <Image source={Sleep} className="w-8 h-8 mb-1.5" resizeMode="contain" />
                            <Text className="text-gray-600 dark:text-gray-400 font-medium text-xs">Hotels</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 items-center justify-center h-20 w-[22%]"
                            style={{ elevation: isDark ? 0 : 3 }}
                            onPress={() => navigation.navigate("Resturants")}
                        >
                            <Image source={rest} className="w-8 h-8 mb-1.5" resizeMode="contain" />
                            <Text className="text-gray-600 dark:text-gray-400 font-medium text-xs">Foods</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 items-center justify-center h-20 w-[22%]"
                            style={{ elevation: isDark ? 0 : 3 }}
                            onPress={() => navigation.navigate("Attraction")}
                        >
                            <Image source={Locationping} className="w-8 h-8 mb-1.5" resizeMode="contain" />
                            <Text className="text-gray-600 dark:text-gray-400 font-medium text-xs">Places</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 items-center justify-center h-20 w-[22%]"
                            style={{ elevation: isDark ? 0 : 3 }}
                            onPress={() => navigation.navigate("PhotoSpots")}
                        >
                            <Image source={Hiking} className="w-8 h-8 mb-1.5" resizeMode="contain" />
                            <Text className="text-gray-600 dark:text-gray-400 font-medium text-xs">Tours</Text>
                        </TouchableOpacity>

                    </View>

                    {/* Train*/}
                    <View className="px-5 pt-8">
                        <View className="flex-row items-center mb-1">
                            <Image source={train} className="w-8 h-8 mt-1 mr-1" resizeMode="contain" />
                            <Text className="text-lg font-bold text-gray-900 dark:text-white"> Scenic Train Routes</Text>
                        </View>
                        <Text className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">Legendary railway journeys across Sri Lanka</Text>

                        {TRAIN_ROUTES.map((route, idx) => (
                            <View key={idx} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden mt-4 shadow-sm" style={{ elevation: isDark ? 0 : 3 }}>
                                <View style={{ position: 'relative' }}>
                                    <Image source={{ uri: route.image }} style={{ width: '100%', height: 160 }} resizeMode="cover" />
                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.20)', justifyContent: 'flex-end', padding: 14 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15, flex: 1, marginRight: 8, textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>{route.route}</Text>
                                            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.45)' }}>
                                                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 10 }}>{route.duration}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* train body*/}
                                <View className="p-4">
                                    <Text className="text-gray-600 dark:text-gray-400 text-xs leading-4"><Text className="font-bold text-gray-800 dark:text-gray-200">Seat Tip:</Text> {route.tips}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            Linking.openURL("https://pravesha.lk/en").catch(() => {
                                                Alert.alert("Error", "Could not open link");
                                            });
                                        }}
                                        className="bg-blue-500 rounded-xl py-2.5 px-4 mt-3 items-center"
                                    >
                                        <Text className="text-white text-xs font-bold">Check Train Booking Info</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Festivals */}
                    <View style={{ paddingHorizontal: 20, paddingTop: 32 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={lantern} style={{ width: 28, height: 28, marginRight: 8 }} resizeMode="contain" />
                                <Text className="text-[17px] font-[800] text-[#0F172A] dark:text-white">Sri Lankan Festivals</Text>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate("Festivals")} className="bg-[#EFF6FF] dark:bg-blue-900/40 px-3 py-1.5 rounded-[20px] flex-row items-center">
                                <Text className="text-[#1D4ED8] dark:text-blue-400 font-[700] text-[12px]">See All</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="text-[#94A3B8] dark:text-gray-500 text-[12px] font-[500] mb-3.5">Plan your trip around these magical cultural moments</Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20, paddingBottom: 10 }} style={{ marginBottom: 6 }}>
                            {FESTIVALS.map((fest, idx) => {
                                const darkBadgeBg = fest.badgeBg === '#FEF3C7' ? '#92400E40' : (fest.badgeBg === '#ECFDF5' ? '#065F4640' : '#86198F40');
                                const darkBadgeText = fest.badgeText === '#92400E' ? '#FCD34D' : (fest.badgeText === '#065F46' ? '#6EE7B7' : '#F0ABFC');
                                return (
                                <TouchableOpacity
                                    key={idx}
                                    activeOpacity={0.93}
                                    onPress={() => navigation.navigate("Festivals")}
                                    className="w-[260px] mr-3.5 bg-white dark:bg-gray-800 rounded-[20px] overflow-hidden"
                                    style={{
                                        elevation: isDark ? 0 : 3,
                                        shadowColor: '#64748B',
                                        shadowOffset: { width: 0, height: 3 },
                                        shadowOpacity: 0.09,
                                        shadowRadius: 12,
                                        borderWidth: isDark ? 1 : 0,
                                        borderColor: isDark ? '#374151' : 'transparent',
                                    }}
                                >
                                    {/* Festival Image */}
                                    <View style={{ height: 140, backgroundColor: isDark ? '#374151' : '#E2E8F0' }}>
                                        <Image source={fest.image} style={{ width: '100%', height: 140 }} resizeMode="cover" />

                                        <View style={{ position: 'absolute', top: 11, left: 11, backgroundColor: 'rgba(15,23,42,0.62)', paddingHorizontal: 11, paddingVertical: 4, borderRadius: 18 }}>
                                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 11 }}>{fest.date}</Text>
                                        </View>
                                    </View>

                                    {/* body*/}
                                    <View style={{ padding: 14 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <Text className="text-[15px] font-[800] text-[#0F172A] dark:text-white flex-1 mr-2 leading-[21px]" numberOfLines={2}>{fest.title}</Text>
                                            <View style={{ backgroundColor: isDark ? darkBadgeBg : fest.badgeBg, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 18, flexShrink: 0 }}>
                                                <Text style={{ color: isDark ? darkBadgeText : fest.badgeText, fontWeight: '700', fontSize: 10 }}>{fest.badge}</Text>
                                            </View>
                                        </View>

                                        {/* Star Rating */}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                            <Image source={star} style={{ width: 12, height: 12 }} resizeMode="contain" />
                                            <Text className="text-[#0F172A] dark:text-white font-[700] text-[12px] ml-1">{fest.score}</Text>
                                            <View className="w-1 h-1 rounded-full bg-[#E2E8F0] dark:bg-gray-600 mx-2" />
                                            <Text className="text-[#94A3B8] dark:text-gray-400 text-[11px] font-[500] flex-1" numberOfLines={1}>{fest.location}</Text>
                                        </View>

                                        {/* Description */}
                                        <Text className="text-[#64748B] dark:text-gray-400 text-[12px] leading-[18px] font-[400]" numberOfLines={2}>{fest.desc}</Text>
                                    </View>
                                </TouchableOpacity>
                            )})}
                        </ScrollView>
                    </View>

                    {/* Route-Based Recommendation */}
                    <View className="px-5 pt-8">
                        <View className="flex-row items-center justify-between mb-1.5">
                            <View>
                                <Text className="font-black text-lg text-slate-900 dark:text-white leading-6">PathFinder Guide</Text>
                                <Text className="text-slate-400 dark:text-slate-500 text-[11px] font-semibold tracking-wider uppercase mt-0.5">Explore along your route</Text>
                            </View>
                            <View className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-3 py-1">
                                <Text className="text-blue-600 dark:text-blue-400 text-[10px] font-extrabold tracking-wider">SMART ROADTRIP</Text>
                            </View>
                        </View>
                        <View className="h-4" />

                        {/* Visual Route Search Box */}
                        <View className="bg-white dark:bg-gray-800 rounded-3xl border border-slate-100 dark:border-gray-700 p-5 mb-5 shadow-md" style={{ elevation: isDark ? 0 : 4 }}>
                            <View className="flex-row">
                                {/* Visual Connector Column */}
                                <View className="items-center justify-between py-3.5 mr-4 w-5">
                                    <View className="w-3.5 h-3.5 rounded-full border-2 border-blue-500 bg-white dark:bg-gray-800 items-center justify-center">
                                        <View className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    </View>
                                    <View className="w-[1.5px] h-10 border-l border-dashed border-slate-300 dark:border-gray-600" />
                                    <View className="w-3.5 h-3.5 rounded-full border-2 border-green-500 bg-white dark:bg-gray-800 items-center justify-center">
                                        <View className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    </View>
                                </View>

                                {/* Inputs Column */}
                                <View className="flex-1 justify-between">
                                    {/* Start Location Input */}
                                    <View className="border-b border-slate-100 dark:border-gray-700 pb-2">
                                        <Text className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-0.5">Starting From</Text>
                                        <TextInput
                                            value={start}
                                            onChangeText={setStart}
                                            placeholder="Enter start city..."
                                            placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                                            className="text-sm font-semibold text-slate-800 dark:text-white p-0"
                                        />
                                    </View>

                                    <View className="h-4" />

                                    {/* Destination Input */}
                                    <View className="pb-1">
                                        <Text className="text-[10px] font-bold text-green-500 dark:text-green-400 uppercase tracking-wider mb-0.5">Heading To</Text>
                                        <TextInput
                                            value={destination}
                                            onChangeText={setDestination}
                                            placeholder="Enter destination..."
                                            placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                                            className="text-sm font-semibold text-slate-800 dark:text-white p-0"
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Search Button */}
                            <TouchableOpacity
                                onPress={handleSearch}
                                activeOpacity={0.9}
                                className="bg-blue-600 rounded-2xl py-3.5 items-center mt-5 flex-row justify-center"
                                style={{ elevation: isDark ? 0 : 2 }}
                            >
                                <Text className="text-white font-extrabold text-[15px] tracking-wide">Find Places On Route</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Results */}
                        {searched && routePlaces.length > 0 && (
                            <View className="mt-2">
                                <View className="flex-row items-center justify-between mb-4">
                                    <View className="flex-row items-center flex-1">
                                        <View className="w-1.5 h-4 bg-blue-500 rounded-full mr-2" />
                                        <Text className="text-slate-800 dark:text-white font-extrabold text-base" numberOfLines={1}>
                                            Found along {start} ➔ {destination}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => setSearched(false)}
                                        className="ml-3 bg-slate-100 dark:bg-gray-700 rounded-full px-3 py-1 flex-row items-center"
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-slate-500 dark:text-gray-300 text-xs font-bold">✕ Collapse</Text>
                                    </TouchableOpacity>
                                </View>

                                {routePlaces.map((place, i) => (
                                    <View key={i} className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-3xl overflow-hidden mb-4 shadow-sm" style={{ elevation: isDark ? 0 : 2 }}>
                                        {/* Card Cover */}
                                        <View className="relative h-44 w-full bg-slate-100 dark:bg-gray-700">
                                            <Image source={{ uri: place.image }} className="w-full h-full" resizeMode="cover" />

                                            {/* Top badges */}
                                            <View className="absolute top-3 left-3 bg-slate-900/75 rounded-full px-3 py-1">
                                                <Text className="text-white text-[11px] font-bold">{place.type}</Text>
                                            </View>
                                            <View className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-xl px-2.5 py-1 flex-row items-center shadow-sm border border-gray-100 dark:border-gray-700">
                                                <Image source={star} className="w-3 h-3 mr-1" resizeMode="contain" />
                                                <Text className="text-amber-500 font-extrabold text-xs">{place.score}</Text>
                                            </View>
                                        </View>

                                        {/* Content info */}
                                        <View className="p-4">
                                            <View className="flex-row justify-between items-start mb-1.5">
                                                <Text className="text-slate-900 dark:text-white font-bold text-base flex-1 mr-2" numberOfLines={1}>{place.name}</Text>
                                                <Text className="text-blue-500 font-bold text-xs bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">{place.dist}</Text>
                                            </View>
                                            <Text className="text-slate-500 dark:text-gray-400 text-xs leading-4" numberOfLines={2}>{place.desc}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Recommended */}
                    <View className="flex-row justify-between items-center px-5 pt-8 pb-1">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white">Recommended Attractions</Text>
                        <Text className="text-blue-500 dark:text-blue-400 font-medium text-sm">See All</Text>
                    </View>

                    <View className="px-5 mt-3">
                        {RECOMMENDED.map((item, i) => (
                            <View key={i} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden mb-4" style={{ elevation: isDark ? 0 : 4 }}>
                                <Image source={{ uri: item.uri }} className="w-full h-44" resizeMode="cover" />
                                <View className="p-4">
                                    <View className="flex-row justify-between items-center mb-1.5">
                                        <Text className="font-bold text-gray-900 dark:text-white text-lg">{item.name}</Text>
                                        <View style={{ backgroundColor: isDark ? '#1E3A8A40' : '#EFF6FF', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={star} style={{ width: 11, height: 11, marginRight: 4 }} resizeMode="contain" />
                                            <Text style={{ color: isDark ? '#60A5FA' : '#1D4ED8', fontWeight: '700', fontSize: 11 }}>{item.score}</Text>
                                        </View>
                                    </View>
                                    <Text className="text-gray-400 dark:text-gray-500 text-xs mb-3 leading-4">{item.desc}</Text>
                                    <View className="flex-row justify-between items-center">
                                        <Text className="font-medium text-gray-500 dark:text-gray-400 text-xs">{item.dist}</Text>
                                        <TouchableOpacity
                                            onPress={() => Alert.alert("Clicked!")}
                                            className="bg-blue-500 rounded-xl py-2 px-5"
                                        >
                                            <Text className="text-white text-xs font-bold">View</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>

                </ScrollView>

                {/* Bottom Navigation */}
                <View className="absolute bottom-0 w-full bg-white dark:bg-gray-900 pt-3 pb-5 px-8 flex-row justify-between items-center border-t border-gray-100 dark:border-gray-800" style={{ elevation: isDark ? 0 : 10 }}>
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Home")}>
                        <View className="w-1.5 h-1.5 rounded-full mb-1" />
                        <Text className="text-[13px] font-medium text-gray-400 dark:text-gray-500">Home</Text>
                    </TouchableOpacity>
                    <View className="items-center">
                        <View className="w-1.5 h-1.5 bg-blue-500 rounded-full mb-1" />
                        <Text className="text-[13px] font-bold text-blue-500">Explore</Text>
                    </View>
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Tour Planing")}>
                        <View className="w-1.5 h-1.5 rounded-full mb-1" />
                        <Text className="text-[13px] font-medium text-gray-400 dark:text-gray-500">Schedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Profile")}>
                        <View className="w-1.5 h-1.5 rounded-full mb-1" />
                        <Text className="text-[13px] font-medium text-gray-400 dark:text-gray-500">Profile</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );
}