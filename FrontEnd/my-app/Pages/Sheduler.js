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

// Memoized stop row — prevents re-render of unchanged stops (fixes VirtualizedList warning)
const TravelConnector = React.memo(({ timeBefore }) => (
    <View className="flex-row items-center px-5 py-1 bg-blue-50">
        <View className="w-1 h-4 bg-blue-300 ml-4 mr-3" />
        <Text className="text-blue-400 text-xs italic">
            {timeBefore ? ` ${timeBefore}` : '↓'}
        </Text>
    </View>
));
const callNumber=(rawnumber)=>{
    if(!rawnumber)
        return
    // Extract number from formats like "Police: 119" or just "119"
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


const StopItem = React.memo(({ t, index, onView, onDelete, userEmergency }) => {
    const [showEmergency, setShowEmergency] = useState(false);
    const placeEmergency = t.emergency || null;
    const hasEmergency = !!(placeEmergency || userEmergency);

    return (
        <View>
            {index > 0 && <TravelConnector timeBefore={t._timeBefore} />}

            {/* Stop row */}
            <View className={`py-3 px-4 ${hasEmergency && !showEmergency ? '' : 'border-b border-gray-100'}`}>
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center flex-1 pr-2">
                        <View className="bg-blue-50 w-8 h-8 rounded-full justify-center items-center mr-3">
                            <Text className="text-blue-600 text-xs font-bold">{index + 1}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 font-bold text-sm" numberOfLines={1}>
                                {t.attraction_name || t.hotel_name || t.restaurant_name}
                            </Text>
                            <Text className="text-gray-400 text-xs" numberOfLines={1}>
                                {t.hotel_name ? 'Hotel' : t.restaurant_name ? 'Restaurant' : 'Attraction'}
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row items-center ml-2">
                        {hasEmergency && (
                            <TouchableOpacity
                                onPress={() => setShowEmergency(p => !p)}
                                className={`rounded-lg border border-red-200 mr-2 ${showEmergency ? 'bg-red-50' : 'bg-red-50'}`}
                            >
                                <Image source={emergency1} className="h-6 w-6"></Image>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={onView} className="bg-blue-600 rounded-lg px-3 py-2 mr-2">
                            <Text className="text-white text-xs font-bold">View</Text>
                        </TouchableOpacity>
                        {/* delete icon */}
                        <TouchableOpacity onPress={onDelete} className="ml-2 bg-red-50 rounded-lg p-2">
                            <Image source={trashbin} className="w-6 h-6"></Image>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Emergency Panel */}
                {showEmergency && (
                    <View className="mt-3 bg-red-50 rounded-xl p-3 border border-red-200">
                        <View className="flex-row">
                            <Image source={emergency1} className="h-10 w-10"></Image>
                            <Text className="text-red-700 font-bold text-sm mb-2">Emergency Contacts</Text>
                        </View>
                        {placeEmergency ? (
                            <View className="mb-2">
                                <Text className="text-red-600 text-xs font-bold mb-1">Place Emergency Numbers</Text>
                                {placeEmergency.split(';').map((line, i) => (
                                    <TouchableOpacity key={i} onPress={() => callNumber(line.trim())}>
                                        <Text className="text-blue-600 text-xs leading-tight underline">{line.trim()}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : null}

                        {userEmergency ? (
                            <View className={`${placeEmergency ? 'border-t border-red-200 pt-2' : ''}`}>
                                <Text className="text-red-600 text-xs font-bold mb-1">👤 Your Emergency Contact</Text>
                                {userEmergency.name ? (
                                    <Text className="text-gray-700 text-xs leading-snug">• Name: <Text className="font-bold">{userEmergency.name}</Text></Text>
                                ) : null}
                                {userEmergency.phone ? (
                                    <Text className="text-gray-700 text-xs leading-snug">• Phone: <Text className="font-bold text-red-600">{userEmergency.phone}</Text></Text>
                                ) : null}
                                {userEmergency.relationship ? (
                                    <Text className="text-gray-500 text-xs leading-snug">• Relationship: {userEmergency.relationship}</Text>
                                ) : null}
                                {/* fallback if stored as plain string */}
                                {typeof userEmergency === 'string' ? (
                                    <Text className="text-gray-700 text-xs leading-tight">{userEmergency}</Text>
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
    const [task, setTask] = useState({});
    const [travelTimes, setTravelTimes] = useState({}); // { [dayId]: ['~12 min drive', ...] }
    const [optimizing, setOptimizing] = useState({}); // { [dayId]: true/false }
    const [userEmergency, setUserEmergency] = useState(null);
    const [showDayEmergency, setShowDayEmergency] = useState({}); // { [dayId]: true/false }


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
            console.log('[Emergency] email from storage:', email);
            // fallback: use default test email if not stored yet
            if (!email) email = 'umesh1234@gmail.com';
            const url = `${BASE_URL}/auth/user?email=${encodeURIComponent(email)}`;
            console.log('[Emergency] fetching:', url);
            const res = await fetch(url);
            const data = await res.json();
            console.log('[Emergency] response:', JSON.stringify(data));
            if (data.success && data.user?.emergencyContact) {
                setUserEmergency(data.user.emergencyContact);
                console.log('[Emergency] contact set:', JSON.stringify(data.user.emergencyContact));
            } else {
                console.log('[Emergency] no emergencyContact in response');
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
    const addDay = () => {
        setDate(prev => {
            const newDay = { id: prev.length + 1, dateStr: formatDate(new Date()) };
            setTask(p => ({ ...p, [newDay.id]: [] }));
            return [...prev, newDay];
        });
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
        if (stops.length <= 2) {
            return stops;
        }
        const remaining = [...stops];
        const ordered = [remaining.splice(0, 1)[0]];
        while (remaining.length > 0) {
            const lastIndex = ordered[ordered.length - 1];
            let bestindex = 0;
            let bestDestination = Infinity;
            remaining.forEach((s, i) => {
                const Destination = getDistanceKm(lastIndex.latitude, lastIndex.longitude,
                    s.latitude, s.longitude)
                if (Destination < bestDestination) {
                    bestDestination = Destination; bestindex = i;
                }
            });

            ordered.push(remaining.splice(bestindex, 1)[0]);
        }
        return ordered;
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
            <SafeAreaView className="bg-white flex-1" edges={['top', 'right', 'left']}>
                <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

                    {/* Header */}
                    <View className="px-4 pt-6 pb-4">
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-gray-900 font-bold text-2xl">My Tour Plan</Text>
                                <Text className="text-gray-400 text-sm mt-1">Organize your perfect trip</Text>
                            </View>
                            <TouchableOpacity
                                onPress={addDay}
                                className="bg-blue-600 rounded-2xl px-4 py-2 flex-row items-center"
                                style={{ elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 1 }}
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
                                <View className="mx-4 mb-4 flex-row items-center bg-blue-50 rounded-2xl px-4 py-3 border border-blue-100">
                                    <Image source={Calander} className="w-7 h-7" />
                                    <View className="ml-3">
                                        <Text className="text-blue-700 font-bold text-base">{date.id} Day Tour</Text>
                                    </View>
                                </View>

                                <View className="mx-4">
                                    <View className="bg-blue-700 rounded-2xl overflow-hidden" style={{ elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 }}>

                                        <View className="px-4 py-4">
                                            {/* Day header row */}
                                            <View className="flex-row justify-between items-center">
                                                <View className="flex-row items-center">
                                                    <View className="w-14 h-14 rounded-full bg-white/25 justify-center items-center">
                                                        <Image source={calander2} className="w-9 h-9" />
                                                    </View>
                                                    <View className="ml-3">
                                                        <Text className="text-white font-bold text-xl">Day {date.id}</Text>
                                                        <Text className="text-blue-200 text-sm">{date.dateStr}</Text>
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
                                                <View className="mt-3 bg-red-50 rounded-2xl p-3 border border-red-200">
                                                        <View className="flex-row">
                                                            <Image source={emergency1} className="h-6 w-6"></Image>
                                                            <Text className="text-red-700 font-bold text-sm mb-2">Day Emergency Contacts</Text>
                                                        </View>
                                                    {/* User emergency contact */}
                                                    <View className="mb-3 bg-white rounded-lg p-3 border-l-3 border-l-red-600">
                                                        <Text className="text-red-600 text-xs font-bold mb-2">👤 Your Personal Emergency Contact</Text>
                                                        {userEmergency ? (
                                                            <View>
                                                                {userEmergency.name ? <Text className="text-gray-700 text-xs leading-snug">• Name: <Text className="font-bold">{userEmergency.name}</Text></Text> : null}
                                                                {userEmergency.phone ? <Text className="text-gray-700 text-xs leading-snug">• Phone: <Text className="font-bold text-red-600">{userEmergency.phone}</Text></Text> : null}
                                                                {userEmergency.relationship ? <Text className="text-gray-500 text-xs leading-snug">• Relationship: {userEmergency.relationship}</Text> : null}
                                                            </View>
                                                        ) : (
                                                            <Text className="text-gray-400 text-xs">No personal emergency contact set.</Text>
                                                        )}
                                                    </View>

                                                    {/* Scheduled places emergency contacts */}
                                                    <View className="bg-white rounded-lg p-3 border-l-3 border-l-red-500">
                                                        <Text className="text-red-600 text-xs font-bold mb-2">📍 Scheduled Places Emergency Contacts</Text>
                                                        {dayTasks.filter(t => t.emergency).length > 0 ? (
                                                            dayTasks.filter(t => t.emergency).map((t, idx) => (
                                                                <View key={idx} className={`${idx < dayTasks.filter(t => t.emergency).length - 1 ? 'mb-2' : ''}`}>
                                                                    <Text className="text-gray-900 text-xs font-bold">• {t.attraction_name || t.hotel_name || t.restaurant_name}</Text>
                                                                    {t.emergency.split(';').map((line, i) => (
                                                                        <Text key={i} className="text-gray-700 text-xs leading-tight pl-3">  - {line.trim()}</Text>
                                                                    ))}
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
                                        <View className="bg-white rounded-b-2xl">
                                            {dayTasks.length === 0 ? (
                                                <View className="py-10 items-center">
                                                    <Image source={world} className="w-5 h-5"></Image>
                                                    <Text className="text-gray-400 text-base font-medium">No stops added yet</Text>
                                                    <Text className="text-gray-300 text-sm mt-1">Add hotels, attractions or restaurants</Text>
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
                                                <View className="px-4 py-3 flex-row justify-between items-center border-t border-gray-100">
                                                    <Text className="text-gray-400 text-xs">
                                                        {dayTasks.length} stop{dayTasks.length !== 1 ? 's' : ''} planned
                                                    </Text>
                                                    {dayTasks.length >= 2 && (
                                                        <Text className="text-blue-500 text-xs font-semibold">
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


                    {/* Day infomation */}
                    {/*
                    <View className="mx-4 mb-4 flex-row items-center bg-blue-50 rounded-2xl px-4 py-3 border border-blue-100">
                        <Image source={Calander} className="w-7 h-7" />
                        <View className="ml-3">
                            <Text className="text-blue-700 font-bold text-base">Day 1 — 1 Day Tour</Text>
                            <Text className="text-blue-400 text-xs">Monday, March 15</Text>
                        </View>
                    </View>

                    <View className="mx-4">
                        <View className="bg-blue-700 rounded-2xl overflow-hidden" style={{ elevation: 4 }}>

                            <View className="px-4 py-4 flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <View className="w-14 h-14 rounded-full bg-white/25 justify-center items-center">
                                        <Image source={calander2} className="w-9 h-9" />
                                    </View>
                                    <View className="ml-3">
                                        <Text className="text-white font-bold text-xl">Day 1</Text>
                                        <Text className="text-blue-200 text-sm">Monday, March 15</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => Alert.alert("Clicked!")}>
                                    <View className="w-10 h-10 rounded-full bg-white/25 justify-center items-center">
                                        <Image source={Plus} className="w-5 h-5" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            */}

                    {/* Task List */}
                    {/*
                            <View className="bg-white rounded-b-2xl">
                                {task.length === 0 ? (
                                    <View className="py-10 items-center">
                                        <Image source={world} className="w-5 h-5"></Image>
                                        <Text className="text-gray-400 text-base font-medium">No stops added yet</Text>
                                        <Text className="text-gray-300 text-sm mt-1">Add hotels, attractions or restaurants</Text>
                                    </View>
                                ) : (
                                    task.map((t, index) => (
                                        <View key={index} className="flex-row justify-between items-center py-4 px-4 border-b border-gray-100">
                                            <View className="flex-row items-center flex-1 pr-2">
                                                <View className="bg-blue-50 w-8 h-8 rounded-full justify-center items-center mr-3">
                                                    <Text className="text-blue-600 text-xs font-bold">{index + 1}</Text>
                                                </View>
                                                <Text className="text-gray-900 font-bold text-base flex-1" numberOfLines={1}>
                                                    {t.attraction_name || t.hotel_name || t.restaurant_name}
                                                </Text>
                                            </View>
                                            <View className="flex-row items-center ml-2">
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        if (t.hotel_name) navigation.navigate("Hotels", { hotel: t });
                                                        else if (t.restaurant_name) navigation.navigate("Resturants", { resturant: t });
                                                        else navigation.navigate("Attraction", { place: t });
                                                    }}
                                                    className="bg-blue-600 rounded-xl px-3 py-2"
                                                >
                                                    <Text className="text-white text-xs font-bold">View</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => deleteTask(index)}
                                                    className="ml-2 bg-red-50 rounded-xl p-2"
                                                >
                                                    <Image source={bin} className="w-5 h-5" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))
                                )}
                            

                                {task.length > 0 && (
                                    <View className="px-4 py-3">
                                        <Text className="text-gray-400 text-xs text-center">{task.length} stop{task.length !== 1 ? 's' : ''} planned</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                    */}

                </ScrollView>

                {/* Bottom Navigation */}
                <View className="absolute bottom-0 w-full bg-white pt-3 pb-5 px-8 flex-row justify-between items-center border-t border-gray-100" style={{ elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 3 }}>
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Home")}>
                        <View className="w-2 h-2 rounded-full mb-1" />
                        <Text className="text-[13px] font-medium text-gray-400">Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Explore")}>
                        <View className="w-2 h-2 rounded-full mb-1" />
                        <Text className="text-[13px] font-medium text-gray-400">Explore</Text>
                    </TouchableOpacity>
                    <View className="items-center">
                        <View className="w-2 h-2 bg-blue-500 rounded-full mb-1" />
                        <Text className="text-[13px] font-bold text-blue-500">Schedule</Text>
                    </View>
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Profile")}>
                        <View className="w-2 h-2 rounded-full mb-1" />
                        <Text className="text-[13px] font-medium text-gray-400">Profile</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );
}