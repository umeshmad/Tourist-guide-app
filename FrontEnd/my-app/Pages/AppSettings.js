import React, { useState, useEffect } from 'react';
import '../global.css';
import { View, Text, TouchableOpacity, ScrollView, Switch, Image, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import settingsIcon from '../assets/settings.png';

export default function AppSettings() {
    const navigation = useNavigation();
    const { colorScheme, setColorScheme } = useColorScheme();
    const isDarkTheme = colorScheme === 'dark';
    
    // Settings State
    const [loading, setLoading] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [locationServices, setLocationServices] = useState(true);
    const [currency, setCurrency] = useState('USD ($)');
    
    // Dynamic Route Recommendations
    const [searchRadius, setSearchRadius] = useState(10); // in km

    // Load settings from AsyncStorage on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedSettings = await AsyncStorage.getItem('appSettings');
                if (savedSettings) {
                    const parsed = JSON.parse(savedSettings);
                    if (parsed.pushNotifications !== undefined) setPushNotifications(parsed.pushNotifications);
                    if (parsed.locationServices !== undefined) setLocationServices(parsed.locationServices);
                    if (parsed.currency) setCurrency(parsed.currency);
                    if (parsed.searchRadius) setSearchRadius(parsed.searchRadius);
                }
            } catch (error) {
                console.error("Failed to load settings", error);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    // Save settings whenever they change
    useEffect(() => {
        if (loading) return; // Don't save while initially loading
        const saveSettings = async () => {
            const settingsToSave = {
                isDarkMode: isDarkTheme,
                pushNotifications,
                locationServices,
                currency,
                searchRadius
            };
            try {
                await AsyncStorage.setItem('appSettings', JSON.stringify(settingsToSave));
            } catch (error) {
                console.error("Failed to save settings", error);
            }
        };
        saveSettings();
    }, [isDarkTheme, pushNotifications, locationServices, currency, searchRadius, loading]);

    const handleThemeToggle = (value) => {
        setColorScheme(value ? 'dark' : 'light');
    };

    const SettingsSection = ({ title, children }) => (
        <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-base font-bold mb-3 px-1">{title}</Text>
            <View className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden" style={{ elevation: isDarkTheme ? 0 : 1.5 }}>
                {children}
            </View>
        </View>
    );

    const ToggleItem = ({ label, description, value, onValueChange, isLast }) => (
        <View className={`flex-row justify-between items-center px-4 py-4 ${!isLast ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
            <View className="flex-1 pr-4">
                <Text className="text-gray-800 dark:text-gray-300 text-[15px] font-semibold">{label}</Text>
                {description && <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1">{description}</Text>}
            </View>
            <Switch
                trackColor={{ false: isDarkTheme ? "#374151" : "#E5E7EB", true: "#3B82F6" }}
                thumbColor={"#ffffff"}
                ios_backgroundColor={isDarkTheme ? "#374151" : "#E5E7EB"}
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    );

    const SelectionItem = ({ label, value, options, onSelect, isLast }) => {
        const handlePress = () => {
            const currentIndex = options.indexOf(value);
            const nextIndex = (currentIndex + 1) % options.length;
            onSelect(options[nextIndex]);
        };

        return (
            <TouchableOpacity onPress={handlePress} className={`flex-row justify-between items-center px-4 py-4 ${!isLast ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                <Text className="text-gray-800 dark:text-gray-300 text-[15px] font-semibold">{label}</Text>
                <View className="flex-row items-center bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-600">
                    <Text className="text-blue-500 font-semibold text-sm mr-1">{value}</Text>
                    <Text className="text-gray-400 dark:text-gray-500 text-lg leading-4">›</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const RadiusSelector = () => (
        <View className="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
            <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-800 dark:text-gray-300 text-[15px] font-semibold">Search Radius</Text>
                <Text className="text-blue-500 font-bold">{searchRadius} km</Text>
            </View>
            <Text className="text-gray-400 dark:text-gray-500 text-xs mb-3">Maximum distance to look for dynamic route recommendations and nearby spots.</Text>
            
            <View className="flex-row justify-between items-center">
                {[5, 10, 20, 50].map((radius) => (
                    <TouchableOpacity 
                        key={radius}
                        onPress={() => setSearchRadius(radius)}
                        className={`flex-1 mx-1 py-2 rounded-xl items-center border ${searchRadius === radius ? 'bg-blue-600 border-blue-600' : 'bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600'}`}
                    >
                        <Text className={`font-semibold text-sm ${searchRadius === radius ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            {radius}km
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 justify-center items-center">
                    <ActivityIndicator size="large" color="#3B82F6" />
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top', 'left', 'right']}>
                {/* Header */}
                <View className="flex-row items-center px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
                        <Text className="text-gray-500 dark:text-gray-400 text-xl font-medium">‹</Text>
                    </TouchableOpacity>
                    <Image 
                        source={settingsIcon} 
                        className="w-6 h-6 mr-3 opacity-80" 
                        style={isDarkTheme ? { tintColor: 'white' } : {}}
                    />
                    <Text className="text-gray-900 dark:text-white text-lg font-bold">App Settings</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
                    
                    <SettingsSection title="Dynamic Recommendations">
                        <RadiusSelector />
                    </SettingsSection>

                    <SettingsSection title="Appearance & Preferences">
                        <ToggleItem 
                            label="Dark Mode" 
                            description="Change the app theme to dark for easier night viewing"
                            value={isDarkTheme} 
                            onValueChange={handleThemeToggle} 
                            isLast={false}
                        />
                        <SelectionItem 
                            label="Default Currency" 
                            value={currency} 
                            options={['USD ($)', 'LKR (Rs)', 'EUR (€)', 'GBP (£)']}
                            onSelect={setCurrency}
                            isLast={true} 
                        />
                    </SettingsSection>

                    <SettingsSection title="Permissions & Privacy">
                        <ToggleItem 
                            label="Push Notifications" 
                            description="Receive alerts for upcoming bookings and travel tips"
                            value={pushNotifications} 
                            onValueChange={setPushNotifications} 
                            isLast={false}
                        />
                        <ToggleItem 
                            label="Location Services" 
                            description="Allow app to suggest nearby attractions and photo spots"
                            value={locationServices} 
                            onValueChange={setLocationServices} 
                            isLast={true}
                        />
                    </SettingsSection>
                    
                    <Text className="text-center text-gray-400 dark:text-gray-600 text-xs mt-4">Version 1.0.0 (Build 204)</Text>
                    
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
