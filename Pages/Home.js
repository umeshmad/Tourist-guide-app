import "../global.css";
import React from 'react';
import { Text, View, TextInput, Image, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native';
import { useNavigation } from "@react-navigation/native";

import logo from '../assets/search.png';


export default function Home() {
  const navigation = useNavigation();
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>

        {/* Search Bar */}
        <View className="justify-start pt-6 px-4">
          <View className="flex-row items-center border border-gray-300 rounded-3xl py-2 px-2">
            <Image source={logo} className="w-6 h-6 ml-2"/>
            <TextInput 
              placeholder="Search places, activities..." 
              className="pl-3 text-[15px] flex-1"
              style={{ letterSpacing: 2 }}
            />
          </View>
        </View>

        {/* Featured Destinations */}
        <View className="mt-8 px-4">
          <Text className="font-medium text-[22px]" style={{letterSpacing: 2}}>
            Featured Destinations
          </Text>
        </View>

        <View className="h-36 mt-3">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingRight: 16 }}
            className="mt-4 px-4"
          >
            <View className="w-40 h-32 bg-red-500 mr-4 rounded-xl"></View>
            <View className="w-40 h-32 bg-green-500 mr-4 rounded-xl"></View>
            <View className="w-40 h-32 bg-yellow-500 mr-4 rounded-xl"></View>
            <View className="w-40 h-32 bg-blue-500 mr-4 rounded-xl"></View>
          </ScrollView>
        </View>

        {/* Explore Categories */}
        <View className="flex-1 mt-8 px-4">
          <Text className="font-medium text-[22px]" style={{letterSpacing: 2}}>
            Explore Categories
          </Text>

          <View className="flex-row justify-between mt-6">

            {/* Category Card */}
            <View className="relative rounded-xl bg-white h-36 w-24 justify-center items-center border border-gray-200"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 8
              }}>
              <View className="absolute rounded-2xl bg-black h-24 w-20 mb-5"></View>
              <Text className="text-[14px] pt-28">Hotels</Text>
            </View>

            <View className="relative rounded-xl bg-white h-36 w-24 border border-gray-200 justify-center items-center"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 8
              }}>
              <View className="absolute bg-black h-24 w-20 mb-5 rounded-2xl"></View>
              <Text className="text-[14px] pt-28">Restaurants</Text>
            </View>

            <View className="relative rounded-xl bg-white h-36 w-24 border border-gray-200 justify-center items-center"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 8
              }}>
              <View className="absolute mb-5 h-24 w-20 bg-black rounded-2xl"></View>
              <Text className="text-[14px] pt-28">Attractions</Text>
            </View>

            <View className="relative rounded-xl bg-white h-36 w-24 border border-gray-200 justify-center items-center"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 8
              }}>
              <View className="absolute mb-5 h-24 w-20 bg-black rounded-2xl"></View>
              <Text className="text-[14px] pt-28">Tours</Text>
            </View>

          </View>

          {/* Popular Destinations */}
          <Text className="font-medium text-[22px] pt-8 pb-5">
            Popular Destinations
          </Text>

          <View className="flex-1">
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              <View className="bg-black h-36 w-full rounded-xl mb-4"></View>
              <View className="bg-black h-36 w-full rounded-xl mb-4"></View>
              <View className="bg-black h-36 w-full rounded-xl mb-4"></View>
              <View className="bg-black h-36 w-full rounded-xl mb-4"></View>
            </ScrollView>
          </View>
        </View>

        

        {/* Bottom Navigation */}
        <View className="absolute bottom-0 h-20 w-full bg-white border-t border-gray-200 flex-row justify-around items-center">
          <View className="items-center">
            <Text className="text-[16px] font-medium">Home</Text>
          </View>

          <TouchableOpacity
          className="items-center" onPress={()=>navigation.navigate("Explore")}>
            <Text className="text-[16px] font-medium">Explore</Text>
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-[16px] font-medium">Profile</Text>
          </View>

        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}