import React from 'react';
import '../global.css';
import { View, Text, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Women from '../assets/Women.jpg';
import hart from '../assets/heart.png';
import calander from '../assets/calendar.png';
import star from '../assets/star.png';
import bell from '../assets/bell.png';
import shield from '../assets/shield.png';
import settings from '../assets/settings.png';
import questionMark from '../assets/question-mark.png';
import support from '../assets/microphone.png';
import document from '../assets/google-docs.png';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
    const navigation=useNavigation();
    return (
        <SafeAreaProvider>
            <SafeAreaView className="bg-white flex-1" edges={['top', 'right', 'left']}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="pt-4 px-4">
                        <View className="bg-white w-full rounded-2xl border border-gray-200 px-4 py-6">
                            <View className="flex-row items-center mb-5">
                                <Image source={Women} className="w-20 h-20 rounded-full" />
                                <View className="ml-4 flex-1">
                                    <Text className="text-black text-xl font-bold">Jhon Jhone</Text>
                                    <Text className="text-gray-600 text-sm font-medium mt-1">sarahJhon.Jhone@gmail.com</Text>
                                    <Text className="text-gray-600 text-sm font-medium mt-1">• Travel lover</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                className="items-center bg-blue-600 rounded-2xl py-3"
                                onPress={() => Alert.alert("Clicked")}
                            >
                                <Text className="text-white text-lg font-bold">Edit Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="pt-4 px-4">
                        <View className="flex-row">
                            <View className="flex-1 mx-2 rounded-xl border border-gray-200 translate-y-2 bg-white items-center justify-center py-2 px-2 ">
                                <View className="h-16 w-16 rounded-full relative bg-red-100">
                                    <View className="absolute flex justify-center items-center pt-2 pl-2">
                                        <Image source={hart} className=" h-12 w-12 "></Image>
                                    </View>
                                    
                                </View>
                                <Text className="text-black text-2xl font-bold pt-3">24</Text>
                                <Text className="text-gray text-l pt-3">Saved Places</Text>
                                
                            </View>
                            <View className="flex-1 mx-2 rounded-xl border border-gray-200 translate-y-2 bg-white items-center justify-center py-2 px-2">
                                <View className="h-16 w-16 rounded-full relative bg-blue-100">
                                    <View className="absolute flex justify-center items-center pt-2 pl-2">
                                        <Image source={calander} className=" h-12 w-12 overflow-hidden"></Image>
                                    </View>
                                    
                                </View>
                                <Text className="text-black text-2xl font-bold pt-3">8</Text>
                                <Text className="text-gray text-l pt-3">Booking</Text>
                                
                            </View>
                            <View className="flex-1 mx-2 rounded-xl border border-gray-200 translate-y-2 bg-white items-center justify-center py-2 px-2">
                                <View className="h-16 w-16 rounded-full relative bg-yellow-100">
                                    <View className="absolute flex justify-center items-center pt-2 pl-2">
                                        <Image source={star} className=" h-12 w-12 "></Image>
                                    </View>
                                    
                                </View>
                                <Text className="text-black text-2xl font-bold pt-3">12</Text>
                                <Text className="text-gray text-l pt-3">Reviews</Text>
                                
                            </View>
                            
                        </View>
                        <View className="bg-white w-full rounded-2xl border border-gray-200 px-4 mt-6 py-4">
                            <Text className="text-black text-2xl font-bold pt-3">Account Settings</Text>
                            <View className="h-[1px] bg-gray-300 mt-4"></View>
                            <View className="flex-row mt-3">
                                <View className="h-12 w-12 rounded-full relative bg-blue-100">
                                    <Image source={bell} className="h-8 w-8 absolute ml-2 mt-2"></Image>
                                </View>
                                <Text className="text-xl font-medium text-black mt-2 ml-3">Notifications</Text>
                            </View>
                            <View className="h-[1px] bg-gray-300 mt-4"></View>
                            <View className="flex-row mt-3">
                                <View className="h-12 w-12 rounded-full relative bg-green-100">
                                    <Image source={shield} className="h-8 w-8 absolute ml-2 mt-2"></Image>
                                </View>
                                <Text className="text-xl font-medium text-black mt-2 ml-3">Privacy</Text>
                            </View>
                            <View className="h-[1px] bg-gray-300 mt-4"></View>
                            <View className="flex-row mt-3 mb-2">
                                <View className="h-12 w-12 rounded-full relative bg-gray-100">
                                    <Image source={settings} className="h-8 w-8 absolute ml-2 mt-2"></Image>
                                </View>
                                <Text className="text-xl font-medium text-black mt-2 ml-3">App  Settings</Text>
                            </View>
                        </View>
                        <View className="bg-white w-full rounded-2xl border border-gray-200 px-4 mt-6 py-4">
                            <Text className="text-black text-2xl font-bold pt-3">Help & Support</Text>
                            <View className="h-[1px] bg-gray-300 mt-4"></View>
                            <View className="flex-row mt-3">
                                <View className="h-12 w-12 rounded-full relative bg-orange-100">
                                    <Image source={questionMark} className="h-8 w-8 absolute ml-2 mt-2"></Image>
                                </View>
                                <Text className="text-xl font-medium text-black mt-2 ml-3">FAQs</Text>
                            </View>
                            <View className="h-[1px] bg-gray-300 mt-4"></View>
                            <View className="flex-row mt-3">
                                <View className="h-12 w-12 rounded-full relative bg-purple-100">
                                    <Image source={support} className="h-8 w-8 absolute ml-2 mt-2"></Image>
                                </View>
                                <Text className="text-xl font-medium text-black mt-2 ml-3">Contact Support</Text>
                            </View>
                            <View className="h-[1px] bg-gray-300 mt-4"></View>
                            <View className="flex-row mt-3 mb-2">
                                <View className="h-12 w-12 rounded-full relative bg-green-100">
                                    <Image source={document} className="h-8 w-8 absolute ml-2 mt-2"></Image>
                                </View>
                                <Text className="text-xl font-medium text-black mt-2 ml-3">Terms & Privacy</Text>
                            </View>
                        </View>
                        <View className="mt-3  mb-24">
                            <TouchableOpacity onPress={()=>Alert.alert("Clicked")} className="relative w-full py-4 flex justify-center items-center relative bg-red-600 rounded-xl">
                                <Text className="text-xl text-white font-bold">Log Out</Text>

                            </TouchableOpacity>
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
                        
                            <TouchableOpacity className="items-center" onPress={()=>navigation.navigate("Tour Planing")}>
                                <Text className="text-[16px] font-medium">Sheduler</Text>
                            </TouchableOpacity>
                        
                            <TouchableOpacity className="items-center" onPress={()=>navigation.navigate("Profile")}>
                                <Text className="text-[16px] font-medium">Profile</Text>
                            </TouchableOpacity>
                        
                        </View>
                        
            </SafeAreaView>
        </SafeAreaProvider>
    );
}