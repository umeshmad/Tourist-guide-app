import React, { useState, useEffect } from 'react';
import { View, Image, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import logo from '../assets/search.png';
import Sleep from '../assets/sleep.png';
import Hiking from '../assets/hiking.png';
import Locationping from '../assets/location-pin.png';
import Eiffel from '../assets/Eiffel.jpg';
import Resturant from '../assets/dinner.png';
import Camara from '../assets/wireless.png';
import Star from '../assets/star.png';
import Place1 from '../assets/place1.jpg';
import Place2 from '../assets/place2.jpg';
import BASE_URL from '../config';
import rest from '../assets/rest.png';
import Resturants from './Resturants';


export default function Search() {
    const navigation = useNavigation();
    const route = useRoute();
    const dayID = route.params?.dayID;
    const [search, setsearch] = useState();
    const [searchResults, setSearchResults] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [hotels, setHotels] = useState();
    const [hotelSearchResult, setHotelSearchResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [popular, setPopular] = useState([]);


    const fetchSearchResults = async (query) => {
        try {
            if (!query) {
                setSearchResults([]);
                return;
            }
            const res = await fetch(`${BASE_URL}/search?q=${query}`);
            const data = await res.json();
            setSearchResults(data);
        } catch (err) {
            console.error(err);
        }
    };
    const fetchHotelsNearMe = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Allow location access to find hotels near you.");
                return;
            }
            setLoading(true);
            const locationData = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const { longitude, latitude } = locationData.coords;
            setUserLocation({ longitude, latitude });

            const res = await fetch(`${BASE_URL}/Hotels/nearby?longitude=${longitude}&latitude=${latitude}`);
            const data = await res.json();

            navigation.navigate("Hotels", { hotels: data, dayID })
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch(`${BASE_URL}/popular`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPopular(data);
                } else {
                    setPopular([]);
                }
            })
            .catch(() => {
                setPopular([]);
            });
    }, []);

    const fetchItalianResturants = async () => {
        try {
            const italian = await fetch(`${BASE_URL}/Resturants?category=Italian`)
            const data = await italian.json();
            navigation.navigate("Resturants", { resturant: data, filterLabel: "Italian", dayID })
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className="bg-white flex-1" edges={['top', 'left', 'right']}>

                {/* Header and Search */}
                <View className="px-5 pt-5 pb-3">
                    <Text className="text-2xl font-bold text-gray-900 mb-4">Discover</Text>
                    <View className="flex-row items-center bg-gray-100 rounded-2xl py-3 px-4">
                        <Image source={logo} className="w-5 h-5 opacity-50" />
                        <TextInput
                            placeholder="Search places, activities..."
                            placeholderTextColor="#9CA3AF"
                            className="pl-3 text-[15px] flex-1 text-gray-700"
                            onChangeText={(text) => {
                                setsearch(text);
                                fetchSearchResults(text);
                            }}
                        />
                    </View>
                </View>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <ScrollView className="px-5 mt-1 bg-white rounded-2xl border border-gray-100 mx-5 absolute top-36 z-50 w-[87%]"
                        style={{ maxHeight: 200, elevation: 8 }}>
                        {searchResults.map((place, index) => (
                            <View
                                key={index}
                                className="border-b border-gray-100 py-3 px-1"
                            >
                                <Text className="text-gray-800 text-base font-medium">{place.attraction_name}</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                    {/* Category Buttons */}
                    <View className="flex-row px-5 pt-2 pb-3">
                        <TouchableOpacity className="flex-1 mr-2" onPress={() => navigation.navigate("Hotels", { dayID })}>
                            <View className="bg-blue-50 h-16 rounded-2xl justify-center items-center flex-row border border-blue-100">
                                <Image source={Sleep} className="h-7 w-7" />
                                <Text className="text-blue-600 text-sm font-bold pl-2">Hotels</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-1 mx-1" onPress={() => navigation.navigate("Resturants", { dayID })}>
                            <View className="bg-emerald-50 h-16 rounded-2xl justify-center items-center flex-row border border-emerald-100">
                                <Image source={rest} className="h-7 w-7" />
                                <Text className="text-emerald-600 text-sm font-bold pl-2">Foods</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-1 ml-2" onPress={() => navigation.navigate("Attraction", { dayID })}>
                            <View className="bg-rose-50 h-16 rounded-2xl justify-center items-center flex-row border border-rose-100">
                                <Image source={Locationping} className="h-6 w-6" />
                                <Text className="text-rose-500 text-sm font-bold pl-2">Places</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Popular Searches */}
                    <View className="px-5 pt-4">
                        <Text className="text-lg font-bold text-gray-900">Popular Searches</Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
                        <View className="flex-row px-5">
                            {popular.map((place, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        navigation.navigate("Attraction", { place, dayID });
                                    }}
                                    className="rounded-2xl overflow-hidden mr-3 relative w-44"
                                    style={{ elevation: 4 }}>
                                    <Image
                                        source={{ uri: place.image_url }}
                                        className="h-36 w-full"
                                        resizeMode="cover"
                                    />
                                    <View className="absolute bg-black/40 top-0 left-0 right-0 bottom-0 justify-end p-3 rounded-2xl">
                                        <Text className="text-white font-bold text-sm" numberOfLines={1}>
                                            {place.attraction_name}
                                        </Text>
                                        <Text className="text-white/70 text-xs mt-1">{place.city}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Recent Searches */}
                    <View className="px-5 pt-6">
                        <Text className="text-lg font-bold text-gray-900 mb-3">Recent Searches</Text>
                    </View>

                    <View className="px-5">
                        <TouchableOpacity onPress={fetchHotelsNearMe}>
                            <View className="h-14 bg-white border border-gray-100 rounded-2xl flex-row items-center px-3 mb-3"
                                style={{ elevation: 2 }}>
                                <View className="bg-blue-50 rounded-xl w-10 h-10 justify-center items-center">
                                    <Image source={Sleep} className="h-5 w-5" />
                                </View>
                                <Text className="text-gray-800 text-[15px] pl-3 font-medium flex-1">Hotels near me</Text>
                                <Text className="text-gray-300 text-lg">›</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <View className="h-14 bg-white border border-gray-100 rounded-2xl flex-row items-center px-3 mb-3"
                                style={{ elevation: 2 }}>
                                <View className="bg-emerald-50 rounded-xl w-10 h-10 justify-center items-center">
                                    <Image source={Hiking} className="h-5 w-5" />
                                </View>
                                <Text className="text-gray-800 text-[15px] pl-3 font-medium flex-1">Tours near me</Text>
                                <Text className="text-gray-300 text-lg">›</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={fetchItalianResturants}>
                            <View className="h-14 bg-white border border-gray-100 rounded-2xl flex-row items-center px-3 mb-3"
                                style={{ elevation: 2 }}>
                                <View className="bg-orange-50 rounded-xl w-10 h-10 justify-center items-center">
                                    <Image source={Resturant} className="h-5 w-5" />
                                </View>
                                <Text className="text-gray-800 text-[15px] pl-3 font-medium flex-1">Italian Restaurants</Text>
                                <Text className="text-gray-300 text-lg">›</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate("PhotoSpots", { dayID })}>
                            <View className="h-14 bg-white border border-gray-100 rounded-2xl flex-row items-center px-3 mb-3"
                                style={{ elevation: 2 }}>
                                <View className="bg-violet-50 rounded-xl w-10 h-10 justify-center items-center">
                                    <Image source={Camara} className="h-5 w-5" />
                                </View>
                                <Text className="text-gray-800 text-[15px] pl-3 font-medium flex-1">Photography spots</Text>
                                <Text className="text-gray-300 text-lg">›</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Suggested For You */}
                    <View className="px-5 pt-5">
                        <Text className="text-lg font-bold text-gray-900 mb-3">Suggested for you</Text>
                    </View>

                    <View className="px-5">
                        <View className="mb-3">
                            <View className="w-full bg-white border border-gray-100 rounded-2xl flex-row p-3 items-center"
                                style={{ elevation: 3 }}>
                                <Image source={Eiffel} className="h-16 w-16 rounded-xl" />
                                <View className="flex-1 pl-3 justify-center">
                                    <Text className="text-gray-900 font-bold text-base">Eiffel Tower</Text>
                                    <Text className="text-gray-400 text-xs mt-1">Historic landmark</Text>
                                </View>
                                <View className="items-center bg-amber-50 px-2.5 py-1.5 rounded-xl">
                                    <Image source={Star} className="h-3.5 w-3.5 mb-0.5" />
                                    <Text className="text-amber-600 font-bold text-xs">4.8</Text>
                                </View>
                            </View>
                        </View>

                        <View className="mb-3">
                            <View className="w-full bg-white border border-gray-100 rounded-2xl flex-row p-3 items-center"
                                style={{ elevation: 3 }}>
                                <Image source={Place1} className="h-16 w-16 rounded-xl" />
                                <View className="flex-1 pl-3 justify-center">
                                    <Text className="text-gray-900 font-bold text-base">Louvre Museum</Text>
                                    <Text className="text-gray-400 text-xs mt-1">Art & Culture</Text>
                                </View>
                                <View className="items-center bg-amber-50 px-2.5 py-1.5 rounded-xl">
                                    <Image source={Star} className="h-3.5 w-3.5 mb-0.5" />
                                    <Text className="text-amber-600 font-bold text-xs">4.9</Text>
                                </View>
                            </View>
                        </View>

                        <View className="mb-3">
                            <View className="w-full bg-white border border-gray-100 rounded-2xl flex-row p-3 items-center"
                                style={{ elevation: 3 }}>
                                <Image source={Place2} className="h-16 w-16 rounded-xl" />
                                <View className="flex-1 pl-3 justify-center">
                                    <Text className="text-gray-900 font-bold text-base">Notre Dame</Text>
                                    <Text className="text-gray-400 text-xs mt-1">Historic landmark</Text>
                                </View>
                                <View className="items-center bg-amber-50 px-2.5 py-1.5 rounded-xl">
                                    <Image source={Star} className="h-3.5 w-3.5 mb-0.5" />
                                    <Text className="text-amber-600 font-bold text-xs">4.7</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                </ScrollView>

            </SafeAreaView>
        </SafeAreaProvider>
    )
}