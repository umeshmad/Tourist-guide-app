import "../global.css";
import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Calander from '../assets/event.png';
import Plus from '../assets/plus.png';
import calander2 from '../assets/schedule.png';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import bin from '../assets/delete.png';
import world from '../assets/world-map.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import emergency from '../assets/emergency.png';
import emergency1 from '../assets/emergency1.png';
import trashbin from '../assets/trashbin.png';
import BASE_URL from '../config';
import { useColorScheme } from 'nativewind';

// Memoized stop row — prevents re-render of unchanged stops (fixes VirtualizedList warning)
const TravelConnector = React.memo(({ timeBefore, isDark }) => (
    <View className={`flex-row items-center px-5 py-1 ${isDark ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <View className={`w-1 h-4 ml-4 mr-3 ${isDark ? 'bg-gray-600' : 'bg-blue-300'}`} />
        <Text className={`text-xs italic ${isDark ? 'text-gray-400' : 'text-blue-400'}`}>
            {timeBefore ? ` ${timeBefore}` : '↓'}
        </Text>
    </View>
));
const callNumber=(rawnumber)=>{
    if(!rawnumber)
        return
    // Extract number
    const numberMatch = rawnumber.match(/(\d+)/);
    const number = numberMatch ? numberMatch[0] : rawnumber.replace(/[^\d+]/g, '');
    if(!number) return;
    const url=`tel:${number}`;
    Linking.canOpenURL(url)
    .then((supported)=>{
        if(supported){
            Linking.openURL(url);
        }else 
            {
            Alert.alert('Unable to call', 'Phone calls are not supported on this device.');
        }

    })
    .catch((err)=>{
        console.error('[Call] failed to open dialer:', err);
    });
}
const SLOT_META = {
    'All Day': { label: 'All Day', order: 0, color: 'bg-purple-200' },
    'BreakFast': { label: 'Breakfast', order: 1, color: 'bg-yellow-200' },
    'Lunch': { label: 'Lunch', order: 2, color: 'bg-orange-200' },
    'Dinner': { label: 'Dinner', order: 3, color: 'bg-indigo-200' }
};

const SLOT_ORDER = ['All Day', 'BreakFast', 'Lunch', 'Dinner'];




const StopItem = React.memo(({ t, index, onView, onDelete, userEmergency, isDark }) => {
    const [showEmergency, setShowEmergency] = useState(false);
    const placeEmergency = t.emergency || null;
    const hasEmergency = !!(placeEmergency || userEmergency);


    return (
        <View>
            {index > 0 && <TravelConnector timeBefore={t._timeBefore} isDark={isDark} />}

            {/* Stop row */}
            <View className={`py-3 px-4 ${hasEmergency && !showEmergency ? '' : 'border-b border-gray-100 dark:border-gray-700'}`}>
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center flex-1 pr-2">
                        <View className="bg-blue-50 dark:bg-gray-700 w-8 h-8 rounded-full justify-center items-center mr-3">
                            <Text className="text-blue-600 dark:text-white text-xs font-bold">{index + 1}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 dark:text-white font-bold text-sm" numberOfLines={1}>
                                {t.slot && SLOT_META[t.slot] ? `${SLOT_META[t.slot].label} - ` : ''}
                                {t.attraction_name || t.hotel_name || t.restaurant_name}
                            </Text>
                            <Text className="text-gray-400 dark:text-gray-500 text-xs" numberOfLines={1}>
                                {t.hotel_name ? 'Hotel' : t.restaurant_name ? 'Restaurant' : 'Attraction'}
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row items-center ml-2">
                        {hasEmergency && (
                            <TouchableOpacity
                                onPress={() => setShowEmergency(p => !p)}
                                className={`rounded-lg border border-red-200 dark:border-red-800 mr-2 ${showEmergency ? 'bg-red-50 dark:bg-red-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}
                            >
                                <Image source={emergency1} className="h-6 w-6"></Image>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={onView} className="bg-blue-600 rounded-lg px-3 py-2 mr-2">
                            <Text className="text-white text-xs font-bold">View</Text>
                        </TouchableOpacity>
                        {/* delete icon */}
                        <TouchableOpacity onPress={onDelete} className="ml-2 bg-red-50 dark:bg-red-900/30 rounded-lg p-2">
                            <Image source={trashbin} className="w-6 h-6"></Image>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Emergency Panel */}
                {showEmergency && (
                    <View className="mt-3 bg-red-50 dark:bg-red-900/20 rounded-xl p-3 border border-red-200 dark:border-red-800/50">
                        <View className="flex-row">
                            <Image source={emergency1} className="h-10 w-10"></Image>
                            <Text className="text-red-700 dark:text-red-400 font-bold text-sm mb-2">Emergency Contacts</Text>
                        </View>
                        {placeEmergency ? (
                            <View className="mb-2">
                                <Text className="text-red-600 dark:text-red-400 text-xs font-bold mb-1">Place Emergency Numbers</Text>
                                {placeEmergency.split(/[;,|]/).map((line, i) => {
                                    const trimmed = line.trim();
                                    return trimmed ? (
                                        <TouchableOpacity key={i} onPress={() => callNumber(trimmed)}>
                                            <Text className="text-blue-600 dark:text-blue-400 text-xs leading-tight underline">{trimmed}</Text>
                                        </TouchableOpacity>
                                    ) : null;
                                })}
                            </View>
                        ) : null}

                        {userEmergency ? (
                            <View className={`${placeEmergency ? 'border-t border-red-200 dark:border-red-800/50 pt-2' : ''}`}>
                                <Text className="text-red-600 dark:text-red-400 text-xs font-bold mb-1">👤 Your Emergency Contact</Text>
                                {userEmergency.name ? (
                                    <Text className="text-gray-700 dark:text-gray-300 text-xs leading-snug">• Name: <Text className="font-bold">{userEmergency.name}</Text></Text>
                                ) : null}
                                {userEmergency.phone ? (
                                    <TouchableOpacity onPress={() => callNumber(userEmergency.phone)}>
                                        <Text className="text-gray-700 dark:text-gray-300 text-xs leading-snug">• Phone: <Text className="font-bold text-red-600 dark:text-red-400">{userEmergency.phone}</Text></Text>
                                    </TouchableOpacity>
                                ) : null}
                                {userEmergency.relationship ? (
                                    <Text className="text-gray-500 dark:text-gray-400 text-xs leading-snug">• Relationship: {userEmergency.relationship}</Text>
                                ) : null}
                                {/* fallback if stored as plain string */}
                                {typeof userEmergency === 'string' ? (
                                    <Text className="text-gray-700 dark:text-gray-300 text-xs leading-tight">{userEmergency}</Text>
                                ) : null}
                            </View>
                        ) : null}
                    </View>
                )}
            </View>
        </View>
    );
});

