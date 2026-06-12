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
import pen from '../assets/pencil.png';
import document from '../assets/google-docs.png';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
    const navigation = useNavigation();

    const menuItem = (icon, label, iconBg) => (
        <TouchableOpacity
            onPress={() => Alert.alert("Clicked")}
            className="flex-row items-center py-4 px-4 border-b border-gray-100"
        >
            <View className={`h-10 w-10 rounded-xl ${iconBg} justify-center items-center`}>
                <Image source={icon} className="h-6 w-6" />
            </View>
            <Text className="text-gray-800 text-base font-semibold ml-3 flex-1">{label}</Text>
            <Text className="text-gray-300 text-xl">›</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView className="bg-white flex-1" edges={['top', 'right', 'left']}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

                    {/* Profile Header */}
                    <View className="px-4 pt-6 pb-4">
                        <View className="bg-white rounded-2xl border border-gray-100 p-5" style={{ elevation: 2 }}>
                            <View className="flex-row items-center">
                                <View className="relative">
                                    <Image source={Women} className="w-20 h-20 rounded-full" />
                                    <View className="absolute bottom-0 right-0 bg-blue-500 w-6 h-6 rounded-full justify-center items-center border-2 border-white">
                                        <Image source={pen} className="w-3 h-3"></Image>
                                    </View>
                                </View>
                                <View className="ml-4 flex-1">
                                    <Text className="text-gray-900 text-xl font-bold">Jhon Jhone</Text>
                                    <Text className="text-gray-500 text-sm mt-0.5">sarahJhon.Jhone@gmail.com</Text>
                                    <View className="flex-row items-center mt-1.5">
                                        <View className="bg-blue-50 rounded-full px-2.5 py-0.5">
                                            <Text className="text-blue-600 text-xs font-semibold">Travel Lover</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                className="items-center bg-blue-600 rounded-2xl py-3 mt-4"
                                onPress={() => Alert.alert("Clicked")}
                            >
                                <Text className="text-white text-base font-bold">Edit Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Stats Row */}
                    <View className="px-4 pb-4">
                        <View className="flex-row">
                            {[
                                { icon: hart, count: '24', label: 'Saved Places', bg: 'bg-red-100' },
                                { icon: calander, count: '8', label: 'Bookings', bg: 'bg-blue-100' },
                                { icon: star, count: '12', label: 'Reviews', bg: 'bg-yellow-100' },
                            ].map((item, i) => (
                                <View key={i} className="flex-1 mx-1.5 bg-white rounded-2xl border border-gray-100 py-4 items-center" style={{ elevation: 2 }}>
                                    <View className={`h-12 w-12 rounded-full ${item.bg} justify-center items-center`}>
                                        <Image source={item.icon} className="h-7 w-7" />
                                    </View>
                                    <Text className="text-gray-900 text-2xl font-bold mt-2">{item.count}</Text>
                                    <Text className="text-gray-400 text-xs mt-0.5">{item.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Account Settings */}
                    <View className="px-4 pb-4">
                        <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ elevation: 2 }}>
                            <View className="px-4 pt-4 pb-2">
                                <Text className="text-gray-900 text-lg font-bold">Account Settings</Text>
                            </View>
                            {menuItem(bell, 'Notifications', 'bg-blue-100')}
                            {menuItem(shield, 'Privacy', 'bg-green-100')}
                            {menuItem(settings, 'App Settings', 'bg-gray-100')}
                        </View>
                    </View>

                    {/* Help & Support */}
                    <View className="px-4 pb-4">
                        <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ elevation: 2 }}>
                            <View className="px-4 pt-4 pb-2">
                                <Text className="text-gray-900 text-lg font-bold">Help & Support</Text>
                            </View>
                            {menuItem(questionMark, 'FAQs', 'bg-orange-100')}
                            {menuItem(support, 'Contact Support', 'bg-purple-100')}
                            {menuItem(document, 'Terms & Privacy', 'bg-green-100')}
                        </View>
                    </View>

                    {/* Logout */}
                    <View className="px-4 pb-6">
                        <TouchableOpacity
                            onPress={() => Alert.alert("Clicked")}
                            className="bg-red-500 rounded-2xl py-4 items-center"
                            style={{ elevation: 2 }}
                        >
                            <Text className="text-white text-base font-bold">Log Out</Text>
                        </TouchableOpacity>
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
                    <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Tour Planing")}>
                        <View className="w-1.5 h-1.5 rounded-full mb-1" />
                        <Text className="text-[13px] font-medium text-gray-400">Schedule</Text>
                    </TouchableOpacity>
                    <View className="items-center">
                        <View className="w-1.5 h-1.5 bg-blue-500 rounded-full mb-1" />
                        <Text className="text-[13px] font-bold text-blue-500">Profile</Text>
                    </View>
                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );
}