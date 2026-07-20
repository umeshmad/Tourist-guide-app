import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image, ScrollView, TextInput, Linking, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import '../global.css';

import logo from '../assets/search.png';
import star from '../assets/star.png';
import drop from '../assets/drop.png';
import dropw from '../assets/drop-w.png';
import location from '../assets/location-pin.png';

const PHOTO_SPOTS_DATA = [
  {
    id: "2",
    name: "Pidurangala Rock",
    category: "Viewpoint",
    district: "Matale",
    province: "Central",
    nearest_city: "Dambulla",
    nearest_city_distance_km: "17",
    latitude: 7.9637,
    longitude: 80.7542,
    description: "Best viewpoint for Sigiriya panorama - short hike rewarded with stunning sunrise over Lion Rock.",
    best_time_of_day: "Sunrise",
    best_season: "December to April",
    photography_type: "Landscape / Aerial",
    entrance_fee_lkr: "500 LKR",
    difficulty_level: "Moderate",
    rating: "4.9",
    google_map_link: "https://www.google.com/maps?q=7.9637,80.7542",
    image_url: "https://res.cloudinary.com/dojoopvkn/image/upload/v1780993545/photo%20spots/Pidurangala%20Rock.jpg"
  },
  {
    id: "4",
    name: "Nine Arch Bridge",
    category: "Landmark",
    district: "Badulla",
    province: "Uva",
    nearest_city: "Ella",
    nearest_city_distance_km: "1",
    latitude: 6.8750,
    longitude: 81.0597,
    description: "Iconic colonial-era viaduct bridge in lush green valley - best when train crosses at golden hour.",
    best_time_of_day: "Morning / Afternoon",
    best_season: "December to March",
    photography_type: "Landscape / Architecture",
    entrance_fee_lkr: "Free",
    difficulty_level: "Easy",
    rating: "4.9",
    google_map_link: "https://www.google.com/maps?q=6.8750,81.0597",
    image_url: "https://res.cloudinary.com/dojoopvkn/image/upload/v1780994134/photo%20spots/Nine%20Arch%20Bridge.jpg"
  },
  {
    id: "14",
    name: "Yala National Park",
    category: "Wildlife",
    district: "Hambantota",
    province: "Southern",
    nearest_city: "Tissamaharama",
    nearest_city_distance_km: "20",
    latitude: 6.3720,
    longitude: 81.5200,
    description: "World's highest leopard density - big cats, elephants, crocodiles and exotic birds.",
    best_time_of_day: "Early Morning",
    best_season: "February to July",
    photography_type: "Wildlife / Nature",
    entrance_fee_lkr: "4800 LKR",
    difficulty_level: "Easy",
    rating: "4.9",
    google_map_link: "https://www.google.com/maps?q=6.3720,81.5200",
    image_url: "https://res.cloudinary.com/dojoopvkn/image/upload/v1780993592/photo%20spots/Yala%20National%20Park.jpg"
  },
  {
    id: "8",
    name: "Diyaluma Falls",
    category: "Waterfall",
    district: "Badulla",
    province: "Uva",
    nearest_city: "Koslanda",
    nearest_city_distance_km: "5",
    latitude: 6.7167,
    longitude: 80.9833,
    description: "Second highest waterfall in Sri Lanka at 220m with natural rock pools at the top.",
    best_time_of_day: "Morning",
    best_season: "May to October",
    photography_type: "Waterfall / Nature",
    entrance_fee_lkr: "Free",
    difficulty_level: "Moderate",
    rating: "4.7",
    google_map_link: "https://www.google.com/maps?q=6.7167,80.9833",
    image_url: "https://res.cloudinary.com/dojoopvkn/image/upload/v1780993587/photo%20spots/Diyaluma%20Falls.jpg"
  },
  {
    id: "13",
    name: "Mirissa Beach",
    category: "Beach",
    district: "Matara",
    province: "Southern",
    nearest_city: "Matara",
    nearest_city_distance_km: "15",
    latitude: 5.9450,
    longitude: 80.4580,
    description: "Horseshoe bay famous for whale watching, swaying palms and stunning sunsets.",
    best_time_of_day: "Sunset / Dawn",
    best_season: "November to April",
    photography_type: "Coastal / Wildlife / Seascape",
    entrance_fee_lkr: "Free",
    difficulty_level: "Easy",
    rating: "4.8",
    google_map_link: "https://www.google.com/maps?q=5.9450,80.4580",
    image_url: "https://res.cloudinary.com/dojoopvkn/image/upload/v1780993591/photo%20spots/Mirissa%20Beach.jpg"
  },
  {
    id: "48",
    name: "Weligama Bay Stilt Fishermen",
    category: "Cultural Site",
    district: "Matara",
    province: "Southern",
    nearest_city: "Matara",
    nearest_city_distance_km: "14",
    latitude: 5.9730,
    longitude: 80.4280,
    description: "Iconic stilt fishermen unique to Sri Lanka - dawn photography is magical.",
    best_time_of_day: "Early Morning",
    best_season: "November to April",
    photography_type: "Cultural / Portrait / Coastal",
    entrance_fee_lkr: "Free (Tip expected)",
    difficulty_level: "Easy",
    rating: "4.8",
    google_map_link: "https://www.google.com/maps?q=5.9730,80.4280",
    image_url: "https://res.cloudinary.com/dojoopvkn/image/upload/v1780993647/photo%20spots/Weligama%20Bay%20Stilt%20Fishermen.jpg"
  }
];