export default function TourPlaning() {
    const navigation = useNavigation();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [task, setTask] = useState({});
    const [travelTimes, setTravelTimes] = useState({}); 
    const [optimizing, setOptimizing] = useState({}); 
    const [userEmergency, setUserEmergency] = useState(null);
    const [showDayEmergency, setShowDayEmergency] = useState({}); 


    const loadAllTask = async () => {
        try {
            const entries = await Promise.all(
                date.map(async (d) => {
                    const saved = await AsyncStorage.getItem(`task_day_${d.id}`);
                    return [d.id, saved ? JSON.parse(saved) : []];
                })
            );
            setTask(Object.fromEntries(entries))
        } catch (err) {
            console.error('Failed to load tasks:', err);
        }
    };

    const isFocused = useIsFocused();

    const fetchUserEmergency = async () => {
        try {
            let email = await AsyncStorage.getItem('userEmail');
            if (!email) email = 'umesh1234@gmail.com';
            const url = `${BASE_URL}/auth/user?email=${encodeURIComponent(email)}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.success && data.user?.emergencyContact) {
                setUserEmergency(data.user.emergencyContact);
            }
        } catch (err) {
            console.error('[Emergency] fetch failed:', err);
        }
    };

    useEffect(() => {
        if (isFocused) {
            loadAllTask(date);
            fetchUserEmergency();
        }
    }, [isFocused]);

    // compute travel time between stops
    const computeTravelTimes = async (dayId, stops) => {
        if (stops.length < 2) { setTravelTimes(prev => ({ ...prev, [dayId]: [] })); return; }
        const times = [];
        for (let i = 0; i < stops.length - 1; i++) {
            const s = stops[i], e = stops[i + 1];
            if (s.latitude && s.longitude && e.latitude && e.longitude) {
                try {
                    const t = await getTravelTime(s.latitude, s.longitude, e.latitude, e.longitude);
                    times.push(t);
                } catch (_) {
                    const km = getDistanceKm(s.latitude, s.longitude, e.latitude, e.longitude);
                    times.push(`~${km.toFixed(1)} km`);
                }
            } else {
                times.push(null);
            }
        }
        setTravelTimes(prev => ({ ...prev, [dayId]: times }));
    };

    useEffect(() => {
        date.forEach(d => {
            const stops = task[d.id] || [];
            if (stops.length > 1) computeTravelTimes(d.id, stops);
        });
    }, [task]);

    const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function formatDate(newDate) {
        return `${DAY_NAMES[newDate.getDay()]},${MONTH_NAMES[newDate.getMonth()]},${newDate.getDate()}`
    }
    const [date, setDate] = useState([{ id: 1, dateStr: formatDate(new Date()) }]);
    
    const getMissig = (dayId) => {
        const stops = task[dayId] || [];
        // If any hotel is booked for 'All Day', user stays at hotel — no meal check needed
        const hasAllDayHotel = stops.some(s => s.hotel_name && s.slot === 'All Day');
        if (hasAllDayHotel) return [];
        const filled = new Set(stops.map(s => s.slot).filter(Boolean));
        return ['BreakFast', 'Lunch', 'Dinner'].filter(m => !filled.has(m));
    };

    const addDay = () => {
        const lastDay = date[date.length - 1];
        const missing = lastDay ? getMissig(lastDay.id) : [];
        if (missing.length > 0) {
            const labels = missing.map(m => SLOT_META[m]?.label || m).join(', ');
            Alert.alert(
                `Day ${lastDay.id} meals incomplete`,
                `Missing: ${labels}.\n\nAdd these restaurants before starting a new day, or continue anyway?`,
                [
                    { text: "Go back & add", style: "cancel" },
                    {
                        text: "Continue Anyway", onPress: () => setDate(prev => {
                            const newDay = { id: prev.length + 1, dateStr: formatDate(new Date()) };
                            setTask(p => ({ ...p, [newDay.id]: [] }));
                            return [...prev, newDay];
                        })
                    },
                ]
            );
        } else {
            // All meal slots filled — create new day directly
            setDate(prev => {
                const newDay = { id: prev.length + 1, dateStr: formatDate(new Date()) };
                setTask(p => ({ ...p, [newDay.id]: [] }));
                return [...prev, newDay];
            });
        }
    };

    const deleteDay = async (id) => {
        await AsyncStorage.removeItem(`task_day_${id}`);
        setDate(prev => prev.filter(d => d.id !== id).map((d, i) => ({ ...d, id: i + 1 })));
        setTask(prev => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    };

    const deleteTask = async (dayId, index) => {
        try {
            const updated = task[dayId].filter((_, i) => i !== index);
            setTask(prev => ({ ...prev, [dayId]: updated }));
            await AsyncStorage.setItem(`task_day_${dayId}`, JSON.stringify(updated));
        } catch (err) {
            console.error('Failed to delete task:', err);
        }
    };

    // distance calculate 
    const getDistanceKm = (lat1, lng1, lat2, lng2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLng = (lng2 - lng1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    // Travel Time
    const getTravelTime = async (lat1, lng1, lat2, lng2) => {
        const res = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImFhODkyNmRmMzMyMzRlMGViNmU4YjI3MjAwNzExNzIxIiwiaCI6Im11cm11cjY0In0=&star${lng1},${lat1}&end=${lng2},${lat2}`);
        const data = await res.json();
        const seconds = data.features[0].properties.segment[0].duration;
        const mins = Math.round(seconds / 60);
        return mins < 60 ? `~${mins}min drive` : `~${Math.floor(mins / 60)} hr ${mins % 60} min drive`
    };

    // Nearest place

    const optimez = (stops) => {
        const groups = {};
        stops.forEach(s => {
            const key = s.slot || '__none__';
            if (!groups[key]) groups[key] = [];
            groups[key].push(s);
        });

        // 2. Nearest-neighbor optimize
        const optimizeGroup = (groupStops) => {
            if (!groupStops || groupStops.length <= 2) return groupStops || [];
            const remaining = [...groupStops];
            const ordered = [remaining.splice(0, 1)[0]];
            while (remaining.length > 0) {
                const last = ordered[ordered.length - 1];
                let bestIndex = 0;
                let bestDist = Infinity;
                remaining.forEach((s, i) => {
                    const d = getDistanceKm(last.latitude, last.longitude, s.latitude, s.longitude);
                    if (d < bestDist) { bestDist = d; bestIndex = i; }
                });
                ordered.push(remaining.splice(bestIndex, 1)[0]);
            }
            return ordered;
        };

        // 3. Reassemble groups fixed meal order
        const orderedKeys = [
            ...SLOT_ORDER.filter(k => groups[k]),
            ...(groups['__none__'] ? ['__none__'] : [])
        ];

        return orderedKeys.flatMap(key => optimizeGroup(groups[key]));
    };
    //Total Distance
    const totalRouteKm = (stops) => {
        let total = 0;
        for (let i = 0; i < stops.length - 1; i++) {
            total += getDistanceKm(
                stops[i].latitude, stops[i].longitude,
                stops[i + 1].latitude, stops[i + 1].longitude
            );
        }
        return total.toFixed(1);
    };

    const optinmize = async (dayId) => {
        const stops = task[dayId] || [];
        if (stops.length < 3) {
            Alert.alert("Need at least 3 stops", "Add more places to optimise the route.");
            return
        }

        const cordinates = stops.every(s => s.longitude && s.latitude);
        if (!cordinates) {
            Alert.alert("Missing coordinates", "Some stops don't have location data.");
            return;
        }

        const beforeKm = totalRouteKm(stops);
        const optimzed = optimez(stops);
        const afterKm = totalRouteKm(optimzed);

        // if optimised route is not shorter, no point applying
        if (parseFloat(afterKm) >= parseFloat(beforeKm)) {
            Alert.alert("Already optimal", `Your route (${beforeKm} km) is already in the best order we can find.`);
            return;
        }

        const saved = (parseFloat(beforeKm) - parseFloat(afterKm)).toFixed(1);

        Alert.alert(
            "Optimise route?",
            `Reorder ${stops.length} stops to save ${saved} km.\n\nBefore: ${beforeKm} km total\nAfter: ${afterKm} km total`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Apply",
                    onPress: async () => {
                        setOptimizing(prev => ({ ...prev, [dayId]: true }));
                        setTask(prev => ({ ...prev, [dayId]: optimzed }));
                        await AsyncStorage.setItem(`task_day_${dayId}`, JSON.stringify(optimzed));
                        await computeTravelTimes(dayId, optimzed);
                        setOptimizing(prev => ({ ...prev, [dayId]: false }));
                    }
                }
            ]

        );

    };



    return (
        <SafeAreaProvider>
            <SafeAreaView className="bg-white dark:bg-gray-900 flex-1" edges={['top', 'right', 'left']}>
                <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

                    {/* Header */}
                    <View className="px-4 pt-6 pb-4">
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-gray-900 dark:text-white font-bold text-2xl">My Tour Plan</Text>
                                <Text className="text-gray-400 dark:text-gray-500 text-sm mt-1">Organize your perfect trip</Text>
                            </View>
                            <TouchableOpacity
                                onPress={addDay}
                                className="bg-blue-600 rounded-2xl px-4 py-2 flex-row items-center"
                                style={{ elevation: isDark ? 0 : 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 1 }}
                            >
                                <Text className="text-white text-sm font-bold">+ Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {date.map((date) => {
                        const dayTasks = task[date.id] || [];
                        return (
                            <View key={date.id}>
                                {/* Day infomation */}
                                <View className="mx-4 mb-4 flex-row items-center bg-blue-50 dark:bg-gray-800 rounded-2xl px-4 py-3 border border-blue-100 dark:border-gray-700">
                                    <Image source={Calander} className="w-7 h-7" style={isDark ? { tintColor: 'white' } : {}} />
                                    <View className="ml-3">
                                        <Text className="text-blue-700 dark:text-white font-bold text-base">{date.id} Day Tour</Text>

                                    </View>
                                </View>

                                <View className="mx-4">
                                    <View className="bg-blue-700 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl overflow-hidden" style={{ elevation: isDark ? 0 : 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 }}>

                                        <View className="px-4 py-4">
                                            {/* Day header row */}
                                            <View className="flex-row justify-between items-center">
                                                <View className="flex-row items-center">
                                                    <View className="w-14 h-14 rounded-full bg-white/25 justify-center items-center">
                                                        <Image source={calander2} className="w-9 h-9" />
                                                    </View>
                                                    <View className="ml-3">
                                                        <Text className="text-white font-bold text-xl">Day {date.id}</Text>
                                                        <Text className="text-blue-200 dark:text-gray-400 text-sm">{date.dateStr}</Text>
                                                    </View>
                                                </View>
                                                <View className="flex-row items-center">
                                                    <TouchableOpacity
                                                        onPress={() => setShowDayEmergency(prev => ({ ...prev, [date.id]: !prev[date.id] }))}
                                                        className={`w-10 h-10 rounded-full justify-center items-center mr-3 ${showDayEmergency[date.id] ? 'bg-red-500' : 'bg-white/25'}`}
                                                    >
                                                    <Image source={emergency} className="h-10 w-10 "></Image>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => deleteDay(date.id)}>
                                                        <Image source={bin} className="w-10 h-10 mr-3" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => navigation.navigate("Search", { dayID: date.id })}>
                                                        <View className="w-10 h-10 rounded-full bg-white/25 justify-center items-center">
                                                            <Image source={Plus} className="w-5 h-5" />
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            {/* Day Emergency Panel */}
                                            {showDayEmergency[date.id] && (
                                                <View className="mt-3 bg-red-50 dark:bg-red-900/30 rounded-2xl p-3 border border-red-200 dark:border-red-800">
                                                        <View className="flex-row">
                                                            <Image source={emergency1} className="h-6 w-6"></Image>
                                                            <Text className="text-red-700 dark:text-red-400 font-bold text-sm mb-2">Day Emergency Contacts</Text>
                                                        </View>
                                                    {/* User emergency contact */}
                                                    <View className="mb-3 bg-white dark:bg-gray-800 rounded-lg p-3 border-l-3 border-l-red-600">
                                                        <Text className="text-red-600 dark:text-red-400 text-xs font-bold mb-2">👤 Your Personal Emergency Contact</Text>
                                                        {userEmergency ? (
                                                            <View>
                                                                {userEmergency.name ? <Text className="text-gray-700 dark:text-gray-300 text-xs leading-snug">• Name: <Text className="font-bold">{userEmergency.name}</Text></Text> : null}
                                                                {userEmergency.phone ? (
                                                                    <TouchableOpacity onPress={() => callNumber(userEmergency.phone)}>
                                                                        <Text className="text-gray-700 dark:text-gray-300 text-xs leading-snug">• Phone: <Text className="font-bold text-red-600 dark:text-red-400">{userEmergency.phone}</Text></Text>
                                                                    </TouchableOpacity>
                                                                ) : null}
                                                                {userEmergency.relationship ? <Text className="text-gray-500 dark:text-gray-400 text-xs leading-snug">• Relationship: {userEmergency.relationship}</Text> : null}
                                                            </View>
                                                        ) : (
                                                            <Text className="text-gray-400 text-xs">No personal emergency contact set.</Text>
                                                        )}
                                                    </View>

                                                    {/* Scheduled places emergency contacts */}
                                                    <View className="bg-white dark:bg-gray-800 rounded-lg p-3 border-l-3 border-l-red-500">
                                                        <Text className="text-red-600 dark:text-red-400 text-xs font-bold mb-2">📍 Scheduled Places Emergency Contacts</Text>
                                                        {dayTasks.filter(t => t.emergency).length > 0 ? (
                                                            dayTasks.filter(t => t.emergency).map((t, idx) => (
                                                                <View key={idx} className={`${idx < dayTasks.filter(t => t.emergency).length - 1 ? 'mb-2' : ''}`}>
                                                                    <Text className="text-gray-900 dark:text-gray-200 text-xs font-bold">• {t.attraction_name || t.hotel_name || t.restaurant_name}</Text>
                                                                    {t.emergency.split(/[;,|]/).map((line, i) => {
                                                                        const trimmed = line.trim();
                                                                        return trimmed ? (
                                                                            <TouchableOpacity key={i} onPress={() => callNumber(trimmed)}>
                                                                                <Text className="text-gray-700 dark:text-gray-400 text-xs leading-tight pl-3">  - {trimmed}</Text>
                                                                            </TouchableOpacity>
                                                                        ) : null;
                                                                    })}

                                                                </View>
                                                            ))
                                                        ) : (
                                                            <Text className="text-gray-400 text-xs">No place emergency numbers listed for today's stops.</Text>
                                                        )}
                                                    </View>
                                                </View>
                                            )}

                                            {/* Optimize Route button */}
                                            {dayTasks.length >= 3 && (
                                                <TouchableOpacity
                                                    onPress={() => optinmize(date.id)}
                                                    disabled={!!optimizing[date.id]}
                                                    className="mt-3 bg-white/20 rounded-xl py-2 px-4 flex-row items-center self-start"
                                                >
                                                    {optimizing[date.id]
                                                        ? <ActivityIndicator size="small" color="#fff" className="mr-2" />
                                                        : <Text className="text-sm mr-1"></Text>
                                                    }
                                                    <Text className="text-white text-xs font-bold">
                                                        {optimizing[date.id] ? 'Optimising…' : 'Optimise Route'}
                                                    </Text>
                                                    {!optimizing[date.id] && dayTasks.length >= 2 && (
                                                        <Text className="text-blue-200 text-xs ml-2">
                                                            {totalRouteKm(dayTasks)} km total
                                                        </Text>
                                                    )}
                                                </TouchableOpacity>
                                            )}
                                        </View>

                                        {/* Task List */}
                                        <View className="bg-white dark:bg-gray-800 rounded-b-2xl">
                                            {dayTasks.length === 0 ? (
                                                <View className="py-10 items-center">
                                                    <Image source={world} className="w-5 h-5"></Image>
                                                    <Text className="text-gray-400 dark:text-gray-500 text-base font-medium">No stops added yet</Text>
                                                    <Text className="text-gray-300 dark:text-gray-600 text-sm mt-1">Add hotels, attractions or restaurants</Text>
                                                </View>
                                            ) : (
                                                dayTasks.map((t, index) => {
                                                    const timeBefore = (travelTimes[date.id] || [])[index - 1];
                                                    const item = { ...t, _timeBefore: timeBefore };
                                                    return (
                                                        <StopItem
                                                            key={index}
                                                            t={item}
                                                            index={index}
                                                            dayId={date.id}
                                                            userEmergency={userEmergency}
                                                            isDark={isDark}
                                                            onView={() => {
                                                                if (t.hotel_name) navigation.navigate("Hotels", { hotel: t });
                                                                else if (t.restaurant_name) navigation.navigate("Resturants", { resturant: t });
                                                                else navigation.navigate("Attraction", { place: t });
                                                            }}
                                                            onDelete={() => deleteTask(date.id, index)}
                                                        />
                                                    );
                                                })
                                            )}


                                            {dayTasks.length > 0 && (
                                                <View className="px-4 py-3 flex-row justify-between items-center border-t border-gray-100 dark:border-gray-700">
                                                    <Text className="text-gray-400 dark:text-gray-500 text-xs">
                                                        {dayTasks.length} stop{dayTasks.length !== 1 ? 's' : ''} planned
                                                    </Text>
                                                    {dayTasks.length >= 2 && (
                                                        <Text className="text-blue-500 dark:text-blue-400 text-xs font-semibold">
                                                            {totalRouteKm(dayTasks)} km total
                                                        </Text>
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>

                            </View>
                        )
                    })}
                </ScrollView>

                {/* Bottom Navigation */}
                <View className="absolute bottom-0 w-full bg-white dark:bg-gray-900 pt-3 pb-5 px-8 flex-row justify-between items-center border-t border-gray-100 dark:border-gray-800" style={{ elevation: isDark ? 0 : 10, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 3 }}>
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Home")}>
                        <View className="w-2 h-2 rounded-full mb-1" />
                        <Text className="text-[13px] font-medium text-gray-400 dark:text-gray-500">Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Explore")}>
                        <View className="w-2 h-2 rounded-full mb-1" />
                        <Text className="text-[13px] font-medium text-gray-400 dark:text-gray-500">Explore</Text>
                    </TouchableOpacity>
                    <View className="items-center">
                        <View className="w-2 h-2 bg-blue-500 rounded-full mb-1" />
                        <Text className="text-[13px] font-bold text-blue-500">Schedule</Text>
                    </View>
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Profile")}>
                        <View className="w-2 h-2 rounded-full mb-1" />
                        <Text className="text-[13px] font-medium text-gray-400 dark:text-gray-500">Profile</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );
}