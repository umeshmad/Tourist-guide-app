import "../global.css";
import React from "react";
import { Text, View, Image, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
        route: "Kandy ↔ Ella (Highlands Ride)",
        duration: "6.5 - 7 Hours",
        tips: "Book 1st class observation deck or 2nd class reserved seats. Sit on the RIGHT side when traveling from Kandy to Ella for the best valley views.",
        timetable: "Departs Kandy: 08:47 AM, 11:10 AM daily.",
        image: "https://res.cloudinary.com/dojoopvkn/image/upload/v1780994134/photo%20spots/Nine%20Arch%20Bridge.jpg",
    },
    {
        route: "Colombo ↔ Galle (Coastal Ride)",
        duration: "2 - 2.5 Hours",
        tips: "Sit on the RIGHT side from Colombo to Galle for uninterrupted Indian Ocean views right next to the tracks.",
        timetable: "Departs Colombo Fort: 06:55 AM, 08:30 AM, 03:40 PM.",
        image: "https://res.cloudinary.com/dojoopvkn/image/upload/v1780993591/photo%20spots/Mirissa%20Beach.jpg"
    }
];

const FESTIVALS = [
    {
        title: "Kandy Esala Perahera",
        badge: "Buddhist",
        badgeBg: "#FEF3C7",
        badgeText: "#92400E",
        date: "August",
        score: "4.9",
        desc: "One of Asia's grandest pageants — ornate elephants, fire dancers, and drummers parade through Kandy's historic streets for 10 spectacular nights.",
        location: "Kandy, Central Province",
        image: "https://images.unsplash.com/photo-1546708973-b339540b5162?w=600&auto=format&fit=crop&q=80",
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
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&auto=format&fit=crop&q=80",
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
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80",
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
        image: "https://images.unsplash.com/photo-1590076275577-c1c992f7b3cc?w=600&auto=format&fit=crop&q=80",
    },
];

