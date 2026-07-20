import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Text, View, TouchableOpacity, Image, ScrollView, TextInput, FlatList, Linking } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import '../global.css';
import logo from '../assets/search.png';
import star from '../assets/star.png';
import drop from '../assets/drop.png';
import dropw from '../assets/drop-w.png';
import locationPin from '../assets/location-pin.png';
import { useRoute } from '@react-navigation/native';
import BASE_URL from '../config';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Foggy from '../assets/Foggy.png';
import Clear from '../assets/Clear.png';
import stormy from '../assets/stormy.png';
import PartlyCloudy from '../assets/PartlyCloudy.png';
import Showers from '../assets/Showers.png';
import Snow from '../assets/Snow.png';
import rainy from '../assets/rainy.png';
import crisis from '../assets/crisis.png';

const proxyImage = (rawUrl) => {
    if (!rawUrl) return null;
    const url = rawUrl.replace(/^"|"$/g, '').trim();
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=400`;
};

const getWeatherImage = (code) => {
    if (code === 0) return Clear;
    if (code <= 3) return PartlyCloudy;
    if (code <= 48) return Foggy;
    if (code <= 67) return rainy;
    if (code <= 77) return Snow;
    if (code <= 82) return Showers;
    return stormy;
};

const getWeatherDescription = (code) => {
    if (code === 0) return 'Clear Sky';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowfall';
    if (code <= 82) return 'Showers';
    return 'Stormy';
};

const AttractionCard = React.memo(({
    item,
    index,
    isExpanded,
    onExpand,
    onFetchWeather,
    onLogClick,
    onAddToTasks,
    onOpenMap,
    isDark
}) => {
    return (
        <View className="mb-3">

            {/* Collapsed Card */}
            {!isExpanded && (
                <TouchableOpacity
                    onPress={() => {
                        onLogClick(item);
                        onExpand(item._id);
                        if (!item.weatherInfo) {
                            onFetchWeather(item.latitude, item.longitude, item._id);
                        }
                    }}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 w-full overflow-hidden"
                    style={{ elevation: isDark ? 0 : 3 }}
                    activeOpacity={0.92}
                >
                    {/* Image*/}
                    <View className="relative h-36 w-full bg-gray-200 dark:bg-gray-700">
                        <Image
                            source={{ uri: proxyImage(item.image_url) }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                        {/* badge */}
                        {item.famous_or_hidden_gem ? (
                            <View className="absolute top-3 left-3 bg-orange-500 rounded-xl px-2.5 py-1">
                                <Text className="text-white text-xs font-bold">{item.famous_or_hidden_gem}</Text>
                            </View>
                        ) : null}
                        {/* Rating*/}
                        <View className="absolute top-3 right-3 bg-white dark:bg-gray-900 rounded-xl px-2.5 py-1.5" style={{ elevation: isDark ? 0 : 4 }}>
                            <Text className="text-amber-500 font-extrabold text-sm">★ {item.rating}</Text>
                        </View>
                    </View>

                    <View className="px-4 py-3 flex-row items-center justify-between">
                        <View className="flex-1 pr-3">
                            <Text className="text-gray-900 dark:text-white text-base font-bold" numberOfLines={1}>{item.attraction_name}</Text>
                            <Text className="text-gray-400 dark:text-gray-400 text-xs mt-0.5" numberOfLines={1}>{item.description}</Text>
                            <Text className="text-gray-300 dark:text-gray-500 text-xs mt-0.5">({item.num_reviews} reviews)</Text>
                        </View>
                        <View className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-500 rounded-xl px-3 py-1.5">
                            <Text className="text-orange-500 dark:text-orange-400 text-xs font-bold">View</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )}

            {/* Expanded Card */}
            {isExpanded && (
                <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 w-full mb-2 overflow-hidden" style={{ elevation: isDark ? 0 : 3 }}>

                    <Image source={{ uri: proxyImage(item.image_url) }} className="w-full h-52 bg-gray-200 dark:bg-gray-700" resizeMode="cover" style={{ width: '100%', height: 208 }} />
                    <TouchableOpacity onPress={() => onExpand(null)} className="absolute right-4 top-4 bg-black/40 rounded-full p-2">
                        <Image source={dropw} className="h-5 w-5" style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>

                    <View className="absolute top-4 left-4 bg-orange-500 rounded-2xl px-3 py-1">
                        <Text className="text-white text-xs font-bold">{item.famous_or_hidden_gem}</Text>
                    </View>

                    <View className="p-4 bg-white dark:bg-gray-800">

                        <View className="flex-row justify-between items-start">
                            <View className="flex-1 pr-2">
                                <Text className="text-xl text-black dark:text-white font-bold">{item.attraction_name}</Text>
                                <View className="flex-row items-center mt-5">
                                    <Image source={star} className="h-4 w-4" style={{ width: 16, height: 16 }} />
                                    <Text className="text-l font-medium text-black dark:text-white pl-2">{item.rating}</Text>
                                    <Text className="text-xs text-gray-400 pl-2">({item.num_reviews} reviews)</Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <View className="bg-orange-100 dark:bg-orange-900/40 rounded-lg px-2 py-1">
                                    <Text className="text-orange-600 dark:text-orange-400 text-xs font-bold">{item.attraction_type}</Text>
                                </View>
                                {/* Weather Badge */}
                                {item.weatherInfo ? (
                                    <View className="flex-row items-center bg-white dark:bg-gray-900 rounded-xl px-1.5 py-1 mt-6 border border-gray-100 dark:border-gray-700">
                                        <Image
                                            source={getWeatherImage(item.weatherInfo.weathercode)}
                                            style={{ width: 24, height: 24 }}
                                            resizeMode="contain"
                                        />
                                        <View className="ml-1">
                                            <Text className="text-[11px] font-bold text-gray-900 dark:text-white">{Math.round(item.weatherInfo.temperature_2m)}°C</Text>
                                            <Text className="text-[9px] text-gray-400 dark:text-gray-500">{getWeatherDescription(item.weatherInfo.weathercode)}</Text>
                                        </View>
                                    </View>
                                ) : null}
                            </View>
                        </View>

                        <View className="flex-row items-center mt-2">
                            <Image source={locationPin} className="h-4 w-4" style={{ width: 16, height: 16 }} />
                            <Text className="text-sm text-gray-500 dark:text-gray-400 pl-2">{item.city}, {item.district}, {item.province}</Text>
                        </View>

                        <Text className="text-sm text-gray-600 dark:text-gray-300 mt-3">{item.description}</Text>

                        <View className="h-[1px] bg-gray-200 dark:bg-gray-700 my-4" />

                        {/* Suggested Activities */}
                        <Text className="text-black dark:text-white font-bold text-l mb-2">Suggested Activities</Text>
                        <View className="flex-row flex-wrap">
                            {item.suggested_activities ? item.suggested_activities.split(';').map((act, i) => (
                                <View key={i} className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-2xl px-3 py-1 mr-2 mb-2">
                                    <Text className="text-orange-600 dark:text-orange-400 text-xs font-medium">{act.trim()}</Text>
                                </View>
                            )) : null}
                        </View>

                        <View className="h-[1px] bg-gray-200 dark:bg-gray-700 my-4" />


                        {/* Tourist Tips */}
                        <Text className="text-black dark:text-white font-bold text-l mb-2">Tourist Tips</Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">{item.tourist_tips}</Text>

                        {/* Safety Level */}
                        <View className="flex-row items-center mt-3">
                            <View className={`rounded-2xl px-3 py-1 ${item.safety_level === 'Safe' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                                <Text className={`text-xs font-bold ${item.safety_level === 'Safe' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>🛡 {item.safety_level}</Text>
                            </View>
                        </View>

                        <View className="h-[1px] bg-gray-200 dark:bg-gray-700 my-4" />

                        <View className="flex-row justify-between items-center">
                            <TouchableOpacity onPress={() => onOpenMap(item.google_maps_url)} className="flex-1 border border-orange-500 rounded-3xl py-3 mr-2 justify-center items-center">
                                <Text className="text-orange-500 text-l font-bold">Get Direction</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onAddToTasks(item)} className="flex-1 bg-orange-500 rounded-3xl py-3 ml-2 justify-center items-center">
                                <Text className="text-white text-l font-bold">+ Add to Plan</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            )}

        </View>
    );
});

export default function Attraction() {
    const [selected, setSelected] = useState('All');
    const [attraction, setAttraction] = useState([]);
    const [search, setSearch] = useState('');
    const Route = useRoute();
    const navigation = useNavigation();
    const singlePlace = Route.params?.place;
    const [expandId, setExpandId] = useState(null);

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';


    const addToTasks = useCallback(async (place) => {
        try {
            const dayID = Route.params?.dayID || 1;
            const storageKey = `task_day_${dayID}`;
            const saved = await AsyncStorage.getItem(storageKey);
            const tasks = saved ? JSON.parse(saved) : [];
            const exists = tasks.some(
                t => t.attraction_name === place.attraction_name
            );
            if (!exists) {
                tasks.push(place);
                await AsyncStorage.setItem(storageKey, JSON.stringify(tasks));
            }
            navigation.replace('Tour Planing');
        } catch (err) {
            console.error('Failed to save attraction task:', err);
        }
    }, [navigation, Route.params?.dayID]);

    const fetchAttraction = async () => {
        try {
            let url = `${BASE_URL}/Attraction`;
            if (search && selected !== 'All') {
                url += `?q=${search}&category=${selected}`;
            } else if (search) {
                url += `?q=${search}`;
            } else if (selected !== 'All') {
                url += `?category=${selected}`;
            }
            const res = await fetch(url);
            const text = await res.text();
            const data = JSON.parse(text);
            setAttraction(data);
        } catch (err) {
            console.error(err);
        }
    };

    const populerDestination = Array.isArray(attraction) ? attraction.filter(
        item => item.num_reviews >= 5000
    ) : [];

    const handleOpenMap = useCallback((link) => {
        Linking.openURL(link).catch(() => {
            Alert.alert("Error", "Could not open map link");
        });
    }, []);

    const logClick = useCallback(async (attraction) => {
        try {
            await fetch(`${BASE_URL}/log/click`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    attraction_id: attraction._id,
                    attraction_name: attraction.attraction_name,
                })
            });
        } catch (err) { }
    }, []);

    useEffect(() => {
        if (singlePlace) {
            setAttraction([singlePlace]);
        } else {
            fetchAttraction();
        }
    }, [singlePlace, search, selected]);

    useEffect(() => {
        if (Route.params?.selectAttraction) {
            const place = Route.params.selectAttraction;
            setAttraction([place]);
            setExpandId(place._id);
        }
    }, [Route.params?.selectAttraction]);

    const fetchWeather = useCallback(async (lat, lon, id) => {
        try {
            const res = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}`);
            const data = await res.json();
            setAttraction(prev => prev.map(place =>
                place._id === id ? { ...place, weatherInfo: data } : place
            ));
        } catch (err) { }
    }, []);

    const renderItem = useCallback(({ item, index }) => (
        <AttractionCard
            item={item}
            index={index}
            isExpanded={expandId === item._id}
            onExpand={setExpandId}
            onFetchWeather={fetchWeather}
            onLogClick={logClick}
            onAddToTasks={addToTasks}
            onOpenMap={handleOpenMap}
            isDark={isDark}
        />
    ), [expandId, fetchWeather, logClick, addToTasks, handleOpenMap, isDark]);

    return (
        <SafeAreaProvider>
            <SafeAreaView className="bg-white dark:bg-gray-900 flex-1" edges={['top', 'right', 'left']}>

                {/* Search Bar */}
                <View className="px-4 pt-6 pb-2">
                    <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-2xl py-3 px-4">
                        <Image source={logo} className="w-5 h-5 opacity-50" style={isDark ? { tintColor: 'white' } : {}} />
                        <TextInput
                            placeholder="Search places, activities..."
                            placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
                            className="pl-3 text-[15px] flex-1 text-gray-800 dark:text-gray-200"
                            onChangeText={setSearch}
                        />
                    </View>
                </View>

                {/* Category */}
                <View className="flex-row px-4 py-3 w-full justify-between">
                    {['All', 'Cultural', 'Nature', 'Entertain'].map((item, index, arr) => (
                        <TouchableOpacity
                            key={item}
                            onPress={() => setSelected(item)}
                            className={`flex-1 items-center justify-center rounded-full py-2.5 ${index < arr.length - 1 ? 'mr-2' : ''} border ${selected === item ? 'bg-orange-500 border-orange-500' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
                        >
                            <Text className={`text-xs font-bold ${selected === item ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} numberOfLines={1}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Popular Destinations */}
                <View className="px-4">
                    <Text className="text-gray-900 dark:text-white font-extrabold text-xl mb-3">Popular Destinations</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {populerDestination.map((item, index) => (
                            <View key={index} className="h-44 w-60 rounded-2xl overflow-hidden mr-4 border border-gray-100 dark:border-gray-700 bg-gray-200 dark:bg-gray-700" style={{ elevation: isDark ? 0 : 3 }}>
                                <Image source={{ uri: proxyImage(item.image_url) }} className="h-full w-full absolute" resizeMode="cover" />
                                <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/45 justify-end p-4">
                                    <Text className="text-white text-lg font-bold" numberOfLines={1}>{item.attraction_name}</Text>
                                    <View className="flex-row items-center mt-1">
                                        <Image source={star} className="h-3.5 w-3.5" />
                                        <Text className="text-white text-sm font-semibold pl-1">{item.rating}</Text>
                                        <Text className="text-gray-300 text-xs pl-2">• 1.2Km away</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <View className="pt-5 pb-2">
                        <Text className="text-gray-900 dark:text-white font-extrabold text-xl">All Attractions</Text>
                        <Text className="text-gray-400 text-sm">{attraction.length} places found</Text>
                    </View>
                </View>

                <FlatList
                    data={attraction}
                    extraData={expandId}
                    keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
                    renderItem={renderItem}
                    removeClippedSubviews={false}
                    maxToRenderPerBatch={3}
                    windowSize={2}
                    initialNumToRender={3}
                    updateCellsBatchingPeriod={100}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
                />

            </SafeAreaView>
        </SafeAreaProvider>
    );
}