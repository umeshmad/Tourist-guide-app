import React, { useState } from 'react';
import '../global.css';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import Women from '../assets/Women.jpg';
import camera from '../assets/camera.png'; // Assuming a camera icon exists or I can use pencil.png
import pen from '../assets/pencil.png';

export default function EditProfile() {
    const navigation = useNavigation();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [name, setName] = useState('Jhon Jhone');
    const [email, setEmail] = useState('sarahJhon.Jhone@gmail.com');
    const [phone, setPhone] = useState('+1 234 567 8900');
    const [bio, setBio] = useState('Travel Lover');
    const [emergencyName, setEmergencyName] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    const [emergencyRelation, setEmergencyRelation] = useState('');

    const handleSave = () => {
        // Here you would typically send the updated data to your backend
        navigation.goBack();
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top', 'left', 'right']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                            <Text className="text-blue-500 text-base">Cancel</Text>
                        </TouchableOpacity>
                        <Text className="text-gray-900 dark:text-white text-lg font-bold">Edit Profile</Text>
                        <TouchableOpacity onPress={handleSave} className="p-2">
                            <Text className="text-blue-500 text-base font-bold">Save</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                        {/* Profile Picture */}
                        <View className="items-center mt-8 mb-6">
                            <View className="relative">
                                <Image source={Women} className="w-28 h-28 rounded-full" />
                                <TouchableOpacity
                                    className="absolute bottom-0 right-0 bg-blue-500 w-8 h-8 rounded-full justify-center items-center border-2 border-white dark:border-gray-900"
                                    style={{ elevation: isDark ? 0 : 2 }}
                                >
                                    <Image source={pen} className="w-4 h-4" style={{ tintColor: 'white' }} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Form Fields */}
                        <View className="px-6 space-y-4">
                            <View>
                                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</Text>
                                <TextInput
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter your full name"
                                    placeholderTextColor={isDark ? '#9CA3AF' : '#D1D5DB'}
                                    className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3.5 text-gray-900 dark:text-white text-[15px]"
                                />
                            </View>

                            <View className="mt-4">
                                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</Text>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Enter your email"
                                    placeholderTextColor={isDark ? '#9CA3AF' : '#D1D5DB'}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={false}
                                    className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3.5 text-gray-500 dark:text-gray-400 text-[15px]"
                                />
                                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1 ml-1">Email cannot be changed directly.</Text>
                            </View>

                            <View className="mt-4">
                                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</Text>
                                <TextInput
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="Enter your phone number"
                                    placeholderTextColor={isDark ? '#9CA3AF' : '#D1D5DB'}
                                    keyboardType="phone-pad"
                                    className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3.5 text-gray-900 dark:text-white text-[15px]"
                                />
                            </View>

                            <View className="mt-4">
                                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Bio / Tagline</Text>
                                <TextInput
                                    value={bio}
                                    onChangeText={setBio}
                                    placeholder="e.g. Travel Lover"
                                    placeholderTextColor={isDark ? '#9CA3AF' : '#D1D5DB'}
                                    className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3.5 text-gray-900 dark:text-white text-[15px]"
                                />
                            </View>

                            {/* Emergency Contact Information */}
                            <View className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <Text className="text-base font-bold text-gray-900 dark:text-white mb-4">Emergency Contact</Text>

                                <View className="mb-4">
                                    <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Contact Person Name</Text>
                                    <TextInput
                                        value={emergencyName}
                                        onChangeText={setEmergencyName}
                                        placeholder="Enter contact person name"
                                        placeholderTextColor={isDark ? '#9CA3AF' : '#D1D5DB'}
                                        className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3.5 text-gray-900 dark:text-white text-[15px]"
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Emergency Contact Number</Text>
                                    <TextInput
                                        value={emergencyPhone}
                                        onChangeText={setEmergencyPhone}
                                        placeholder="Enter emergency contact number"
                                        placeholderTextColor={isDark ? '#9CA3AF' : '#D1D5DB'}
                                        keyboardType="phone-pad"
                                        className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3.5 text-gray-900 dark:text-white text-[15px]"
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Relationship</Text>
                                    <TextInput
                                        value={emergencyRelation}
                                        onChangeText={setEmergencyRelation}
                                        placeholder="e.g. Father, Spouse, Friend"
                                        placeholderTextColor={isDark ? '#9CA3AF' : '#D1D5DB'}
                                        className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3.5 text-gray-900 dark:text-white text-[15px]"
                                    />
                                </View>
                            </View>

                            {/* Travel Preferences */}
                            <View className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <Text className="text-base font-bold text-gray-900 dark:text-white mb-2">Travel Preferences</Text>
                                <Text className="text-xs text-gray-500 dark:text-gray-400 mb-4">Update the travel preferences you set during registration to get better recommendations.</Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Preferences', { isEditMode: true, email: email })}
                                    className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-2xl py-3.5 items-center justify-center"
                                >
                                    <Text className="text-blue-600 dark:text-blue-400 text-sm font-bold">Edit Travel Preferences</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