export default function Explore() {
    const navigation = useNavigation();
    return (
        <SafeAreaProvider>
            <SafeAreaView className="bg-white flex-1" edges={['top', 'left', 'right']}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

                    {/* Hero Section */}
                    <View className="px-5 pt-4">
                        <View className="rounded-3xl overflow-hidden relative" style={{ elevation: 5 }}>
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
                        <Text className="font-bold text-lg text-gray-900">Categories</Text>
                    </View>
                    <View className="pt-3 px-5 flex-row justify-between">

                        <TouchableOpacity className="flex rounded-2xl bg-white border border-gray-100 items-center justify-center h-20 w-[22%]"
                            style={{ elevation: 3 }}
                            onPress={() => navigation.navigate("Hotels")}
                        >
                            <Image source={Sleep} className="w-8 h-8 mb-1.5" resizeMode="contain" />
                            <Text className="text-gray-600 font-medium text-xs">Hotels</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex rounded-2xl bg-white border border-gray-100 items-center justify-center h-20 w-[22%]"
                            style={{ elevation: 3 }}
                            onPress={() => navigation.navigate("Resturants")}
                        >
                            <Image source={rest} className="w-8 h-8 mb-1.5" resizeMode="contain" />
                            <Text className="text-gray-600 font-medium text-xs">Foods</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex rounded-2xl bg-white border border-gray-100 items-center justify-center h-20 w-[22%]"
                            style={{ elevation: 3 }}
                            onPress={() => navigation.navigate("Attraction")}
                        >
                            <Image source={Locationping} className="w-8 h-8 mb-1.5" resizeMode="contain" />
                            <Text className="text-gray-600 font-medium text-xs">Places</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex rounded-2xl bg-white border border-gray-100 items-center justify-center h-20 w-[22%]"
                            style={{ elevation: 3 }}
                            onPress={() => navigation.navigate("PhotoSpots")}
                        >
                            <Image source={Hiking} className="w-8 h-8 mb-1.5" resizeMode="contain" />
                            <Text className="text-gray-600 font-medium text-xs">Tours</Text>
                        </TouchableOpacity>

                    </View>

                    {/* Train*/}
                    <View className="px-5 pt-8">
                        <View className="flex-row">
                            <Image source={train} className="w-5 h-5 mt-1 mr-1" resizeMode="contain" />
                            <Text className="text-lg font-bold text-gray-900"> Scenic Train Routes</Text>
                        </View>
                        <Text className="text-gray-400 text-xs mt-0.5">Legendary railway journeys across Sri Lanka</Text>

                        {TRAIN_ROUTES.map((route, idx) => (
                            <View key={idx} className="bg-white border border-gray-100 rounded-2xl overflow-hidden mt-4 shadow-sm" style={{ elevation: 3 }}>
                                <Image source={{ uri: route.image }} className="w-full h-36" resizeMode="cover" />
                                <View className="p-4">
                                    <Text className="font-bold text-gray-950 text-base">{route.route}</Text>
                                    <View className="flex-row items-center mt-1">
                                        <Image source={clock} className="w-4 h-4 mr-1" resizeMode="contain" />
                                        <Text className="text-blue-600 bg-blue-50 font-bold text-[10px] px-2 py-0.5 rounded-md"> {route.duration}</Text>
                                    </View>
                                    <Text className="text-gray-600 text-xs mt-2.5 leading-4"><Text className="font-bold text-gray-800">Seat Tip:</Text> {route.tips}</Text>
                                    <View className="flex-row">
                                        <Image source={clock} className="w-4 h-4 mr-1 mt-2" resizeMode="contain" />
                                        <Text className="text-gray-500 text-[11px] mt-1.5 font-medium">Timetable: {route.timetable}</Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => {
                                            Linking.openURL("https://pravesha.lk/en").catch(() => {
                                                Alert.alert("Error", "Could not open link");
                                            });
                                        }}
                                        className="bg-blue-500 rounded-xl py-2 px-4 mt-3 items-center"
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
                                <Image source={lantern} style={{ width: 22, height: 22, marginRight: 8 }} resizeMode="contain" />
                                <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A' }}>Sri Lankan Festivals</Text>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate("Festivals")} style={{ backgroundColor: '#FFF7ED', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#C2410C', fontWeight: '700', fontSize: 12 }}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '500', marginBottom: 14 }}>Plan your trip around these magical cultural moments</Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20, paddingBottom: 10 }} style={{ marginBottom: 6 }}>
                            {FESTIVALS.map((fest, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    activeOpacity={0.93}
                                    onPress={() => navigation.navigate("Festivals")}
                                    style={{
                                        width: 260,
                                        marginRight: 14,
                                        backgroundColor: '#fff',
                                        borderRadius: 20,
                                        overflow: 'hidden',
                                        elevation: 3,
                                        shadowColor: '#64748B',
                                        shadowOffset: { width: 0, height: 3 },
                                        shadowOpacity: 0.09,
                                        shadowRadius: 12,
                                    }}
                                >
                                    {/* Festival Image */}
                                    <View style={{ height: 140, backgroundColor: '#E2E8F0' }}>
                                        <Image source={{ uri: fest.image }} style={{ width: '100%', height: 140 }} resizeMode="cover" />

                                        <View style={{ position: 'absolute', top: 11, left: 11, backgroundColor: 'rgba(15,23,42,0.62)', paddingHorizontal: 11, paddingVertical: 4, borderRadius: 18 }}>
                                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 11 }}>{fest.date}</Text>
                                        </View>
                                    </View>

                                    {/* body*/}
                                    <View style={{ padding: 14 }}>
                                        {/* Title */}
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <Text style={{ fontSize: 15, fontWeight: '800', color: '#0F172A', flex: 1, marginRight: 8, lineHeight: 21 }} numberOfLines={2}>{fest.title}</Text>
                                            <View style={{ backgroundColor: fest.badgeBg, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 18, flexShrink: 0 }}>
                                                <Text style={{ color: fest.badgeText, fontWeight: '700', fontSize: 10 }}>{fest.badge}</Text>
                                            </View>
                                        </View>

                                        {/* Star Rating */}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                            <Image source={star} style={{ width: 12, height: 12 }} resizeMode="contain" />
                                            <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 12, marginLeft: 4 }}>{fest.score}</Text>
                                            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0', marginHorizontal: 7 }} />
                                            <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '500', flex: 1 }} numberOfLines={1}>{fest.location}</Text>
                                        </View>

                                        {/* Description */}
                                        <Text style={{ color: '#64748B', fontSize: 12, lineHeight: 18, fontWeight: '400' }} numberOfLines={2}>{fest.desc}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Recommended */}
                    <View className="flex-row justify-between items-center px-5 pt-8 pb-1">
                        <Text className="text-lg font-bold text-gray-900">Recommended Attractions</Text>
                        <Text className="text-blue-500 font-medium text-sm">See All</Text>
                    </View>

                    <View className="px-5 mt-3">
                        {RECOMMENDED.map((item, i) => (
                            <View key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4" style={{ elevation: 4 }}>
                                <Image source={{ uri: item.uri }} className="w-full h-44" resizeMode="cover" />
                                <View className="p-4">
                                    <View className="flex-row justify-between items-center mb-1.5">
                                        <Text className="font-bold text-gray-900 text-lg">{item.name}</Text>
                                        <View style={{ backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={star} style={{ width: 11, height: 11, marginRight: 4 }} resizeMode="contain" />
                                            <Text style={{ color: '#92400E', fontWeight: '700', fontSize: 11 }}>{item.score}</Text>
                                        </View>
                                    </View>
                                    <Text className="text-gray-400 text-xs mb-3 leading-4">{item.desc}</Text>
                                    <View className="flex-row justify-between items-center">
                                        <Text className="font-medium text-gray-500 text-xs">{item.dist}</Text>
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
                <View className="absolute bottom-0 w-full bg-white pt-3 pb-5 px-8 flex-row justify-between items-center border-t border-gray-100" style={{ elevation: 10 }}>
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Home")}>
                        <View className="w-1.5 h-1.5 rounded-full mb-1" />
                        <Text className="text-[13px] font-medium text-gray-400">Home</Text>
                    </TouchableOpacity>
                    <View className="items-center">
                        <View className="w-1.5 h-1.5 bg-blue-500 rounded-full mb-1" />
                        <Text className="text-[13px] font-bold text-blue-500">Explore</Text>
                    </View>
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Tour Planing")}>
                        <View className="w-1.5 h-1.5 rounded-full mb-1" />
                        <Text className="text-[13px] font-medium text-gray-400">Schedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Profile")}>
                        <View className="w-1.5 h-1.5 rounded-full mb-1" />
                        <Text className="text-[13px] font-medium text-gray-400">Profile</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );
}