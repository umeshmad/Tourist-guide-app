import React, { useState, useEffect } from 'react';
import '../global.css';
import { Image, Text, ScrollView, TextInput, View, TouchableOpacity, FlatList, Linking, Alert, Modal } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import logo from '../assets/search.png';
import star from '../assets/star.png';
import drop from '../assets/drop.png';
import dropw from '../assets/drop-w.png';
import location from '../assets/location-pin.png';
import { useRoute } from '@react-navigation/native';
import BASE_URL from '../config';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Resturants() {

    const [resturant, setResturant] = useState([]);
    const [selected, setSelected] = useState('ALL');
    const Route = useRoute();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [originalResturant, setOriginalResturant] = useState([]);
    const [expand, setExpand] = useState(null);
    const navigation = useNavigation();
    const [nearby, setNearBy] = useState([]);
    const [slotModelFor, setSlotModelFor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState({});

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const addToTasks = async (resturant) => {
        try {
            const dayID = Route.params?.dayID || 1;
            const storageKey = `task_day_${dayID}`;
            const saved = await AsyncStorage.getItem(storageKey);
            const tasks = saved ? JSON.parse(saved) : [];
            const exists = tasks.some(t => t.restaurant_name === resturant.restaurant_name);
            if (!exists) {
                tasks.push(resturant);
                await AsyncStorage.setItem(storageKey, JSON.stringify(tasks));
            }
            navigation.replace('Tour Planing');
        } catch (err) {
            console.error('Failed to save resturant task:', err);
        }
    };

    const openMap = (link) => {
        if (link) Linking.openURL(link).catch(() => Alert.alert('Error', 'Could not open map'));
    };

    const proxyImage = (rawUrl) => {
        if (!rawUrl) return null;
        const url = rawUrl.replace(/^"|"$/g, '').trim();
        return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=400`;
    };

    useEffect(() => {
        if (Route.params?.resturant) {
            const resturantParam = Route.params.resturant;
            setResturant(Array.isArray(resturantParam) ? resturantParam : [resturantParam]);
            if (Route.params?.filterLabel) {
                setSelected(Route.params.filterLabel);
            }
        } else {
            const fetchAllResturants = async () => {
                try {
                    setLoading(true);
                    const res = await fetch(`${BASE_URL}/Resturants${selected !== 'ALL' ? `?category=${selected}` : ''}`);
                    const data = await res.json();
                    setResturant(data);
                    setOriginalResturant(data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchAllResturants();
        }
    }, [Route.params, selected]);

    const fetchResturants = async (query, category = selected) => {
        try {
            let url = `${BASE_URL}/Resturants`;
            if (query && category !== 'ALL') {
                url += `?q=${query}&category=${category}`;
            } else if (query) {
                url += `?q=${query}`;
            } else if (category !== 'ALL') {
                url += `?category=${category}`;
            }
            setLoading(true);
            const res = await fetch(url);
            const text = await res.text();
            const data = JSON.parse(text);
            setResturant(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const populerResturants = resturant.filter(r => r.review_count >= 380);

    const fetchNearBY = async (nearbyString) => {
        try {
            if (!nearbyString) return;
            const names = nearbyString.split(';').map(t => t.trim()).join(',');
            const res = await fetch(`${BASE_URL}/Attraction/nearby?names=${encodeURIComponent(names)}`);
            const data = await res.json();
            setNearBy(data);
        } catch (err) {
            console.error(err);
        }
    };

    const Attraction_Slots = [
        { key: 'BreakFast', label: 'Breakfast' },
        { key: 'Lunch', label: 'Lunch' },
        { key: 'Dinner', label: 'Dinner' }
    ];

    const openSlotPicker = (resturant, index) => setSlotModelFor({ resturant, index });
    const confermSlot = (slotKey) => {
        const { resturant, index } = slotModelFor;
        setSelectedSlot(prev => ({ ...prev, [index]: slotKey }));
        setSlotModelFor(null);
        addToTasks({ ...resturant, slot: slotKey })
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className="bg-white dark:bg-gray-900 flex-1" edges={['top', 'right', 'left']}>

                {/* Search Bar */}
                <View className="px-4 pt-6 pb-3">
                    <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-2xl py-3 px-4">
                        <Image source={logo} className="w-5 h-5 opacity-50" style={isDark ? { tintColor: 'white' } : {}} />
                        <TextInput
                            placeholder="Search restaurants, cuisine, city..."
                            placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
                            className="pl-3 text-[14px] flex-1 text-gray-800 dark:text-gray-200"
                            onChangeText={(text) => { setSearch(text); fetchResturants(text, selected); }}
                        />
                    </View>
                </View>

                {/* Category */}
                <View className="flex-row px-4 pb-3 w-full justify-between">
                    {['ALL', 'Italian', 'Chinese', 'Sri Lankan'].map((item, index, arr) => (
                        <TouchableOpacity
                            key={item}
                            onPress={() => { setSelected(item); fetchResturants(search, item); }}
                            className={`flex-1 items-center justify-center rounded-full py-2.5 ${index < arr.length - 1 ? 'mr-2' : ''} border ${selected === item ? 'bg-orange-500 border-orange-500' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
                        >
                            <Text className={`text-xs font-bold ${selected === item ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} numberOfLines={1}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Popular Restaurants */}
                {populerResturants.length > 0 && (
                    <View className="px-4 pb-2">
                        <Text className="text-gray-900 dark:text-white font-extrabold text-xl mb-3">Popular Restaurants</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {populerResturants.map((r, index) => (
                                <View key={index} className="rounded-2xl overflow-hidden mr-4 border border-gray-100 dark:border-gray-700 w-60 h-44" style={{ elevation: isDark ? 0 : 3 }}>
                                    <Image source={{ uri: r.image_url_1 }} className="h-full w-full absolute" resizeMode="cover" />
                                    <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/45 justify-end p-4">
                                        <Text className="text-white font-bold text-base" numberOfLines={1}>{r.restaurant_name.replace(/ Restaurant$/i, '')}</Text>
                                        <Text className="text-gray-300 text-xs mt-0.5">{r.amenity_type} • {r.dining_type}</Text>
                                        <View className="flex-row items-center mt-1">
                                            <Image source={star} className="h-3 w-3" />
                                            <Text className="text-white text-xs font-semibold pl-1">{r.rating}</Text>
                                            <Text className="text-gray-300 text-xs pl-1.5">({r.review_count})</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* All Restaurants */}
                <View className="px-4 pt-3 pb-2">
                    <Text className="text-gray-900 dark:text-white font-extrabold text-xl">All Restaurants</Text>
                    <Text className="text-gray-400 text-sm">{resturant.length} restaurants found</Text>
                </View>

                <FlatList
                    data={resturant}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
                    renderItem={({ item: resturant, index }) => (
                        <View className="mb-3">

                            {/* Collapsed Card */}
                            {expand !== index && (
                                <TouchableOpacity
                                    onPress={() => { setExpand(index); fetchNearBY(resturant.nearby_attractions); }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 w-full overflow-hidden"
                                    style={{ elevation: isDark ? 0 : 3 }}
                                    activeOpacity={0.92}
                                >
                                    {/* Image */}
                                    <View className="relative h-36 w-full">
                                        <Image
                                            source={{ uri: proxyImage(resturant.image_url_1) }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                        {/* Dining type */}
                                        <View className="absolute top-3 left-3 bg-orange-500 rounded-xl px-2.5 py-1">
                                            <Text className="text-white text-xs font-bold">{resturant.dining_type || resturant.amenity_type}</Text>
                                        </View>
                                        {/* Rating */}
                                        <View className="absolute top-3 right-3 bg-white dark:bg-gray-900 rounded-xl px-2.5 py-1.5" style={{ elevation: isDark ? 0 : 4 }}>
                                            <Text className="text-amber-500 font-extrabold text-sm">★ {resturant.rating}</Text>
                                        </View>
                                    </View>

                                    {/* Info Row */}
                                    <View className="px-4 py-3 flex-row items-center justify-between">
                                        <View className="flex-1 pr-3">
                                            <Text className="text-gray-900 dark:text-white text-base font-bold" numberOfLines={1}>{resturant.restaurant_name}</Text>
                                            <Text className="text-gray-400 text-xs mt-0.5">{resturant.amenity_type} • {resturant.cuisine_type}{resturant.distanceKm ? ` • ${resturant.distanceKm} km away` : ''}</Text>
                                            <Text className="text-gray-300 dark:text-gray-500 text-xs mt-0.5">({resturant.review_count} reviews)</Text>
                                        </View>
                                        <View className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-500 rounded-xl px-3 py-1.5">
                                            <Text className="text-orange-500 dark:text-orange-400 text-xs font-bold">View</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}

                            {/* Expanded Card */}
                            {expand === index && (
                                <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 w-full mb-2 overflow-hidden" style={{ elevation: isDark ? 0 : 3 }}>

                                    <Image source={{ uri: proxyImage(resturant.image_url_1) }} className="w-full h-52" resizeMode="cover" style={{ width: '100%', height: 208 }} />

                                    <TouchableOpacity onPress={() => { setExpand(null); setNearBy([]); }} className="absolute right-4 top-4 bg-black/40 rounded-full p-2">
                                        <Image source={dropw} className="h-5 w-5" />
                                    </TouchableOpacity>

                                    <View className="absolute top-4 left-4 bg-orange-500 rounded-2xl px-3 py-1">
                                        <Text className="text-white text-xs font-bold">{resturant.dining_type}</Text>
                                    </View>

                                    <View className="p-4 bg-white dark:bg-gray-800">

                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-1 pr-2">
                                                <Text className="text-xl text-black dark:text-white font-bold">{resturant.restaurant_name}</Text>
                                                <View className="flex-row items-center mt-1">
                                                    <Image source={star} className="h-4 w-4" />
                                                    <Text className="text-l font-medium text-black dark:text-white pl-2">{resturant.rating}</Text>
                                                    <Text className="text-xs text-gray-400 pl-2">({resturant.review_count} reviews)</Text>
                                                </View>
                                            </View>
                                            <View className="bg-orange-100 dark:bg-orange-900/40 rounded-lg px-2 py-1">
                                                <Text className="text-orange-600 dark:text-orange-400 text-xs font-bold">{resturant.cuisine_type}</Text>
                                            </View>
                                        </View>

                                        <View className="flex-row items-center mt-2">
                                            <Image source={location} className="h-4 w-4" />
                                            <Text className="text-sm text-gray-500 dark:text-gray-400 pl-2">{resturant.address}, {resturant.city}, {resturant.district}, {resturant.province}{resturant.distanceKm ? ` • ${resturant.distanceKm} km away` : ''}</Text>
                                        </View>

                                        {resturant.vegetarian_friendly === 'Yes' && (
                                            <View className="flex-row items-center mt-2">
                                                <View className="bg-green-100 dark:bg-green-900/30 rounded-2xl px-3 py-1">
                                                    <Text className="text-green-600 dark:text-green-400 text-xs font-bold">Vegetarian Friendly</Text>
                                                </View>
                                            </View>
                                        )}

                                        <View className="h-[1px] bg-gray-200 dark:bg-gray-700 my-4" />

                                        {(resturant.opening_hours || resturant.phone || resturant.website) && (
                                            <View className="flex-row flex-wrap py-3">
                                                {resturant.opening_hours ? (
                                                    <View className="w-full my-1 flex-row items-center">
                                                        <Text className="text-gray-400 text-xs font-semibold mr-1">Hours:</Text>
                                                        <Text className="text-gray-700 dark:text-gray-300 text-xs font-bold flex-1">{resturant.opening_hours}</Text>
                                                    </View>
                                                ) : null}
                                                {resturant.phone ? (
                                                    <View className="w-full my-1 flex-row items-center">
                                                        <Text className="text-gray-400 text-xs font-semibold mr-1">Phone:</Text>
                                                        <Text className="text-gray-700 dark:text-gray-300 text-xs font-bold">{resturant.phone}</Text>
                                                    </View>
                                                ) : null}
                                                {resturant.website ? (
                                                    <View className="w-full my-1 flex-row items-center">
                                                        <Text className="text-gray-400 text-xs font-semibold mr-1">Website:</Text>
                                                        <TouchableOpacity onPress={() => Linking.openURL(resturant.website)}>
                                                            <Text className="text-orange-500 dark:text-orange-400 text-xs font-bold" numberOfLines={1}>{resturant.website}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                ) : null}
                                            </View>
                                        )}

                                        {nearby.length > 0 && (
                                            <View className="mt-4">
                                                <Text className="text-black dark:text-white font-bold text-l mb-2">Nearby Attractions</Text>
                                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                    {nearby.map((place, index) => (
                                                        <TouchableOpacity onPress={() => navigation.navigate("Attraction", {
                                                            selectAttraction: place,
                                                            expand: true
                                                        })}>
                                                            <View key={index} className="mr-3 w-44 bg-white dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                                                                <Image source={{ uri: proxyImage(place.image_url) }} style={{ width: 176, height: 110 }} resizeMode="cover" />
                                                                <View className="p-2">
                                                                    <Text className="text-black dark:text-white font-bold text-xs" numberOfLines={1}>{place.attraction_name}</Text>
                                                                    <View className="flex-row items-center mt-1">
                                                                        <Image source={star} className="h-3 w-3" />
                                                                        <Text className="text-xs text-black dark:text-white pl-1">{place.rating}</Text>
                                                                    </View>
                                                                    <Text className="text-gray-400 dark:text-gray-400 text-xs mt-1" numberOfLines={2}>{place.description}</Text>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        )}

                                        <View className="h-[1px] bg-gray-200 dark:bg-gray-700 my-4" />

                                        <View className="flex-row justify-between items-center">
                                            <TouchableOpacity onPress={() => openMap(resturant.google_maps_link)} className="flex-1 border border-orange-500 rounded-3xl py-3 mr-2 justify-center items-center">
                                                <Text className="text-orange-500 text-l font-bold">Map</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => openSlotPicker(resturant, index)} className="flex-1 bg-orange-500 rounded-3xl py-3 ml-2 justify-center items-center">
                                                <Text className="text-white text-l font-bold">+ Add to Plan</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                </View>
                            )}

                        </View>
                    )}
                />

            </SafeAreaView>
            <Modal visible={!!slotModelFor} transparent animationType='fade' onRequestClose={() => setSlotModelFor(null)}>
                <View className="flex-1 bg-black/40 justify-center items-center">
                    <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 w-72">
                        <Text className="text-gray-900 dark:text-white font-bold text-base mb-3">When is this for?</Text>
                        {Attraction_Slots.map((s) => (
                            <TouchableOpacity key={s.key} onPress={() => confermSlot(s.key)} className="flex-row items-center py-2.5">
                                <View className="w-5 h-5 rounded-full border-2 border-orange-400 mr-3" />
                                <Text className="text-gray-700 dark:text-gray-300 text-sm">{s.label}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={() => setSlotModelFor(null)} className="mt-2">
                            <Text className="text-gray-400 text-xs text-center">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaProvider>
    );
}