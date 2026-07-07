import React, { useState } from 'react';
import '../global.css';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import plane from '../assets/plane.png';
import BASE_URL from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login({ navigation }) {
    const [email, setEmail] = useState('umesh1234@gmail.com');
    const [password, setPassword] = useState('12345678');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        try {
            const responce = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await responce.json();
            if (!responce.ok) {
                Alert.alert("Error", data.error);
                return;
            }
            await AsyncStorage.setItem('userEmail', email);
            navigation.navigate("Home");
        } catch (err) {
            Alert.alert("Error", "Could not connect to server");
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
                    <View className="px-6 py-8">
                        {/* Heading */}
                        <View className="items-center mb-8">
                            <View className="w-16 h-16 bg-blue-50 rounded-2xl justify-center items-center mb-4 border border-blue-100">
                                <Image className="text-3xl" source={plane}></Image>
                            </View>
                            <Text className="text-2xl font-bold text-gray-900">Welcome Back</Text>
                            <Text className="text-white text-sm mt-1 text-center">
                                Log in to continue your travel guide experience
                            </Text>
                        </View>

                        {/* Form */}
                        <View className="space-y-4">
                            <View>
                                <Text className="text-sm font-semibold text-gray-700 mb-1.5">Email Address</Text>
                                <TextInput
                                    placeholder="Enter your email"
                                    placeholderTextColor="#9CA3AF"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-gray-900 text-[15px]"
                                />
                            </View>

                            <View className="mt-4">
                                <Text className="text-sm font-semibold text-gray-700 mb-1.5">Password</Text>
                                <TextInput
                                    placeholder="Enter your password"
                                    placeholderTextColor="#9CA3AF"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-gray-900 text-[15px]"
                                />
                            </View>

                            {/* Forgot Password */}
                            <TouchableOpacity className="align-self-end mt-2">
                                <Text className="text-blue-600 text-sm font-medium text-right">Forgot Password?</Text>
                            </TouchableOpacity>

                            {/* Login Button */}
                            <TouchableOpacity
                                onPress={handleLogin}
                                className="bg-blue-600 rounded-2xl py-4 items-center mt-6 shadow-sm"
                                style={{ elevation: 2 }}
                            >
                                <Text className="text-white text-base font-bold">Log In</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Register Link */}
                        <View className="flex-row justify-center items-center mt-8">
                            <Text className="text-gray-500 text-sm">Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                                <Text className="text-blue-600 text-sm font-bold">Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
