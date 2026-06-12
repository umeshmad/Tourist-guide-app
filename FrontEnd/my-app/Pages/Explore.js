import "../global.css";
import React from "react";
import { Text, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import explore from '../assets/explore.jpg';
import { useNavigation } from "@react-navigation/native";
import Sleep from '../assets/sleep.png';
import rest from '../assets/rest.png';
import Locationping from '../assets/location-pin.png';
import Hiking from '../assets/hiking.png';

const RECOMMENDED = [
    {
        name: "Browns Beach",
        desc: "A stunning coastline with golden sands and clear waters, perfect for relaxing and swimming.",
        dist: "0.5 Km away",
        rating: "4.8 ★",
        uri: "https://res.cloudinary.com/dojoopvkn/image/upload/v1780993591/photo%20spots/Mirissa%20Beach.jpg",
    },
    {
        name: "Negombo Fort",
        desc: "Explore the historic ruins and learn about the Dutch colonial period in Sri Lanka.",
        dist: "1.2 Km away",
        rating: "4.5 ★",
        uri: "https://res.cloudinary.com/dojoopvkn/image/upload/v1780994134/photo%20spots/Nine%20Arch%20Bridge.jpg",
    },
];

export default function Explore() {
    const navigation = useNavigation();
    return (
        <SafeAreaProvider>
            <SafeAreaView className="bg-white flex-1" edges={['top', 'left', 'right']}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

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

                    {/* Recommended */}
                    <View className="flex-row justify-between items-center px-5 pt-6 pb-1">
                        <Text className="text-lg font-bold text-gray-900">Recommended</Text>
                        <Text className="text-blue-500 font-medium text-sm">See All</Text>
                    </View>

                    <View className="px-5 mt-3">
                        {RECOMMENDED.map((item, i) => (
                            <View key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4" style={{ elevation: 4 }}>
                                <Image source={{ uri: item.uri }} className="w-full h-44" resizeMode="cover" />
                                <View className="p-4">
                                    <View className="flex-row justify-between items-center mb-1.5">
                                        <Text className="font-bold text-gray-900 text-lg">{item.name}</Text>
                                        <View className="bg-amber-50 px-2 py-1 rounded-lg flex-row items-center">
                                            <Text className="text-amber-600 font-bold text-xs">{item.rating}</Text>
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