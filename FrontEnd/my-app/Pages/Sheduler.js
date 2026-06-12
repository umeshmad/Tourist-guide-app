import "../global.css";
import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Calander from '../assets/event.png';
import Plus from '../assets/plus.png';
import calander2 from '../assets/schedule.png';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import bin from '../assets/delete.png';
import world from '../assets/world-map.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TourPlaning() {
    const navigation = useNavigation();
    const [task, setTask] = useState([]);

    const loadTask = async () => {
        try {
            const saved = await AsyncStorage.getItem('tasks');
            if (saved) {
                const parsed = JSON.parse(saved);
                setTask(parsed);
            } else {
                setTask([]);
            }
        } catch (err) {
            console.error('Failed to load tasks:', err);
        }
    };

    const deleteTask = async (index) => {
        try {
            const updated = task.filter((_, i) => i !== index);
            setTask(updated);
            await AsyncStorage.setItem('tasks', JSON.stringify(updated));
        } catch (err) {
            console.error('Failed to delete task:', err);
        }
    };

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            loadTask();
        }
    }, [isFocused]);

    return (
        <SafeAreaProvider>
            <SafeAreaView className="bg-white flex-1" edges={['top', 'right', 'left']}>
                <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

                    {/* Header */}
                    <View className="px-4 pt-6 pb-4">
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-gray-900 font-bold text-2xl">My Tour Plan</Text>
                                <Text className="text-gray-400 text-sm mt-0.5">Organize your perfect trip</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => Alert.alert("Clicked!")}
                                className="bg-blue-600 rounded-2xl px-4 py-2.5 flex-row items-center"
                                style={{ elevation: 3 }}
                            >
                                <Text className="text-white text-sm font-bold">+ Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Day infomation */}
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

                            {/* Task List */}
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
                                                    className="bg-blue-600 rounded-xl px-3 py-1.5"
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

                </ScrollView>

                {/* Bottom Navigation */}
                <View className="absolute bottom-0 w-full bg-white pt-3 pb-5 px-8 flex-row justify-between items-center border-t border-gray-100" style={{ elevation: 10 }}>
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Home")}>
                        <View className="w-1.5 h-1.5 rounded-full mb-1" />
                        <Text className="text-[13px] font-medium text-gray-400">Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Explore")}>
                        <View className="w-1.5 h-1.5 rounded-full mb-1" />
                        <Text className="text-[13px] font-medium text-gray-400">Explore</Text>
                    </TouchableOpacity>
                    <View className="items-center">
                        <View className="w-1.5 h-1.5 bg-blue-500 rounded-full mb-1" />
                        <Text className="text-[13px] font-bold text-blue-500">Schedule</Text>
                    </View>
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Profile")}>
                        <View className="w-1.5 h-1.5 rounded-full mb-1" />
                        <Text className="text-[13px] font-medium text-gray-400">Profile</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );
}