import "../global.css";
import React from "react";
import { View, Text, Image, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Calander from '../assets/event.png';
import Plus from '../assets/plus.png';
import calander2 from '../assets/schedule.png';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useState, useEffect } from "react";
import logo from '../assets/search.png';
import bin from '../assets/delete.png';
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
                    <View className="flex-row justify-between px-4 pt-4">
                        <Text className="text-black font-bold text-2xl flex justify-center">Paris Adventure</Text>
                        <TouchableOpacity
                            onPress={() => Alert.alert("Clicked!")}
                            className="bg-blue-600 rounded-xl px-4 py-2 flex justify-center items-center">
                            <Text className="text-white text-base font-bold">+  Add</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row pt-3 px-4">
                        <Image source={Calander} className="w-8 h-8"></Image>
                        <Text className="text-gray-500 text-xl pt-1 px-3">1 Day Tour</Text>
                    </View>
                    <View className="px-4 mt-8">
                        <View className="bg-blue-700 w-full rounded-2xl border border-gray-200">
                            <View className="pt-4 px-4 pb-4 flex-row justify-between items-center">
                                <View className="w-16 h-16 rounded-full relative bg-white/30 flex justify-center items-center">
                                    <Image source={calander2} className="absolute w-10 h-10"></Image>
                                </View>
                                <View className="flex-col flex-1 pl-4">
                                    <Text className="text-white font-bold text-xl">Day 1</Text>
                                    <Text className="text-white text-base">Monday, March 15</Text>
                                </View>

                                <View className="">
                                    <View className="w-10 h-10 rounded-full relative bg-white/30 flex justify-center items-center">
                                        <Image source={Plus} className="absolute w-5 h-5"></Image>
                                    </View>
                                </View>
                            </View>

                            <View className="bg-white rounded-b-2xl">
                                {task.length === 0 ? (
                                    <Text className="text-gray-400 text-base py-8 text-center">No Tasks Added</Text>
                                ) : (
                                    task.map((t, index) => (
                                        <View key={index} className="flex-row justify-between items-center py-4 px-4 border-b border-gray-100">
                                            <Text className="text-black font-bold text-lg flex-1 pr-2" numberOfLines={1}>
                                                {t.attraction_name || t.hotel_name}
                                            </Text>
                                            <View className="flex-row ml-2">
                                                <TouchableOpacity onPress={() => {
                                                    if (t.hotel_name) navigation.navigate("Hotels", { hotel: t });
                                                    else navigation.navigate("Attraction", { place: t })
                                                }}
                                                    className="bg-blue-600 flex justify-center items-center rounded-xl px-4 py-2">
                                                    <Text className="text-white text-sm font-bold">View</Text>
                                                </TouchableOpacity>
                                                <Image source={bin} className="w-9 h-9 ml-2"></Image>
                                            </View>
                                        </View>
                                    ))
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View className="absolute bottom-0 h-20 w-full bg-white border-t border-gray-200 flex-row justify-around items-center">
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Home")}>
                        <Text className="text-[16px] font-medium">Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="items-center" onPress={() => navigation.navigate("Explore")}>
                        <Text className="text-[16px] font-medium">Explore</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Tour Planing")}>
                        <Text className="text-[16px] font-medium">Sheduler</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Profile")}>
                        <Text className="text-[16px] font-medium">Profile</Text>
                    </TouchableOpacity>

                </View>


            </SafeAreaView>
        </SafeAreaProvider>
    )

}