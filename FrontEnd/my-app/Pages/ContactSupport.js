import React, { useState, useRef } from 'react';
import '../global.css';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Alert, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import support from '../assets/microphone.png';
import emailIcon from '../assets/email.png';
import phoneIcon from '../assets/phone.png';
import clockIcon from '../assets/clock.png';
import bugIcon from '../assets/bug.png';
import sparkleIcon from '../assets/sparkle.png';
import userIcon from '../assets/user.png';
import chatIcon from '../assets/chat.png';
import officeIcon from '../assets/office.png';

export default function ContactSupport() {
    const navigation = useNavigation();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [
        { id: 'bug', label: 'Bug Report', icon: bugIcon, color: 'bg-red-100 dark:bg-red-900/30', borderColor: 'border-red-200 dark:border-red-800', activeColor: 'bg-red-500' },
        { id: 'feature', label: 'Feature Request', icon: sparkleIcon, color: 'bg-purple-100 dark:bg-purple-900/30', borderColor: 'border-purple-200 dark:border-purple-800', activeColor: 'bg-purple-500' },
        { id: 'account', label: 'Account Issue', icon: userIcon, color: 'bg-blue-100 dark:bg-blue-900/30', borderColor: 'border-blue-200 dark:border-blue-800', activeColor: 'bg-blue-500' },
        { id: 'general', label: 'General Inquiry', icon: chatIcon, color: 'bg-green-100 dark:bg-green-900/30', borderColor: 'border-green-200 dark:border-green-800', activeColor: 'bg-green-500' },
    ];

    const handleSubmit = () => {
        if (!name.trim() || !email.trim() || !message.trim()) {
            Alert.alert('Missing Information', 'Please fill in your name, email, and message before submitting.');
            return;
        }
        if (!selectedCategory) {
            Alert.alert('Select Category', 'Please select a category for your inquiry.');
            return;
        }
        Alert.alert(
            'Message Sent!',

            'Thank you for reaching out. Our support team will get back to you within 24-48 hours.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
    };

    const InputField = ({ label, value, onChangeText, placeholder, multiline, keyboardType }) => (
        <View className="mb-4">
            <Text className="text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2 px-1">{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                keyboardType={keyboardType || 'default'}
                multiline={multiline}
                numberOfLines={multiline ? 5 : 1}
                textAlignVertical={multiline ? 'top' : 'center'}
                className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 ${multiline ? 'py-3 min-h-[120px]' : 'py-3.5'} text-gray-800 dark:text-gray-200 text-[15px]`}
                style={{ elevation: isDark ? 0 : 0.5 }}
            />
        </View>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top', 'left', 'right']}>
                {/* Header */}
                <View className="flex-row items-center px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
                        <Text className="text-gray-500 dark:text-gray-400 text-xl font-medium">‹</Text>
                    </TouchableOpacity>
                    <Image
                        source={support}
                        className="w-6 h-6 mr-3 opacity-80"
                        style={isDark ? { tintColor: 'white' } : {}}
                    />
                    <Text className="text-gray-900 dark:text-white text-lg font-bold">Contact Support</Text>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    className="flex-1"
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>

                        {/* Contact info cards */}
                        <View className="flex-row mb-6">
                            <TouchableOpacity
                                onPress={() => Linking.openURL('mailto:support@touristguide.lk')}
                                className="flex-1 mr-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 items-center"
                                style={{ elevation: isDark ? 0 : 1.5 }}
                            >
                                <Image source={emailIcon} className="w-8 h-8 mb-2" />
                                <Text className="text-gray-900 dark:text-white text-sm font-bold">Email Us</Text>
                                <Text className="text-blue-500 text-xs mt-1 font-medium">support@touristguide.lk</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => Linking.openURL('tel:+94112345678')}
                                className="flex-1 ml-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 items-center"
                                style={{ elevation: isDark ? 0 : 1.5 }}
                            >
                                <Image source={phoneIcon} className="w-8 h-8 mb-2" />
                                <Text className="text-gray-900 dark:text-white text-sm font-bold">Call Us</Text>
                                <Text className="text-blue-500 text-xs mt-1 font-medium">+94 11 234 5678</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Response time notice */}
                        <View className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 mb-6 border border-green-100 dark:border-green-800">
                            <View className="flex-row items-center">
                                <Image source={clockIcon} className="w-6 h-6 mr-2" />
                                <View className="flex-1">
                                    <Text className="text-green-700 dark:text-green-300 text-sm font-semibold">Average Response Time</Text>
                                    <Text className="text-green-600 dark:text-green-400 text-xs mt-0.5">We typically respond within 24-48 hours on business days.</Text>
                                </View>
                            </View>
                        </View>

                        {/* Category Selection */}
                        <Text className="text-gray-900 dark:text-white text-base font-bold mb-3 px-1">What can we help with?</Text>
                        <View className="flex-row flex-wrap mb-6">
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    onPress={() => setSelectedCategory(cat.id)}
                                    className={`mr-2 mb-2 px-4 py-2.5 rounded-xl border ${selectedCategory === cat.id
                                        ? `${cat.activeColor} border-transparent`
                                        : `${cat.color} ${cat.borderColor}`
                                        }`}
                                >
                                    <View className="flex-row items-center">
                                        <Image source={cat.icon} className="w-4 h-4 mr-1.5" style={{ tintColor: selectedCategory === cat.id ? '#ffffff' : (isDark ? '#D1D5DB' : '#374151') }} />
                                        <Text className={`text-sm font-semibold ${selectedCategory === cat.id
                                            ? 'text-white'
                                            : 'text-gray-700 dark:text-gray-300'
                                            }`}>
                                            {cat.label}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Contact Form */}
                        <Text className="text-gray-900 dark:text-white text-base font-bold mb-3 px-1">Send us a message</Text>
                        <View
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-6"
                            style={{ elevation: isDark ? 0 : 1.5 }}
                        >
                            <InputField
                                label="Full Name"
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your full name"
                            />
                            <InputField
                                label="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                placeholder="your.email@example.com"
                                keyboardType="email-address"
                            />
                            <InputField
                                label="Subject"
                                value={subject}
                                onChangeText={setSubject}
                                placeholder="Brief description of your issue"
                            />
                            <InputField
                                label="Message"
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Describe your issue or question in detail..."
                                multiline={true}
                            />
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            className="bg-blue-600 rounded-2xl py-4 items-center mb-4"
                            style={{ elevation: isDark ? 0 : 2 }}
                        >
                            <Text className="text-white text-base font-bold">Send Message</Text>
                        </TouchableOpacity>

                        {/* Office info */}
                        <View
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mt-2"
                            style={{ elevation: isDark ? 0 : 1.5 }}
                        >
                            <View className="flex-row items-center mb-3">
                                <Image source={officeIcon} className="w-5 h-5 mr-2" style={isDark ? { tintColor: 'white' } : {}} />
                                <Text className="text-gray-900 dark:text-white text-base font-bold">Our Office</Text>
                            </View>
                            <Text className="text-gray-600 dark:text-gray-400 text-sm leading-6">
                                Tourist Guide (Pvt) Ltd{'\n'}
                                42 Galle Road, Colombo 03{'\n'}
                                Sri Lanka{'\n\n'}
                                Business Hours:{'\n'}
                                Mon – Fri: 9:00 AM – 6:00 PM (IST){'\n'}
                                Sat: 9:00 AM – 1:00 PM (IST)
                            </Text>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
