import React, { useState, useEffect } from 'react';
import { View, Image, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useColorScheme } from 'nativewind';
import logo from '../assets/search.png';
import Sleep from '../assets/sleep.png';
import Locationping from '../assets/location-pin.png';
import Resturant from '../assets/dinner.png';
import Camara from '../assets/wireless.png';
import Star from '../assets/star.png';
import rest from '../assets/rest.png';
import sparkle from '../assets/sparkle.png';
import BASE_URL from '../config';
import { isLocationEnable } from './locationPref';
import { getSearchRadius } from './searchRadius';
import { getUserEmail, logBehaviour } from '../utils/prefUtils';

export default function Search() {
    const navigation = useNavigation();
    const route = useRoute();
    const dayID = route.params?.dayID;
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [search, setsearch] = useState('');
    const [searchResults, setSearchResults] = useState({ attractions: [], hotels: [], restaurants: [] });
    const [loading, setLoading] = useState(false);
    const [popular, setPopular] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [userEmail, setUserEmail] = useState(null);

    // Load user email on mount + fetch personalized suggestions
    useEffect(() => {
        (async () => {
            const email = await getUserEmail();
            setUserEmail(email);

            // Fetch popular attractions (always shown)
            fetch(`${BASE_URL}/popular`)
                .then(res => res.json())
                .then(data => setPopular(Array.isArray(data) ? data : []))
                .catch(() => setPopular([]));

            // Fetch personalized recommendations if logged in
            if (email) {
                let locationQuery = '';
                try {
                    const enabled = await isLocationEnable();
                    if (enabled) {
                        const { status } = await Location.requestForegroundPermissionsAsync();
                        if (status === 'granted') {
                            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                            if (loc?.coords) {
                                locationQuery = `&lat=${loc.coords.latitude}&lon=${loc.coords.longitude}`;
                            }
                        }
                    }
                } catch (e) {
                    // Ignore location error, proceed without lat/lon
                }

                fetch(`${BASE_URL}/recommendations/personal?email=${encodeURIComponent(email)}${locationQuery}`)
                    .then(res => res.json())
                    .then(data => setSuggestions(Array.isArray(data) ? data : []))
                    .catch(() => setSuggestions([]));
            }
        })();
    }, []);

    // Unified search: passes email for preference-ranked results
    const fetchSearchResults = async (query) => {
        try {
            if (!query) {
                setSearchResults({ attractions: [], hotels: [], restaurants: [] });
                return;
            }
            const emailParam = userEmail ? `&email=${encodeURIComponent(userEmail)}` : '';
            const res = await fetch(`${BASE_URL}/Search/All?q=${encodeURIComponent(query)}${emailParam}`);
            const data = await res.json();
            setSearchResults(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchHotelsNearMe = async () => {
        try {
            const Enable = await isLocationEnable();
            if (!Enable) {
                Alert.alert(
                    "Location Service off",
                    "Turn on Location Services in Permissions & Privacy to find hotels near you.",
                    [
                        { text: "Cancel", style: "cancel" },
                        { text: "Go to Settings", onPress: () => navigation.navigate("AppSettings") }
                    ]
                );
                return;
            }
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Allow location access to find hotels near you.");
                return;
            }
            setLoading(true);
            const locationData = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const { longitude, latitude } = locationData.coords;
            const radius = await getSearchRadius();
            const res = await fetch(`${BASE_URL}/Hotels/nearby?longitude=${longitude}&latitude=${latitude}&radius=${radius}`);
            const data = await res.json();
            navigation.navigate("Hotels", { hotels: data, dayID });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchResturantsNearMe = async () => {
        try {
            const Enable = await isLocationEnable();
            if (!Enable) {
                Alert.alert(
                    "Location Service off",
                    "Turn on Location Services in Permissions & Privacy to find restaurants near you.",
                    [
                        { text: "Cancel", style: "cancel" },
                        { text: "Go to Settings", onPress: () => navigation.navigate("AppSettings") }
                    ]
                );
                return;
            }
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Allow location access to find restaurants near you.");
                return;
            }
            setLoading(true);
            const locationData = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const { longitude, latitude } = locationData.coords;
            const radius = await getSearchRadius();
            const res = await fetch(`${BASE_URL}/Resturants/nearby?longitude=${longitude}&latitude=${latitude}&radius=${radius}`);
            const data = await res.json();
            navigation.navigate("Resturants", { resturant: data, dayID });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttractionsNearMe = async () => {
        try {
            const Enable = await isLocationEnable();
            if (!Enable) {
                Alert.alert(
                    "Location Service off",
                    "Turn on Location Services in Permissions & Privacy to find attractions near you.",
                    [
                        { text: "Cancel", style: "cancel" },
                        { text: "Go to Settings", onPress: () => navigation.navigate("AppSettings") }
                    ]
                );
                return;
            }
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Allow location access to find attractions near you.");
                return;
            }
            setLoading(true);
            const locationData = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const { longitude, latitude } = locationData.coords;
            const radius = await getSearchRadius();
            const res = await fetch(`${BASE_URL}/Attractions/nearby?longitude=${longitude}&latitude=${latitude}&radius=${radius}`);
            const data = await res.json();
            navigation.navigate("Attraction", { place: data, dayID });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Navigate and log the tap as a behaviour event
    const handleAttractionTap = (place) => {
        logBehaviour(userEmail, place, 'attraction');
        navigation.navigate("Attraction", { place, dayID });
    };

    const handleHotelTap = (hotel) => {
        logBehaviour(userEmail, hotel, 'hotel');
        navigation.navigate("Hotels", { hotels: [hotel], dayID });
    };

    const handleRestaurantTap = (r) => {
        logBehaviour(userEmail, r, 'restaurant');
        navigation.navigate("Resturants", { resturant: [r], dayID });
    };

    const hasResults =
        searchResults.attractions?.length > 0 ||
        searchResults.hotels?.length > 0 ||
        searchResults.restaurants?.length > 0;

    return (
        <SafeAreaProvider>
            <SafeAreaView className="bg-white dark:bg-gray-900 flex-1" edges={['top', 'left', 'right']}>

                {/* Header and Search */}
                <View className="px-5 pt-5 pb-3">
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Discover</Text>
                    <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-2xl py-3 px-4">
                        <Image source={logo} className="w-5 h-5 opacity-50" style={isDark ? { tintColor: 'white' } : {}} />
                        <TextInput
                            placeholder="Search places, activities..."
                            placeholderTextColor="#9CA3AF"
                            className="pl-3 text-[15px] flex-1 text-gray-700 dark:text-gray-300"
                            value={search}
                            onChangeText={(text) => {
                                setsearch(text);
                                fetchSearchResults(text);
                            }}
                        />
                    </View>
                </View>

                {/* ── Search Results Dropdown ── */}
                {hasResults && (
                    <ScrollView
                        className="px-2 mt-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 mx-5 absolute top-36 z-50 w-[87%]"
                        style={{ maxHeight: 300, elevation: isDark ? 0 : 8 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Attractions */}
                        {searchResults.attractions?.length > 0 && (
                            <View className="px-3 pt-2">
                                <Text className="text-xs font-bold text-rose-500 uppercase mb-1">Places</Text>
                                {searchResults.attractions.map((place, index) => (
                                    <TouchableOpacity
                                        key={`a-${index}`}
                                        onPress={() => handleAttractionTap(place)}
                                        className="border-b border-gray-100 dark:border-gray-700 py-2.5 flex-row items-center justify-between"
                                    >
                                        <View className="flex-1">
                                            <Text className="text-gray-800 dark:text-gray-200 text-base font-medium">{place.attraction_name}</Text>
                                            <Text className="text-gray-400 text-xs">{place.city}</Text>
                                        </View>
                                        {place.preferenceMatch && (
                                            <View className="bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-full ml-2 flex-row items-center">
                                                <Image source={sparkle} className="w-2.5 h-2.5 mr-1" style={{ tintColor: '#2563eb' }} />
                                                <Text className="text-blue-600 dark:text-blue-400 text-[10px] font-bold">For you</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Hotels */}
                        {searchResults.hotels?.length > 0 && (
                            <View className="px-3 pt-2">
                                <Text className="text-xs font-bold text-blue-500 uppercase mb-1">Hotels</Text>
                                {searchResults.hotels.map((hotel, index) => (
                                    <TouchableOpacity
                                        key={`h-${index}`}
                                        onPress={() => handleHotelTap(hotel)}
                                        className="border-b border-gray-100 dark:border-gray-700 py-2.5 flex-row items-center justify-between"
                                    >
                                        <View className="flex-1">
                                            <Text className="text-gray-800 dark:text-gray-200 text-base font-medium">{hotel.hotel_name}</Text>
                                            <Text className="text-gray-400 text-xs">{hotel.nearest_cities}</Text>
                                        </View>
                                        {hotel.preferenceMatch && (
                                            <View className="bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-full ml-2 flex-row items-center">
                                                <Image source={sparkle} className="w-2.5 h-2.5 mr-1" style={{ tintColor: '#2563eb' }} />
                                                <Text className="text-blue-600 dark:text-blue-400 text-[10px] font-bold">For you</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Restaurants */}
                        {searchResults.restaurants?.length > 0 && (
                            <View className="px-3 pt-2 pb-2">
                                <Text className="text-xs font-bold text-emerald-500 uppercase mb-1">Food</Text>
                                {searchResults.restaurants.map((r, index) => (
                                    <TouchableOpacity
                                        key={`r-${index}`}
                                        onPress={() => handleRestaurantTap(r)}
                                        className="border-b border-gray-100 dark:border-gray-700 py-2.5 flex-row items-center justify-between"
                                    >
                                        <View className="flex-1">
                                            <Text className="text-gray-800 dark:text-gray-200 text-base font-medium">{r.restaurant_name}</Text>
                                            <Text className="text-gray-400 text-xs">{r.cuisine_type} · {r.city}</Text>
                                        </View>
                                        {r.preferenceMatch && (
                                            <View className="bg-emerald-50 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full ml-2 flex-row items-center">
                                                <Image source={sparkle} className="w-2.5 h-2.5 mr-1" style={{ tintColor: '#059669' }} />
                                                <Text className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">For you</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                )}

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                    {/* Category Buttons */}
                    <View className="flex-row px-5 pt-2 pb-3">
                        <TouchableOpacity className="flex-1 mr-2" onPress={() => navigation.navigate("Hotels", { dayID })}>
                            <View className="bg-blue-50 dark:bg-blue-900/30 h-16 rounded-2xl justify-center items-center flex-row border border-blue-100 dark:border-blue-800">
                                <Image source={Sleep} className="h-7 w-7" />
                                <Text className="text-blue-600 dark:text-blue-400 text-sm font-bold pl-2">Hotels</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-1 mx-1" onPress={() => navigation.navigate("Resturants", { dayID })}>
                            <View className="bg-emerald-50 dark:bg-emerald-900/30 h-16 rounded-2xl justify-center items-center flex-row border border-emerald-100 dark:border-emerald-800">
                                <Image source={rest} className="h-7 w-7" />
                                <Text className="text-emerald-600 dark:text-emerald-400 text-sm font-bold pl-2">Foods</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-1 ml-2" onPress={() => navigation.navigate("Attraction", { dayID })}>
                            <View className="bg-rose-50 dark:bg-rose-900/30 h-16 rounded-2xl justify-center items-center flex-row border border-rose-100 dark:border-rose-800">
                                <Image source={Locationping} className="h-6 w-6" />
                                <Text className="text-rose-500 dark:text-rose-400 text-sm font-bold pl-2">Places</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Popular Searches */}
                    <View className="px-5 pt-4">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white">Popular Searches</Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
                        <View className="flex-row px-5">
                            {popular.map((place, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleAttractionTap(place)}
                                    className="rounded-2xl overflow-hidden mr-3 relative w-44"
                                    style={{ elevation: isDark ? 0 : 4 }}
                                >
                                    <Image
                                        source={{ uri: place.image_url }}
                                        className="h-36 w-full"
                                        resizeMode="cover"
                                    />
                                    {(place.preferenceMatch || (place.preferenceScore != null && place.preferenceScore > 0)) && (
                                        <View className="absolute top-2.5 left-2.5 bg-rose-500 px-2.5 py-1 rounded-full z-10 shadow-md flex-row items-center">
                                            <Image source={sparkle} className="w-3 h-3 mr-1" style={{ tintColor: 'white' }} />
                                            <Text className="text-white text-[10px] font-bold">Suggested for you</Text>
                                        </View>
                                    )}
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

                    {/* Explore Quickly */}
                    <View className="px-5 pt-6">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">Explore Quickly</Text>
                    </View>

                    <View className="px-5">
                        <View className="flex-row flex-wrap justify-between">
                            <TouchableOpacity onPress={fetchHotelsNearMe} className="w-[48%] mb-3">
                                <View className="h-14 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex-row items-center px-3"
                                    style={{ elevation: isDark ? 0 : 2 }}>
                                    <View className="bg-blue-50 dark:bg-blue-900/30 rounded-xl w-10 h-10 justify-center items-center">
                                        <Image source={Sleep} className="h-5 w-5" />
                                    </View>
                                    <Text className="text-gray-800 dark:text-gray-200 text-[15px] pl-3 font-medium flex-1">Hotels near me</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={fetchAttractionsNearMe} className="w-[48%] mb-3">
                                <View className="h-14 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex-row items-center px-3"
                                    style={{ elevation: isDark ? 0 : 2 }}>
                                    <View className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl w-10 h-10 justify-center items-center">
                                        <Image source={Locationping} className="h-5 w-5" />
                                    </View>
                                    <Text className="text-gray-800 dark:text-gray-200 text-[15px] pl-3 font-medium flex-1">Attractions near me</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={fetchResturantsNearMe} className="w-[48%] mb-3">
                                <View className="h-14 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex-row items-center px-3"
                                    style={{ elevation: isDark ? 0 : 2 }}>
                                    <View className="bg-orange-50 dark:bg-orange-900/30 rounded-xl w-10 h-10 justify-center items-center">
                                        <Image source={Resturant} className="h-5 w-5" />
                                    </View>
                                    <Text className="text-gray-800 dark:text-gray-200 text-[15px] pl-3 font-medium flex-1">Restaurants near me</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate("PhotoSpots", { dayID })} className="w-[48%] mb-3">
                                <View className="h-14 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex-row items-center px-3"
                                    style={{ elevation: isDark ? 0 : 2 }}>
                                    <View className="bg-violet-50 dark:bg-violet-900/30 rounded-xl w-10 h-10 justify-center items-center">
                                        <Image source={Camara} className="h-5 w-5" />
                                    </View>
                                    <Text className="text-gray-800 dark:text-gray-200 text-[15px] pl-3 font-medium flex-1">Photography spots</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ── Suggested For You (real preference-matched data) ── */}
                    <View className="px-5 pt-5">
                        <View className="flex-row items-center mb-3">
                            <Text className="text-lg font-bold text-gray-900 dark:text-white flex-1">
                                {userEmail ? 'Suggested for you' : 'Top Picks'}
                            </Text>
                            {userEmail && (
                                <View className="bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full flex-row items-center">
                                    <Image source={sparkle} className="w-2.5 h-2.5 mr-1" style={{ tintColor: '#2563eb' }} />
                                    <Text className="text-blue-600 dark:text-blue-400 text-[10px] font-bold">Based on your preferences</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View className="px-5">
                        {suggestions.length > 0 ? (
                            suggestions.map((place, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="mb-3"
                                    activeOpacity={0.8}
                                    onPress={() => handleAttractionTap(place)}
                                >
                                    <View className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex-row p-3 items-center"
                                        style={{ elevation: isDark ? 0 : 3 }}>
                                        <View className="relative">
                                            {place.image_url ? (
                                                <Image
                                                    source={{ uri: place.image_url }}
                                                    className="h-16 w-16 rounded-xl"
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View className="h-16 w-16 rounded-xl bg-gray-100 dark:bg-gray-700 justify-center items-center">
                                                    <Image source={Locationping} className="h-7 w-7 opacity-40" />
                                                </View>
                                            )}
                                            {(place.preferenceMatch || (place.preferenceScore != null && place.preferenceScore > 0)) && (
                                                <View className="absolute top-1 left-1 bg-rose-500 px-1.5 py-0.5 rounded-full z-10 shadow-sm flex-row items-center">
                                                    <Image source={sparkle} className="w-2 h-2 mr-0.5" style={{ tintColor: 'white' }} />
                                                    <Text className="text-white text-[8px] font-bold">Suggested</Text>
                                                </View>
                                            )}
                                        </View>
                                        <View className="flex-1 pl-3 justify-center">
                                            <Text className="text-gray-900 dark:text-white font-bold text-base" numberOfLines={1}>
                                                {place.attraction_name}
                                            </Text>
                                            <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                                                {place.category} · {place.city}
                                            </Text>
                                            {place.preferenceMatch && (
                                                <View className="flex-row items-center mt-1">
                                                    <Image source={sparkle} className="w-2.5 h-2.5 mr-1" style={{ tintColor: '#f43f5e' }} />
                                                    <Text className="text-rose-500 dark:text-rose-400 text-[10px] font-bold">Suggested for you</Text>
                                                </View>
                                            )}
                                        </View>
                                        <View className="items-center bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1.5 rounded-xl">
                                            <Image source={Star} className="h-3.5 w-3.5 mb-0.5" />
                                            <Text className="text-amber-600 dark:text-amber-400 font-bold text-xs">
                                                {place.rating || 'N/A'}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            // Fallback: show popular picks while suggestions load
                            popular.slice(0, 3).map((place, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="mb-3"
                                    activeOpacity={0.8}
                                    onPress={() => handleAttractionTap(place)}
                                >
                                    <View className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex-row p-3 items-center"
                                        style={{ elevation: isDark ? 0 : 3 }}>
                                        {place.image_url ? (
                                            <Image source={{ uri: place.image_url }} className="h-16 w-16 rounded-xl" resizeMode="cover" />
                                        ) : (
                                            <View className="h-16 w-16 rounded-xl bg-gray-100 dark:bg-gray-700 justify-center items-center">
                                                <Image source={Locationping} className="h-7 w-7 opacity-40" />
                                            </View>
                                        )}
                                        <View className="flex-1 pl-3 justify-center">
                                            <Text className="text-gray-900 dark:text-white font-bold text-base" numberOfLines={1}>
                                                {place.attraction_name}
                                            </Text>
                                            <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1">{place.city}</Text>
                                        </View>
                                        <View className="items-center bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1.5 rounded-xl">
                                            <Image source={Star} className="h-3.5 w-3.5 mb-0.5" />
                                            <Text className="text-amber-600 dark:text-amber-400 font-bold text-xs">
                                                {place.rating || 'N/A'}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>

                </ScrollView>

            </SafeAreaView>
        </SafeAreaProvider>
    );
}