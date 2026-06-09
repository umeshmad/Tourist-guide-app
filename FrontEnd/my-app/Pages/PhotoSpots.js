import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image, ScrollView, TextInput, Linking, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
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
      <SafeAreaView className="bg-white flex-1" edges={['top', 'right', 'left']}>
        
        <View className="justify-start pt-6 px-4">
          <View className="flex-row items-center border border-gray-300 rounded-3xl py-2 px-2">
            <Image source={logo} className="w-6 h-6 ml-2" />
            <TextInput
              placeholder="Search photo spots, districts..."
              className="pl-3 text-[15px] flex-1 text-black"
              style={{ letterSpacing: 2 }}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View className="py-4 px-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                className={`rounded-3xl h-11 px-6 justify-center items-center mr-2 border border-gray-200 ${
                  selectedCategory === category ? "bg-purple-600 border-purple-600" : "bg-white"
                }`}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  className={`text-sm font-bold ${
                    selectedCategory === category ? "text-white" : "text-gray-700"
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
          
          {/* Featured/Popular Section */}
          <Text className="text-black font-extrabold text-xl px-4 pb-3">Trending Photo Spots</Text>
          <View className="px-4 pb-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {PHOTO_SPOTS_DATA.slice(0, 3).map((spot) => (
                <TouchableOpacity
                  key={`featured-${spot.id}`}
                  onPress={() => setExpandedSpotId(expandedSpotId === spot.id ? null : spot.id)}
                  className="bg-white border border-gray-200 flex h-44 w-60 rounded-2xl overflow-hidden mr-4 shadow-sm"
                >
                  <Image source={{ uri: spot.image_url }} className="h-full w-full absolute" />
                  <View className="bg-black/45 absolute top-0 left-0 right-0 bottom-0 justify-end p-3">
                    <Text className="text-white text-lg font-bold leading-5">{spot.name}</Text>
                    <View className="flex-row items-center mt-1">
                      <Image source={star} className="h-3.5 w-3.5" />
                      <Text className="text-sm font-semibold text-white pl-1">{spot.rating}</Text>
                      <Text className="text-xs text-gray-200 pl-2">• {spot.district}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* List Section */}
          <View className="px-4 pt-2">
            <Text className="text-black font-extrabold text-xl">Explore All Photo Spots</Text>
            <Text className="text-gray-400 text-sm pb-4">{filteredSpots.length} spots match your criteria</Text>
          </View>

          {/* Photo Spots List */}
          <View className="px-4">
            {filteredSpots.map((spot) => {
              const isExpanded = expandedSpotId === spot.id;

              return (
                <View key={spot.id} className="mb-4">
                  {!isExpanded && (
                    <View className="bg-white rounded-xl border border-gray-200 w-full h-32 flex-row relative shadow-xs">
                      <Image source={{ uri: spot.image_url }} className="rounded-xl h-24 w-24 mx-3 my-4" />
                      <View className="pt-4 pl-1 flex-1 pr-12">
                        <Text className="text-black text-[15px] font-bold" numberOfLines={1}>
                          {spot.name}
                        </Text>
                        <Text className="text-xs text-purple-600 font-semibold mt-0.5">{spot.category}</Text>
                        <View className="flex-row items-center mt-1">
                          <Image source={star} className="h-3.5 w-3.5" />
                          <Text className="text-xs font-semibold text-black pl-1">{spot.rating}</Text>
                          <Text className="text-xs text-gray-400 pl-2">• {spot.district}</Text>
                        </View>
                        <Text className="text-xs text-gray-400 font-medium mt-1">
                          {spot.nearest_city} ({spot.nearest_city_distance_km} km)
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setExpandedSpotId(spot.id)}
                        className="absolute top-[40%] right-4 p-1"
                      >
                        <Image source={drop} className="h-6 w-6" />
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Expanded */}
                  {isExpanded && (
                    <View className="bg-white rounded-xl border border-gray-200 w-full mb-2 overflow-hidden shadow-md">
                      <Image source={{ uri: spot.image_url }} className="w-full h-52" />
                      
                      <TouchableOpacity
                        onPress={() => setExpandedSpotId(null)}
                        className="absolute right-4 top-4 bg-black/40 rounded-full p-2"
                      >
                        <Image source={dropw} className="h-5 w-5" />
                      </TouchableOpacity>

                      <View className="p-4 bg-white">
                        <View className="flex-row justify-between items-start">
                          <View className="flex-1 pr-2">
                            <Text className="text-xl text-black font-extrabold">{spot.name}</Text>
                            <View className="flex-row items-center mt-1.5">
                              <Image source={star} className="h-4 w-4" />
                              <Text className="text-sm font-bold text-black pl-1">{spot.rating}</Text>
                              <Text className="text-xs text-gray-500 pl-2">• {spot.district} District ({spot.province} Province)</Text>
                            </View>
                          </View>
                          <View className="bg-purple-100 rounded-lg px-2.5 py-1">
                            <Text className="text-purple-700 text-xs font-bold">{spot.category}</Text>
                          </View>
                        </View>

                        {/* Description */}
                        <Text className="text-sm text-gray-600 mt-3 leading-5">{spot.description}</Text>

                        {/* Feature grid */}
                        <View className="flex-row flex-wrap mt-4 border-t border-b border-gray-100 py-3">
                          <View className="w-1/2 my-1.5 flex-row items-center">
                            <Text className="text-gray-400 text-xs font-semibold mr-1">Best Time:</Text>
                            <Text className="text-gray-800 text-xs font-bold">{spot.best_time_of_day}</Text>
                          </View>
                          <View className="w-1/2 my-1.5 flex-row items-center">
                            <Text className="text-gray-400 text-xs font-semibold mr-1">Season:</Text>
                            <Text className="text-gray-800 text-xs font-bold">{spot.best_season}</Text>
                          </View>
                          <View className="w-1/2 my-1.5 flex-row items-center">
                            <Text className="text-gray-400 text-xs font-semibold mr-1">Type:</Text>
                            <Text className="text-gray-800 text-xs font-bold" numberOfLines={1}>{spot.photography_type}</Text>
                          </View>
                          <View className="w-1/2 my-1.5 flex-row items-center">
                            <Text className="text-gray-400 text-xs font-semibold mr-1">Difficulty:</Text>
                            <Text className="text-gray-800 text-xs font-bold">{spot.difficulty_level}</Text>
                          </View>
                          <View className="w-1/2 my-1.5 flex-row items-center">
                            <Text className="text-gray-400 text-xs font-semibold mr-1">Distance:</Text>
                            <Text className="text-gray-800 text-xs font-bold">{spot.nearest_city_distance_km} km from {spot.nearest_city}</Text>
                          </View>
                          <View className="w-1/2 my-1.5 flex-row items-center">
                            <Text className="text-gray-400 text-xs font-semibold mr-1">Fee:</Text>
                            <Text className="text-purple-600 text-xs font-bold">{spot.entrance_fee_lkr}</Text>
                          </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row justify-between items-center mt-4">
                          <TouchableOpacity
                            onPress={() => handleOpenMap(spot.google_map_link)}
                            className="flex-row items-center border border-purple-600 rounded-3xl py-2.5 px-4 flex-1 justify-center mr-2"
                          >
                            <Image source={location} className="w-4 h-4 mr-1.5 tint-purple-600" style={{ tintColor: '#9333ea' }} />
                            <Text className="text-purple-600 text-sm font-bold">Directions</Text>
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
