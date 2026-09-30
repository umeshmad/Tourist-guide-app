import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, Image,
    FlatList, Alert
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../global.css';

import heartIcon from '../assets/heart.png';
import locationPin from '../assets/location-pin.png';
import star from '../assets/star.png';
import trashbin from '../assets/trashbin.png';
import drop from '../assets/drop.png';

export const SAVED_PLACES_KEY = 'savedPlaces';

const proxyImage = (rawUrl) => {
    if (!rawUrl) return null;
    const url = rawUrl.replace(/^"|"$/g, '').trim();
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=400`;
};

export default function SavedPlaces() {
    const navigation = useNavigation();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [savedPlaces, setSavedPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadSavedPlaces = useCallback(async () => {
        try {
            const data = await AsyncStorage.getItem(SAVED_PLACES_KEY);
            setSavedPlaces(data ? JSON.parse(data) : []);
        } catch (err) {
            setSavedPlaces([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSavedPlaces();
    }, [loadSavedPlaces]);

    const removePlace = useCallback((id) => {
        Alert.alert(
            'Remove Place',
            'Remove this place from your saved list?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        const updated = savedPlaces.filter(p => p._id !== id);
                        setSavedPlaces(updated);
                        await AsyncStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(updated));
                    }
                }
            ]
        );
    }, [savedPlaces]);

    const renderItem = useCallback(({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Attraction', { selectAttraction: item })}
            className="flex-row bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 mb-3 overflow-hidden"
            style={{ elevation: isDark ? 0 : 3 }}
            activeOpacity={0.88}
        >
            {/* Thumbnail */}
            <View className="bg-gray-200 dark:bg-gray-700" style={{ width: 96, height: 96 }}>
                {item.image_url ? (
                    <Image
                        source={{ uri: proxyImage(item.image_url) }}
                        style={{ width: 96, height: 96 }}
                        resizeMode="cover"
                    />
                ) : null}
            </View>

            {/* Info */}
            <View className="flex-1 px-3 py-2 justify-between">
                <View>
                    <Text
                        className="text-gray-900 dark:text-white font-bold text-sm"
                        numberOfLines={1}
                    >
                        {item.attraction_name}
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                        <Image source={locationPin} style={{ width: 12, height: 12 }} />
                        <Text
                            className="text-gray-400 dark:text-gray-500 text-xs ml-1"
                            numberOfLines={1}
                        >
                            {item.city}{item.district ? `, ${item.district}` : ''}
                        </Text>
                    </View>
                    {item.category ? (
                        <Text
                            className="text-orange-500 text-xs font-semibold mt-0.5"
                            numberOfLines={1}
                        >
                            {item.category}
                        </Text>
                    ) : null}
                </View>

                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Image source={star} style={{ width: 13, height: 13 }} />
                        <Text className="text-amber-500 font-bold text-xs ml-1">
                            {item.rating}
                        </Text>
                        {item.num_reviews ? (
                            <Text className="text-gray-300 dark:text-gray-600 text-xs ml-1">
                                ({item.num_reviews})
                            </Text>
                        ) : null}
                    </View>
                    {item.savedAt ? (
                        <Text className="text-gray-300 dark:text-gray-600 text-[10px]">
                            {new Date(item.savedAt).toLocaleDateString()}
                        </Text>
                    ) : null}
                </View>
            </View>

            {/* Remove Button */}
            <TouchableOpacity
                onPress={() => removePlace(item._id)}
                className="justify-center items-center px-3"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
            >
                <Image
                    source={trashbin}
                    style={{ width: 18, height: 18, tintColor: '#EF4444' }}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    ), [isDark, navigation, removePlace]);

    return (
        <SafeAreaProvider>
            <SafeAreaView
                className="bg-white dark:bg-gray-900 flex-1"
                edges={['top', 'right', 'left']}
            >
                {/* Header */}
                <View className="px-4 pt-4 pb-3 flex-row items-center border-b border-gray-100 dark:border-gray-800">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 justify-center items-center mr-3"
                        activeOpacity={0.7}
                    >
                        <Image
                            source={drop}
                            style={{
                                width: 18, height: 18,
                                transform: [{ rotate: '90deg' }],
                                tintColor: isDark ? '#fff' : '#374151'
                            }}
                        />
                    </TouchableOpacity>

                    <View className="flex-1">
                        <Text className="text-gray-900 dark:text-white text-xl font-bold">
                            Saved Places
                        </Text>
                        <Text className="text-gray-400 dark:text-gray-500 text-xs">
                            {savedPlaces.length} place{savedPlaces.length !== 1 ? 's' : ''} saved
                        </Text>
                    </View>

                    <View className="bg-red-100 dark:bg-red-900/30 h-10 w-10 rounded-full justify-center items-center">
                        <Image
                            source={heartIcon}
                            style={{ width: 20, height: 20, tintColor: '#EF4444' }}
                        />
                    </View>
                </View>

                {/* Content */}
                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-gray-400 dark:text-gray-500">Loading...</Text>
                    </View>
                ) : savedPlaces.length === 0 ? (
                    <View className="flex-1 justify-center items-center px-10">
                        <View className="bg-red-50 dark:bg-red-900/20 w-24 h-24 rounded-full justify-center items-center mb-5">
                            <Image
                                source={heartIcon}
                                style={{ width: 44, height: 44, tintColor: '#FCA5A5' }}
                            />
                        </View>
                        <Text className="text-gray-900 dark:text-white text-xl font-bold text-center mb-2">
                            No Saved Places Yet
                        </Text>
                        <Text className="text-gray-400 dark:text-gray-500 text-sm text-center leading-5">
                            Explore attractions and tap the ♥ button on any place to save it here.
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Attraction')}
                            className="mt-6 bg-red-500 rounded-2xl px-8 py-3"
                            activeOpacity={0.85}
                        >
                            <Text className="text-white font-bold">Explore Places</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={savedPlaces}
                        keyExtractor={(item) => String(item._id)}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                    />
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
