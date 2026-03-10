import "../global.css";
import React from "react";
import {Text, View, TextInput, Image, ScrollView, TouchableOpacity }from 'react-native';
import {SafeAreaProvider,SafeAreaView} from 'react-native-safe-area-context';
import explore from '../assets/explore.jpg';
import rec from '../assets/Rec.jpg';
import { useNavigation } from "@react-navigation/native";

export default function Explore(){
    const navigation=useNavigation();
    return (
        <SafeAreaProvider>
            <SafeAreaView className="bg-white flex-1 " edges={['top','left','right']}>
                <View className="justify-center rounded-xl px-4 relative w-full pt-6">
                    <Image source={explore} className="w-full h-48 rounded-xl"></Image>
                    <View className="absolute inset-0 bg-white/30"></View>
                    <View className="absolute inset-0 flex justify-center items-center ">
                        <Text className="text-black ">Hello</Text>
                    </View>
                </View>
                <Text className="text-black font-bold text-2xl pl-8 pt-4">Categories</Text>
                <View className="pt-4 px-4 flex-row justify-between">
                    <View className="flex rounded-2xl translate-y-2 bg-white border border-gray-200 items-center justify-end h-28 w-24">
                        <Text className="text-black font-medium">Hotels</Text>
                    </View>
                    <View className="flex rounded-2xl translate-y-2 bg-white border border-gray-200 items-center justify-end h-28 w-24">
                        <Text className="text-black font-medium">Restaurants</Text>
                    </View>
                    <View className="flex rounded-2xl translate-y-2 bg-white border border-gray-200 items-center justify-end h-28 w-24">
                        <Text className="text-black font-medium">Attractions</Text>
                    </View>
                    <View className="flex rounded-2xl translate-y-2 bg-white border border-gray-200 items-center justify-end h-28 w-24">
                        <Text className="text-black font-medium">Tours</Text>
                    </View>
                </View>
                <View className="flex-row justify-between">
                    <Text className="text-black text-2xl font-bold pl-8 pt-8 flex ">Recommended</Text>
                    <Text className="text-blue text-xl pr-8 pt-8 justify-center">See All</Text>
                </View>
                <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom:120}}>
                    <View className="px-4 mt-4 mb-4">
                        <View className="relative translate-y-2 flex overflow-hidden border border-gray-200 rounded-2xl">
                        <Image source={rec} className="w-full h-60 rounded-2xl"></Image>
                        <View className="bg-white/85 absolute bottom-0 w-full h-[55%]">
                            <View className="flex-row justify-between pt-3">
                                <Text className="font-medium text-blacktext-xl pl-6 ">Browns Beach</Text>
                                <Text className="text-black pr-4">rating</Text>
                            </View>
                            <Text className="text-black font-normal pl-6">Beautiful 13th century architecture with stunning stained glass windows</Text>
                            <View className="flex-row justify-between pt-3">
                                <Text className="font-medium text-blacktext-xl pl-6 pt-2">0.5 Km</Text>
                                    <TouchableOpacity
                                        onPress={() => Alert.alert("Clicked!")}
                                        className="bg-blue-700 rounded-xl py-3 px-4 mr-4"
                                    >
                                        <Text className="text-white text-base font-bold">
                                        View Details
                                        </Text>
                                    </TouchableOpacity>
                            </View>
                        </View>

                        </View>
                    </View>
                    <View className="px-4 mt-4">
                        <View className="relative translate-y-2 flex overflow-hidden border border-gray-200 rounded-2xl">
                        <Image source={rec} className="w-full h-60 rounded-2xl"></Image>
                        <View className="bg-white/85 absolute bottom-0 w-full h-[55%]">
                            <View className="flex-row justify-between pt-3">
                                <Text className="font-medium text-blacktext-xl pl-6 ">Browns Beach</Text>
                                <Text className="text-black pr-4">rating</Text>
                            </View>
                            <Text className="text-black font-normal pl-6">Beautiful 13th century architecture with stunning stained glass windows</Text>
                            <View className="flex-row justify-between pt-3">
                                <Text className="font-medium text-blacktext-xl pl-6 pt-2">0.5 Km</Text>
                                    <TouchableOpacity
                                        onPress={() => Alert.alert("Clicked!")}
                                        className="bg-blue-700 rounded-xl py-3 px-4 mr-4"
                                    >
                                        <Text className="text-white text-base font-bold">
                                        View Details
                                        </Text>
                                    </TouchableOpacity>
                            </View>
                        </View>

                        </View>
                    </View>
                    <View className="px-4 mt-4">
                        <View className="relative translate-y-2 flex overflow-hidden border border-gray-200 rounded-2xl">
                        <Image source={rec} className="w-full h-60 rounded-2xl"></Image>
                        <View className="bg-white/85 absolute bottom-0 w-full h-[55%]">
                            <View className="flex-row justify-between pt-3">
                                <Text className="font-medium text-blacktext-xl pl-6 ">Browns Beach</Text>
                                <Text className="text-black pr-4">rating</Text>
                            </View>
                            <Text className="text-black font-normal pl-6">Beautiful 13th century architecture with stunning stained glass windows</Text>
                            <View className="flex-row justify-between pt-3">
                                <Text className="font-medium text-blacktext-xl pl-6 pt-2">0.5 Km</Text>
                                <TouchableOpacity
                                    onPress={() => Alert.alert("Clicked!")}
                                    className="bg-blue-700 rounded-xl py-3 px-4 mr-4"
                                    >
                                    <Text className="text-white text-base font-bold">
                                        View Details
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        </View>
                    </View>
                </ScrollView>
                <View className="absolute bottom-0 h-20 w-full bg-white border-t border-gray-200 flex-row justify-around items-center">
                    <TouchableOpacity className="items-center" onPress={()=>navigation.navigate("Home")}>
                        <Text className="text-[16px] font-medium">Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    className="items-center" onPress={()=>navigation.navigate("Explore")}>
                        <Text className="text-[16px] font-medium">Explore</Text>
                    </TouchableOpacity>

                    <View className="items-center">
                        <Text className="text-[16px] font-medium">Profile</Text>
                    </View>

                </View>
                   
            </SafeAreaView>
        </SafeAreaProvider>
    )
}