export default function PhotoSpots() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSpotId, setExpandedSpotId] = useState(null);

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const categories = ['All', 'Viewpoint', 'Beach', 'Waterfall', 'Wildlife', 'Landmark', 'Cultural Site'];

  const filteredSpots = PHOTO_SPOTS_DATA.filter(spot => {
    const matchesCategory = selectedCategory === 'All' || spot.category === selectedCategory;
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          spot.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          spot.nearest_city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenMap = (link) => {
    Linking.openURL(link).catch(() => {
      Alert.alert("Error", "Could not open map link");
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="bg-white dark:bg-gray-900 flex-1" edges={['top', 'right', 'left']}>

        {/* Search Bar */}
        <View className="px-4 pt-6 pb-3">
          <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-2xl py-3 px-4">
            <Image source={logo} className="w-5 h-5 opacity-50" style={isDark ? { tintColor: 'white' } : {}} />
            <TextInput
              placeholder="Search photo spots, districts..."
              placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
              className="pl-3 text-[15px] flex-1 text-gray-800 dark:text-gray-200"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Category Pills */}
        <View className="px-4 pb-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 mr-2 border ${selectedCategory === category ? 'bg-purple-600 border-purple-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
              >
                <Text className={`text-sm font-bold ${selectedCategory === category ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

          {/* Trending Section */}
          <View className="px-4 pb-3">
            <Text className="text-gray-900 dark:text-white font-extrabold text-xl mb-3">Trending Photo Spots</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {PHOTO_SPOTS_DATA.slice(0, 3).map((spot) => (
                <TouchableOpacity
                  key={`featured-${spot.id}`}
                  onPress={() => setExpandedSpotId(expandedSpotId === spot.id ? null : spot.id)}
                  className="h-44 w-60 rounded-2xl overflow-hidden mr-4 border border-gray-100 dark:border-gray-700"
                  style={{ elevation: isDark ? 0 : 3 }}
                >
                  <Image source={{ uri: spot.image_url }} className="h-full w-full absolute bg-gray-200 dark:bg-gray-700" resizeMode="cover" />
                  <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/45 justify-end p-4">
                    <Text className="text-white text-lg font-bold leading-5">{spot.name}</Text>
                    <View className="flex-row items-center mt-1">
                      <Image source={star} className="h-3.5 w-3.5" />
                      <Text className="text-white text-sm font-semibold pl-1">{spot.rating}</Text>
                      <Text className="text-gray-300 text-xs pl-2">• {spot.district}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* All Spots Label */}
          <View className="px-4 pt-2 pb-3">
            <Text className="text-gray-900 dark:text-white font-extrabold text-xl">Explore All Photo Spots</Text>
            <Text className="text-gray-400 text-sm">{filteredSpots.length} spots match your criteria</Text>
          </View>

          {/* Photo Spots List */}
          <View className="px-4">
            {filteredSpots.map((spot) => {
              const isExpanded = expandedSpotId === spot.id;

              return (
                <View key={spot.id} className="mb-4">

                  {/* Collapsed Card */}
                  {!isExpanded && (
                    <TouchableOpacity
                      onPress={() => setExpandedSpotId(spot.id)}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 w-full overflow-hidden"
                      style={{ elevation: isDark ? 0 : 3 }}
                      activeOpacity={0.92}
                    >
                      {/* Image Banner */}
                      <View className="relative h-36 w-full bg-gray-200 dark:bg-gray-700">
                        <Image source={{ uri: spot.image_url }} className="w-full h-full" resizeMode="cover" />
                        {/* Category badge */}
                        <View className="absolute top-3 left-3 bg-purple-600 rounded-xl px-2.5 py-1">
                          <Text className="text-white text-xs font-bold">{spot.category}</Text>
                        </View>
                        {/* Rating badge */}
                        <View className="absolute top-3 right-3 bg-white dark:bg-gray-900 rounded-xl px-2.5 py-1.5" style={{ elevation: isDark ? 0 : 4 }}>
                          <Text className="text-amber-500 font-extrabold text-sm">★ {spot.rating}</Text>
                        </View>
                      </View>

                      {/* Info Row */}
                      <View className="px-4 py-3 flex-row items-center justify-between">
                        <View className="flex-1 pr-3">
                          <Text className="text-gray-900 dark:text-white text-base font-bold" numberOfLines={1}>{spot.name}</Text>
                          <Text className="text-gray-400 dark:text-gray-400 text-xs mt-0.5">{spot.district} District • {spot.nearest_city}</Text>
                          <Text className="text-gray-300 dark:text-gray-500 text-xs mt-0.5">{spot.nearest_city_distance_km} km away</Text>
                        </View>
                        <View className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-500 rounded-xl px-3 py-1.5">
                          <Text className="text-purple-600 dark:text-purple-400 text-xs font-bold">View</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* Expanded Card */}
                  {isExpanded && (
                    <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 w-full mb-2 overflow-hidden" style={{ elevation: isDark ? 0 : 3 }}>
                      <Image source={{ uri: spot.image_url }} className="w-full h-52 bg-gray-200 dark:bg-gray-700" />

                      <TouchableOpacity
                        onPress={() => setExpandedSpotId(null)}
                        className="absolute right-4 top-4 bg-black/40 rounded-full p-2"
                      >
                        <Image source={dropw} className="h-5 w-5" />
                      </TouchableOpacity>

                      <View className="p-4 bg-white dark:bg-gray-800">
                        <View className="flex-row justify-between items-start">
                          <View className="flex-1 pr-2">
                            <Text className="text-xl text-black dark:text-white font-extrabold">{spot.name}</Text>
                            <View className="flex-row items-center mt-1.5">
                              <Image source={star} className="h-4 w-4" />
                              <Text className="text-sm font-bold text-black dark:text-white pl-1">{spot.rating}</Text>
                              <Text className="text-xs text-gray-500 dark:text-gray-400 pl-2">• {spot.district} District ({spot.province} Province)</Text>
                            </View>
                          </View>
                          <View className="bg-purple-100 dark:bg-purple-900/40 rounded-lg px-2.5 py-1">
                            <Text className="text-purple-700 dark:text-purple-400 text-xs font-bold">{spot.category}</Text>
                          </View>
                        </View>

                        <Text className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-5">{spot.description}</Text>

                        <View className="flex-row flex-wrap mt-4 border-t border-b border-gray-100 dark:border-gray-700 py-3">
                          <View className="w-1/2 my-1.5 flex-row items-center">
                            <Text className="text-gray-400 dark:text-gray-500 text-xs font-semibold mr-1">Best Time:</Text>
                            <Text className="text-gray-800 dark:text-gray-300 text-xs font-bold">{spot.best_time_of_day}</Text>
                          </View>
                          <View className="w-1/2 my-1.5 flex-row items-center">
                            <Text className="text-gray-400 dark:text-gray-500 text-xs font-semibold mr-1">Season:</Text>
                            <Text className="text-gray-800 dark:text-gray-300 text-xs font-bold">{spot.best_season}</Text>
                          </View>
                          <View className="w-1/2 my-1.5 flex-row items-center">
                            <Text className="text-gray-400 dark:text-gray-500 text-xs font-semibold mr-1">Type:</Text>
                            <Text className="text-gray-800 dark:text-gray-300 text-xs font-bold" numberOfLines={1}>{spot.photography_type}</Text>
                          </View>
                          <View className="w-1/2 my-1.5 flex-row items-center">
                            <Text className="text-gray-400 dark:text-gray-500 text-xs font-semibold mr-1">Difficulty:</Text>
                            <Text className="text-gray-800 dark:text-gray-300 text-xs font-bold">{spot.difficulty_level}</Text>
                          </View>
                          <View className="w-1/2 my-1.5 flex-row items-center">
                            <Text className="text-gray-400 dark:text-gray-500 text-xs font-semibold mr-1">Distance:</Text>
                            <Text className="text-gray-800 dark:text-gray-300 text-xs font-bold">{spot.nearest_city_distance_km} km from {spot.nearest_city}</Text>
                          </View>
                          <View className="w-1/2 my-1.5 flex-row items-center">
                            <Text className="text-gray-400 dark:text-gray-500 text-xs font-semibold mr-1">Fee:</Text>
                            <Text className="text-purple-600 dark:text-purple-400 text-xs font-bold">{spot.entrance_fee_lkr}</Text>
                          </View>
                        </View>

                        <View className="flex-row justify-between items-center mt-4">
                          <TouchableOpacity
                            onPress={() => handleOpenMap(spot.google_map_link)}
                            className="flex-row items-center border border-purple-600 dark:border-purple-500 rounded-3xl py-2.5 px-4 flex-1 justify-center mr-2"
                          >
                            <Image source={location} className="w-4 h-4 mr-1.5" style={{ tintColor: isDark ? '#a855f7' : '#9333ea' }} />
                            <Text className="text-purple-600 dark:text-purple-400 text-sm font-bold">Directions</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => Alert.alert("Success", `${spot.name} added to your To-Do list!`)}
                            className="bg-purple-600 rounded-3xl py-2.5 px-4 flex-1 justify-center ml-2"
                          >
                            <Text className="text-white text-sm font-bold text-center">Add to Plan</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}

                </View>
              );
            })}

            {filteredSpots.length === 0 && (
              <View className="justify-center items-center py-10">
                <Text className="text-gray-400 text-base">No photo spots found matching search query.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
