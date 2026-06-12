import "../global.css";
import React from 'react';
import { Text, View, TextInput, Image, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";

import logo from '../assets/search.png';
import Sleep from '../assets/sleep.png';
import rest from '../assets/rest.png';
import Locationping from '../assets/location-pin.png';
import Hiking from '../assets/hiking.png';

// Real place
const FEATURED = [
  { name: 'Sigiriya Rock', sub: 'Sri Lanka · 4.9 ★', uri: 'https://res.cloudinary.com/dojoopvkn/image/upload/v1780993545/photo%20spots/Pidurangala%20Rock.jpg' },
  { name: 'Nine Arch Bridge', sub: 'Ella, Sri Lanka · 4.9 ★', uri: 'https://res.cloudinary.com/dojoopvkn/image/upload/v1780994134/photo%20spots/Nine%20Arch%20Bridge.jpg' },
  { name: 'Mirissa Beach', sub: 'Matara · 4.8 ★', uri: 'https://res.cloudinary.com/dojoopvkn/image/upload/v1780993591/photo%20spots/Mirissa%20Beach.jpg' },
  { name: 'Yala National Park', sub: 'Hambantota · 4.9 ★', uri: 'https://res.cloudinary.com/dojoopvkn/image/upload/v1780993592/photo%20spots/Yala%20National%20Park.jpg' },
];

const POPULAR = [
  { name: 'Eiffel Tower', sub: 'Paris, France', rating: '4.9 ★', ratingBg: 'bg-blue-50', ratingText: 'text-blue-500', uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/400px-Tour_Eiffel_Wikimedia_Commons.jpg' },
  { name: 'Colosseum', sub: 'Rome, Italy', rating: '4.8 ★', ratingBg: 'bg-amber-50', ratingText: 'text-amber-500', uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/400px-Colosseo_2020.jpg' },
  { name: 'Grand Canyon', sub: 'Arizona, USA', rating: '4.7 ★', ratingBg: 'bg-emerald-50', ratingText: 'text-emerald-500', uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Grand_Canyon_view_from_Pima_Point_2010.jpg/400px-Grand_Canyon_view_from_Pima_Point_2010.jpg' },
];

export default function Home() {
  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>

        {/* Header */}
        <View className="px-5 pt-5 pb-2">
          <Text className="text-2xl font-bold text-gray-900" style={{ letterSpacing: 0.5 }}>
            Where do you{"\n"}want to go?
          </Text>
        </View>

        {/* Search Bar */}
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <View className="px-5 pt-2 pb-1">
            <View className="flex-row items-center bg-gray-100 rounded-2xl py-3 px-4">
              <Image source={logo} className="w-5 h-5 opacity-50" />
              <TextInput
                placeholder="Search places, hotels, food..."
                placeholderTextColor="#9CA3AF"
                className="pl-3 text-[15px] flex-1 text-gray-600"
                editable={false}
                pointerEvents="None"
              />
            </View>
          </View>
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

          {/* Featured Destinations */}
          <View className="mt-6 px-5">
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-lg text-gray-900">Featured Destinations</Text>
              <Text className="text-blue-500 text-sm font-medium">See all</Text>
            </View>
          </View>

          <View className="h-48 mt-3">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
              {FEATURED.map((item, i) => (
                <View key={i} className="w-52 h-44 mr-3 rounded-2xl overflow-hidden relative" style={{ elevation: 4 }}>
                  <Image source={{ uri: item.uri }} className="w-full h-full absolute" resizeMode="cover" />
                  <View className="absolute inset-0 bg-black/35" />
                  <View className="absolute bottom-0 left-0 right-0 p-4">
                    <Text className="text-white font-bold text-base">{item.name}</Text>
                    <Text className="text-white/80 text-xs mt-0.5">{item.sub}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Explore Categories */}
          <View className="mt-6 px-5">
            <Text className="font-bold text-lg text-gray-900">Explore Categories</Text>
            <View className="flex-row justify-between mt-4">

              <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Hotels")}>
                <View className="w-16 h-16 bg-blue-50 rounded-2xl justify-center items-center mb-2 border border-blue-100" style={{ elevation: 2 }}>
                  <Image source={Sleep} className="w-8 h-8" resizeMode="contain" />
                </View>
                <Text className="text-xs text-gray-600 font-medium">Hotels</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Resturants")}>
                <View className="w-16 h-16 bg-orange-50 rounded-2xl justify-center items-center mb-2 border border-orange-100" style={{ elevation: 2 }}>
                  <Image source={rest} className="w-8 h-8" resizeMode="contain" />
                </View>
                <Text className="text-xs text-gray-600 font-medium">Foods</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Attraction")}>
                <View className="w-16 h-16 bg-rose-50 rounded-2xl justify-center items-center mb-2 border border-rose-100" style={{ elevation: 2 }}>
                  <Image source={Locationping} className="w-8 h-8" resizeMode="contain" />
                </View>
                <Text className="text-xs text-gray-600 font-medium">Places</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center" onPress={() => navigation.navigate("PhotoSpots")}>
                <View className="w-16 h-16 bg-violet-50 rounded-2xl justify-center items-center mb-2 border border-violet-100" style={{ elevation: 2 }}>
                  <Image source={Hiking} className="w-8 h-8" resizeMode="contain" />
                </View>
                <Text className="text-xs text-gray-600 font-medium">Tours</Text>
              </TouchableOpacity>

            </View>
          </View>

          {/* Popular Destinations */}
          <View className="mt-8 px-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-bold text-lg text-gray-900">Popular Destinations</Text>
            </View>

            {POPULAR.map((item, i) => (
              <View key={i} className="bg-white p-3 rounded-2xl mb-3 flex-row items-center border border-gray-100" style={{ elevation: 3 }}>
                <Image source={{ uri: item.uri }} className="h-16 w-16 rounded-xl mr-3" resizeMode="cover" />
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-900">{item.name}</Text>
                  <Text className="text-gray-400 text-xs mt-1">{item.sub}</Text>
                </View>
                <View className={`${item.ratingBg} px-2 py-1 rounded-lg`}>
                  <Text className={`${item.ratingText} text-xs font-bold`}>{item.rating}</Text>
                </View>
              </View>
            ))}
          </View>

        </ScrollView>

        {/* Bottom Navigation*/}
        <View className="absolute bottom-0 w-full bg-white pt-3 pb-5 px-8 flex-row justify-between items-center border-t border-gray-100" style={{ elevation: 10 }}>
          <View className="items-center">
            <View className="w-1.5 h-1.5 bg-blue-500 rounded-full mb-1" />
            <Text className="text-[13px] font-bold text-blue-500">Home</Text>
          </View>
          <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Explore")}>
            <View className="w-1.5 h-1.5 rounded-full mb-1" />
            <Text className="text-[13px] font-medium text-gray-400">Explore</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Tour Planing")}>
            <View className="w-1.5 h-1.5 rounded-full mb-1" />
            <Text className="text-[13px] font-medium text-gray-400">Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Profile")}>
            <View className="w-1.5 h-1.5 rounded-full mb-1" />
            <Text className="text-[13px] font-medium text-gray-400">Profile</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}