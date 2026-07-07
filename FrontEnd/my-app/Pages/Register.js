import React, { useState } from 'react';
import '../global.css';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import user from '../assets/user.png';
import alarm from '../assets/alarm.png';
import BASE_URL from '../config';

export default function Register({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [emergencyName, setEmergencyName] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    const [emergencyRelation, setEmergencyRelation] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        if (!name || !email || !password || !phone) {
            Alert.alert("Missing Information", "Please fill in all personal details.");
            return;
        }
        if (!emergencyName || !emergencyPhone) {
            Alert.alert("Emergency Contact Required", "Please provide emergency contact person name and their phone number.");
            return;
        }

        const registrationData = {
            name,
            email,
            phone,
            password,
            emergencyContact: {
                name: emergencyName,
                phone: emergencyPhone,
                relationship: emergencyRelation
            }
        };

        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registrationData)
            });
            const data = await response.json();
            if (!response.ok) {
                Alert.alert("Registration Failed", data.error || "Something went wrong");
                return;
            }
            navigation.navigate("Preferences", { registrationData });
        } catch (err) {
            Alert.alert("Error", "Could not connect to server. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                    <View className="px-5 py-6">

                        {/* Header */}
                        <View className="mb-6">
                            <Text className="text-2xl font-bold text-gray-900">Create Account</Text>
                            <Text className="text-gray-400 text-sm mt-1">Join the ultimate travel companion community</Text>
                        </View>

                        {/* Personal Information */}
                        <View className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 shadow-sm" style={{ elevation: 1.5 }}>
                            <View className="flex-row">
                                <Image source={user} className="w-5 h-5 mt-1 mr-3"></Image>
                                <Text className="text-base font-bold text-gray-900 mb-3.5">Personal Information</Text>
                            </View>
                            <View className="mb-3">
                                <Text className="text-xs font-semibold text-gray-600 mb-1">Full Name</Text>
                                <TextInput
                                    placeholder="Sarah Jenkins"
                                    placeholderTextColor="#9CA3AF"
                                    value={name}
                                    onChangeText={setName}
                                    className="bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5 text-gray-900 text-sm"
                                />
                            </View>

                            <View className="mb-3">
                                <Text className="text-xs font-semibold text-gray-600 mb-1">Email Address</Text>
                                <TextInput
                                    placeholder="sarah@example.com"
                                    placeholderTextColor="#9CA3AF"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className="bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5 text-gray-900 text-sm"
                                />
                            </View>

                            <View className="mb-3">
                                <Text className="text-xs font-semibold text-gray-600 mb-1">Phone Number</Text>
                                <TextInput
                                    placeholder="+94 77 123 4567"
                                    placeholderTextColor="#9CA3AF"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    className="bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5 text-gray-900 text-sm"
                                />
                            </View>

                            <View>
                                <Text className="text-xs font-semibold text-gray-600 mb-1">Password</Text>
                                <TextInput
                                    placeholder="Create password"
                                    placeholderTextColor="#9CA3AF"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    className="bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5 text-gray-900 text-sm"
                                />
                            </View>
                        </View>

                        {/* Emergency Contact Information */}
                        <View className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 shadow-sm" style={{ elevation: 1.5 }}>
                            <View className="flex-row">
                                <Image source={alarm} className="w-5 h-5 mt-1 mr-2"></Image>
                                <Text className="text-base font-bold text-gray-900 mb-1"> Emergency Contact</Text>
                            </View>
                            <Text className="text-gray-400 text-xs mb-3.5">Who should we contact in case of an emergency?</Text>

                            <View className="mb-3">
                                <Text className="text-xs font-semibold text-gray-600 mb-1">Contact Person Name</Text>
                                <TextInput
                                    placeholder="John Jenkins"
                                    placeholderTextColor="#9CA3AF"
                                    value={emergencyName}
                                    onChangeText={setEmergencyName}
                                    className="bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5 text-gray-900 text-sm"
                                />
                            </View>

                            <View className="mb-3">
                                <Text className="text-xs font-semibold text-gray-600 mb-1">Emergency Contact Number</Text>
                                <TextInput
                                    placeholder="+94 71 987 6543"
                                    placeholderTextColor="#9CA3AF"
                                    value={emergencyPhone}
                                    onChangeText={setEmergencyPhone}
                                    keyboardType="phone-pad"
                                    className="bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5 text-gray-900 text-sm"
                                />
                            </View>

                            <View className="mb-6">
                                <Text className="text-xs font-semibold text-gray-600 mb-1">Relationship (Optional)</Text>
                                <TextInput
                                    placeholder="e.g. Father, Spouse, Friend"
                                    placeholderTextColor="#9CA3AF"
                                    value={emergencyRelation}
                                    onChangeText={setEmergencyRelation}
                                    className="bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5 text-gray-900 text-sm"
                                />
                            </View>
                        </View>

                        {/* Next Button */}
                        <TouchableOpacity
                            onPress={handleNext}
                            disabled={loading}
                            className={`rounded-2xl py-4 items-center mb-6 ${loading ? 'bg-blue-300' : 'bg-blue-600'}`}
                            style={{ elevation: 2 }}
                        >
                            {loading
                                ? <ActivityIndicator color="#fff" />
                                : <Text className="text-white text-base font-bold">Continue to Preferences</Text>
                            }
                        </TouchableOpacity>

                        {/* Already have account */}
                        <View className="flex-row justify-center items-center">
                            <Text className="text-gray-500 text-sm">Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text className="text-blue-600 text-sm font-bold">Log In</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
