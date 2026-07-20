import React, { useState, useEffect } from 'react';
import { Text, Image, View, ScrollView, FlatList, TextInput, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import logo from '../assets/search.png';
import setting from '../assets/settings 1.png';
import star from '../assets/star.png';
import wifi from '../assets/wifi.png';
import fork from '../assets/fork-and-knife.png';
import pool from '../assets/swimming-pool.png';
import parking from '../assets/parking.png';
import location from '../assets/location-pin.png';
import drop from '../assets/drop.png';
import dropw from '../assets/drop-w.png';
import beach from '../assets/beach.png';
import air from '../assets/airconditioning.png';
import kitchen from '../assets/kitchen.png';
import family from '../assets/family.png';
import garden from '../assets/park.png';
import cultural from '../assets/cultural.png';
import BASE_URL from '../config';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../global.css';

const proxyImage = (rawUrl) => {
    if (!rawUrl) return null;
    return rawUrl.replace(/^"|"$/g, '').trim();
};

const parseAttractionPlaces = (str) => {
    if (!str) return [];
    return str.split(';').map((part) => part.replace(/\(.*?\)/g, '').trim()).filter(Boolean);
};

const fetaturesIcon = {
    "Free WiFi": wifi,
    "Swimming Pool": pool,
    "Free Parking": parking,
    "Restaurant On-site": fork,
    "Air Conditioning": air,
    "Beach Access": beach,
    "Full Kitchen": kitchen,
    "Family Friendly": family,
    "Garden": garden,
    "Heritage Property": cultural,
};

const Hotel_SLots=[
    {key:'All Day', label:'All-Day'},
    {key:'Breakfast', label:'breakfast'},
    {key:'Lunch',label:'lunch'},
    {key:'Dinner',label:'Dinner'}
]

export default function Hotel() {
    const [selected, setSelected] = useState(1);
    const Route = useRoute();
    const [expand, setExpand] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [search, setsearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [nearbymap, setNearByMap] = useState({});
    const [nearbyLoading, setNearbyLoading] = useState({});
    const [originalHotels, setOriginalHotels] = useState([]);
    const navigation = useNavigation();
    const singleHotel = Route.params?.hotel;
    const [slotModelFor,setSlotModelFor]=useState(null);
    const [selectedSlot, setSelectedSlot]=useState({});
    const getSlot=(index)=>selectedSlot[index]||'All Day'

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    useEffect(() => {
        const hotelParam = Route.params?.hotel || Route.params?.hotels;
        if (hotelParam) {
            const hotelsArray = Array.isArray(hotelParam) ? hotelParam : [hotelParam];
            setHotels(hotelsArray);
            setOriginalHotels(hotelsArray);
        } else {
            const fetchAllHotels = async () => {
                try {
                    setLoading(true);
                    const res = await fetch(`${BASE_URL}/Hotels`);
                    const data = await res.json();
                    setHotels(data);
                    setOriginalHotels(data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchAllHotels();
        }
    }, [Route.params]);

    const fetchSearchResults = async (query) => {
        if (singleHotel) return;
        try {
            if (!query) { setHotels([]); return; }
            setLoading(true);
            const res = await fetch(`${BASE_URL}/Hotels?q=${query}`);
            const data = await res.json();
            setHotels(data);
            setOriginalHotels(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchNearbyAtrractionPlaces = async (hotel, index) => {
        if (nearbymap[index]) return;
        const names = parseAttractionPlaces(hotel.nearby_attractions);
        if (names.length === 0) return;
        try {
            setNearbyLoading((prev) => ({ ...prev, [index]: true }));
            const query = names.join(",");
            const res = await fetch(`${BASE_URL}/Attraction/Names?names=${encodeURIComponent(query)}&hotelLat=${hotel.latitude}&hotelLon=${hotel.longitude}`);
            const text = await res.text();
            const data = JSON.parse(text);
            setNearByMap((prev) => ({ ...prev, [index]: data }));
        } catch (err) {
            console.error('Failed to fetch nearby attractions:', err);
        } finally {
            setNearbyLoading((prev) => ({ ...prev, [index]: false }));
        }
    };

    const handleExpand = (hotel, index) => {
        const isOpening = expand !== index;
        setExpand(isOpening ? index : null);
        if (isOpening) fetchNearbyAtrractionPlaces(hotel, index);
    };

    const addHotel = async (hotel) => {
        try {
            const dayID = Route.params?.dayID || 1;
            const storageKey = `task_day_${dayID}`;
            const saved = await AsyncStorage.getItem(storageKey);
            const tasks = saved ? JSON.parse(saved) : [];
            const exists = tasks.some(t => t.hotel_name === hotel.hotel_name);
            if (!exists) {
                tasks.push(hotel);
                await AsyncStorage.setItem(storageKey, JSON.stringify(tasks));
            }
            navigation.replace('Tour Planing');
        } catch (err) {
            console.error(err);
        }
    };

    const addHotelAndAttractions = async (hotel, index) => {
        try {
            const dayID = Route.params?.dayID || 1;
            const storageKey = `task_day_${dayID}`;
            const saved = await AsyncStorage.getItem(storageKey);
            let tasks = saved ? JSON.parse(saved) : [];

            const hotelExists = tasks.some(t => t.hotel_name === hotel.hotel_name);
            if (!hotelExists) {
                tasks.push({...hotel, slot: getSlot(index)});
            }
            const attractions = nearbymap[index] || [];
            attractions.forEach(attr => {
                const attrExists = tasks.some(t => t.attraction_name === attr.attraction_name);
                if (!attrExists) {
                    tasks.push(attr);
                }
            });

            await AsyncStorage.setItem(storageKey, JSON.stringify(tasks));
            navigation.replace('Tour Planing');
        } catch (err) {
            console.error('Failed to save hotel and attractions:', err);
        }
    };

    const openSlotPicker=(hotel,index)=>setSlotModelFor({hotel,index});

    const confermSlot=(slotKey)=>{
        const {hotel,index}=slotModelFor;
        setSelectedSlot(prev=>({...prev,[index]:slotKey}))
        setSlotModelFor(null);
        addHotel({...hotel, slot:slotKey});
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className="bg-white dark:bg-gray-900 flex-1" edges={['top', 'right', 'left']}>

                {/* Search Bar */}
                <View className="px-4 pt-6 pb-3">
                    <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-2xl py-3 px-4">
                        <Image source={logo} className="w-5 h-5 opacity-50" style={isDark ? { tintColor: 'white' } : {}} />
                        <TextInput
                            placeholder="Search hotels..."
                            placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
                            className="pl-3 text-[15px] flex-1 text-gray-800 dark:text-gray-200"
                            value={search}
                            onChangeText={(text) => { setsearch(text); fetchSearchResults(text); }}
                        />
                    </View>
                </View>

                {/*Loading */}
                {hotels.length === 0 && search.length > 0 && !loading && (
                    <Text className="text-gray-400 px-4 mt-1 text-sm">No hotels found in this area.</Text>
                )}
                {loading && (
                    <ActivityIndicator size="large" color="#f87171" className="mt-4" />
                )}

                {/* Filter */}
                <View className="flex-row px-4 pb-4 w-full">
                    <TouchableOpacity
                        onPress={() => { setSelected(1); setHotels([...originalHotels]); }}
                        className={`flex-1 flex-row items-center justify-center py-2.5 rounded-full mr-2 border ${selected === 1 ? 'bg-red-400 border-red-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
                    >
                        <Image source={setting} className="h-4 w-4 mr-1.5" style={(isDark && selected !== 1) ? { tintColor: 'white' } : {}} />
                        <Text className={`text-sm font-bold ${selected === 1 ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>All Filters</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSelected(2);
                            setHotels(price => [...price].sort((a, b) => {
                                const v1 = parseFloat(a.price_per_night_usd.replace('$', ''));
                                const v2 = parseFloat(b.price_per_night_usd.replace('$', ''));
                                return v1 - v2;
                            }));
                        }}
                        className={`flex-1 items-center justify-center py-2.5 rounded-full mr-2 border ${selected === 2 ? 'bg-red-400 border-red-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
                    >
                        <Text className={`text-sm font-bold ${selected === 2 ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>Pricing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSelected(3);
                            setHotels(ratings => [...ratings].sort((b, c) => parseFloat(c.star_rating) - parseFloat(b.star_rating)));
                        }}
                        className={`flex-1 flex-row items-center justify-center py-2.5 rounded-full border ${selected === 3 ? 'bg-red-400 border-red-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
                    >
                        <Image source={star} className="h-3.5 w-3.5 mr-1.5" />
                        <Text className={`text-sm font-bold ${selected === 3 ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>Ratings</Text>
                    </TouchableOpacity>
                </View>

                {/* Section Title */}
                {hotels.length > 0 && (
                    <View className="px-4 pb-3">
                        <Text className="text-gray-900 dark:text-white font-extrabold text-xl">Available Hotels</Text>
                        <Text className="text-gray-400 text-sm">{hotels.length} hotels found</Text>
                    </View>
                )}

                {hotels.length > 0 && (
                    <FlatList
                        data={hotels}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={5}
                        windowSize={5}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
                        renderItem={({ item: hotel, index }) => (
                            <View className="mb-3">

                                {/* Collapsed Card */}
                                {expand !== index && (
                                    <TouchableOpacity
                                        onPress={() => handleExpand(hotel, index)}
                                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 w-full overflow-hidden"
                                        style={{ elevation: isDark ? 0 : 3 }}
                                        activeOpacity={0.92}
                                    >
                                        {/* Image Banner */}
                                        <View className="h-36 w-full">
                                            <Image
                                                source={{ uri: proxyImage(hotel.image_url) }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                        </View>

                                        {/* Info Row */}
                                        <View className="px-4 pt-3 pb-2">
                                            <View className="flex-row items-start justify-between">
                                                <View className="flex-1 pr-3">
                                                    <Text className="text-gray-900 dark:text-white text-base font-bold" numberOfLines={1}>{hotel.hotel_name}</Text>
                                                    <View className="flex-row items-center mt-1">
                                                        <Image source={star} className="h-3.5 w-3.5" />
                                                        <Text className="text-gray-700 dark:text-gray-300 text-xs font-semibold pl-1">{hotel.star_rating}</Text>
                                                        <Text className="text-gray-400 text-xs pl-1.5">({hotel.review_count} reviews)</Text>
                                                        {hotel.distanceKm != null && (
                                                            <Text className="text-gray-400 text-xs pl-1.5">• {hotel.distanceKm}Km away</Text>
                                                        )}
                                                    </View>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => openSlotPicker(hotel,index)}
                                                    className="bg-red-400 rounded-xl px-4 py-2"
                                                >
                                                    <Text className="text-white text-xs font-bold">+ Add</Text>
                                                </TouchableOpacity>
                                            </View>
                                            {/* Price shown clearly below */}
                                            <View className="flex-row items-baseline mt-2 mb-1">
                                                <Text className="text-red-400 font-extrabold text-lg">{hotel.price_per_night_usd}</Text>
                                                <Text className="text-gray-500 text-sm font-semibold ml-1.5">/ night</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}

                                {/* Expanded Card */}
                                {expand === index && (
                                    <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 translate-y-2 w-full mb-12 overflow-hidden" style={{ elevation: isDark ? 0 : 3 }}>
                                        <Image source={{ uri: proxyImage(hotel.image_url) }} className="w-full h-48 absolute" resizeMode="cover" style={{ width: '100%', height: 192 }} />

                                        <TouchableOpacity onPress={() => setExpand(null)} className="absolute right-4 mt-4">
                                            <Image source={dropw} className="h-6 w-6" />
                                        </TouchableOpacity>

                                        <View className="bg-white dark:bg-gray-800 rounded-b-xl mt-32">
                                            <View className="flex-row">
                                                <View className="pl-3 pt-4 flex-1">
                                                    <Text className="text-xl text-black dark:text-white font-bold">{hotel.hotel_name}</Text>
                                                    <View className="flex-row pt-1">
                                                        <Image source={star} className="h-5 w-5" />
                                                        <Text className="text-l font-medium text-black dark:text-white pl-2">{hotel.star_rating}</Text>
                                                        <Text className="text-sm font-medium text-gray-400 pl-2">({hotel.review_count})</Text>
                                                        {hotel.distanceKm != null && (
                                                            <Text className="text-sm font-medium text-gray-400 pl-2">• {hotel.distanceKm}Km away</Text>
                                                        )}
                                                    </View>
                                                </View>
                                                <View className="flex items-end pl-4 pt-4 pr-3">
                                                    <Text className="text-red-500 dark:text-red-400 font-extrabold text-2xl">{hotel.price_per_night_usd}</Text>
                                                    <Text className="text-sm font-medium text-gray-400">per night</Text>
                                                </View>
                                            </View>

                                            <View className="px-4 pt-3">
                                                <Text className="text-l text-gray-600 dark:text-gray-300">{hotel.description}</Text>
                                            </View>

                                            <View className="flex-row flex-wrap pl-4 py-3">
                                                {hotel.features ? hotel.features.split(";").map((features, index) => {
                                                    const name = features.trim();
                                                    const icon = fetaturesIcon[name];
                                                    return (
                                                        <View key={index} className="w-1/3 flex-row my-2 items-center">
                                                            {icon && (<Image source={icon} className="w-5 h-5 mr-2 items-center" />)}
                                                            <Text className="text-green-500 dark:text-green-400 text-xs">{name}</Text>
                                                        </View>
                                                    );
                                                }) : null}
                                            </View>

                                            <View className="flex items-end px-3">
                                                <TouchableOpacity onPress={() => openSlotPicker(hotel,index)} className="bg-red-400 rounded-3xl translate-y-2 border border-red-500 h-12 w-32 flex justify-center items-center">
                                                    <Text className="text-xl font-bold text-white">Select</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View className="h-[1px] bg-gray-300 dark:bg-gray-700 mx-4 mt-7 mb-6" />

                                            <View className="flex-row">
                                                <Image source={location} className="h-5 w-5 ml-5 mt-1" />
                                                <Text className="text-xl text-black dark:text-white font-bold pl-3">Nearby Atrraction places</Text>
                                            </View>

                                            {nearbyLoading[index] ? (
                                                <ActivityIndicator size="large" color="#f87171" className="my-6" />
                                            ) : (
                                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                    <View className="flex-row py-3 px-6">
                                                        {(nearbymap[index] && nearbymap[index].length > 0) ? nearbymap[index].map((attraction, i) => (
                                                            <View key={i} className="pr-3">
                                                                <View className="bg-white dark:bg-gray-700 h-80 w-64 rounded-xl overflow-hidden relative border border-gray-100 dark:border-gray-600">
                                                                    <Image source={{ uri: proxyImage(attraction.image_url) }} className="w-full h-36" />
                                                                    <View className="left-0 right-0 top-[50%] bg-white dark:bg-gray-700 rounded-b-xl bottom-0 absolute">
                                                                        <Text className="text-black dark:text-white text-l font-bold pt-2 px-3">{attraction.attraction_name}</Text>
                                                                        <View className="flex-row py-2 px-3">
                                                                            <Image source={star} className="h-4 w-4" />
                                                                            <Text className="text-sm font-medium text-black dark:text-white pl-2">{attraction.rating}</Text>
                                                                            <Text className="text-sm font-medium text-gray-400 pl-2">{attraction.distanceKm != null ? `• ${attraction.distanceKm} km away` : ''}</Text>
                                                                        </View>
                                                                        <ScrollView style={{ maxHeight: 90 }} showsVerticalScrollIndicator={true}>
                                                                            <Text className="text-sm font-medium text-gray-500 dark:text-gray-300 px-4">{attraction.description}</Text>
                                                                        </ScrollView>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )) : null}
                                                    </View>
                                                </ScrollView>
                                            )}

                                            <View className="flex items-center px-3 pb-6 mt-4">
                                                <TouchableOpacity onPress={() => addHotelAndAttractions(hotel, index)} className="bg-red-400 rounded-3xl border border-red-500 h-12 w-64 flex justify-center items-center">
                                                    <Text className="text-xl font-bold text-white">Add to To-Do list</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )}

                            </View>
                        )}
                    />
                )}

            </SafeAreaView>
            <Modal visible={!!slotModelFor} transparent animationType='fade' onRequestClose={()=>setSlotModelFor(null)}>
                <View className="flex-1 bg-black/40 justify-center items-center">
                    <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 w-72">
                        <Text className="text-gray-900 dark:text-white font-bold text-base mb-3">When is this for?</Text>
                        {Hotel_SLots.map((s)=>(
                            <TouchableOpacity key={s.key} onPress={() => confermSlot(s.key)} className="flex-row items-center py-2.5">
                                <View className="w-5 h-5 rounded-full border-2 border-red-400 mr-3" />
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