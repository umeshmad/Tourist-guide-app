import React, { useState, useEffect } from 'react';
import {View, Image, Text, ScrollView, TextInput, TouchableOpacity, Alert} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import '../global.css';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import logo from '../assets/search.png';
import Sleep from '../assets/sleep.png';
import Hiking from '../assets/hiking.png';
import Locationping from '../assets/location-pin.png';
import Eiffel from '../assets/Eiffel.jpg';
import Resturant from '../assets/dinner.png';
import Camara from '../assets/wireless.png';
import Star from '../assets/star.png';
import Place1 from '../assets/place1.jpg';
import Place2 from '../assets/place2.jpg';
import BASE_URL from '../config';


export default function Search(){
    const navigation = useNavigation();
    const [search, setsearch] = useState();
    const [searchResults, setSearchResults] = useState([]);
    const [userLocation,setUserLocation]=useState(null);
    const [hotels,setHotels]=useState();
    const [hotelSearchResult,setHotelSearchResult]=useState(null);
    const [loading, setLoading] = useState(false);


    const fetchSearchResults = async (query) => {
        try {
            if (!query) {
                setSearchResults([]);
                return;
            }
            const res = await fetch(`${BASE_URL}/search?q=${query}`);
            const data = await res.json();
            setSearchResults(data);
            } catch (err) {
                console.error(err);
            }
         };
    const fetchHotelsNearMe=async()=>{
        try{
            const{status}=await Location.requestForegroundPermissionsAsync();
            if(status !== 'granted'){
                Alert.alert("Permission Denied", "Allow location access to find hotels near you.");
                return;
            }
            setLoading(true);
            const locationData=await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});
            const {longitude,latitude}=locationData.coords;
            setUserLocation({longitude,latitude});

            const res=await fetch (`${BASE_URL}/Hotels/nearby?longitude=${longitude}&latitude=${latitude}`);
            const data=await res.json();

            navigation.navigate("Hotels",{hotels:data})


            
        }catch(err){
            console.error(err);
        }finally{
            setLoading(false);
        }
    }
    return(
        <SafeAreaProvider>
            <SafeAreaView className="bg-white flex-1" edges={['top','left','right']}>

                <View className="justify-start pt-6 px-4">
                    <View className="flex-row items-center border border-gray-300 rounded-3xl py-2 px-2">
                        <Image source={logo} className="w-6 h-6 ml-2"/>
                        <TextInput 
                            placeholder="Search places, activities..." 
                            className="pl-3 text-[15px] flex-1"
                            style={{ letterSpacing: 2 }}
                            onChangeText={(text) => {
                                setsearch(text);
                                fetchSearchResults(text);
                            }}
                        />
                    </View>
                </View>

                {searchResults.length > 0 && (
                    <ScrollView className="px-4 mt-3" style={{maxHeight: 300}}>
                        {searchResults.map((place, index) => (
                            <View
                                key={index}
                                className="border-b border-gray-200 py-3"
                            >
                                <Text className="text-black text-base font-bold">{place.attraction_name}</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}

                <View className="flex-row justify-between pt-6 px-4 pb-4">
                    <TouchableOpacity onPress={() => navigation.navigate("Hotels")}>
                    <View className="bg-blue-100 border border-gray-200 flex-1 h-16 mr-2 rounded-xl justify-center items-center flex-row">
                        <Image source={Sleep} className="h-12 w-12"/>
                        <Text className="text-blue-500 text-lg font-bold pl-2">Hotels</Text>
                    </View>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-green-100 border border-gray-200 flex-1 h-16 mx-1 rounded-xl justify-center items-center flex-row" onPress={() => navigation.navigate("Resturants")}>
                        <Image source={Hiking} className="h-12 w-12"/>
                        <Text className="text-green-600 text-lg font-bold pl-2">Tours</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => navigation.navigate("Attraction")}>
                    <View className="bg-red-100 border border-gray-200 flex-1 h-16 ml-2 rounded-xl justify-center items-center flex-row">
                        <Image source={Locationping} className="h-8 w-8"/>
                        <Text className="text-red-500 text-lg font-bold pl-2">Attractions</Text>
                    </View>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:40}}>

                <Text className="text-xl font-bold text-black pl-4 pt-4">Popular Searches</Text>

                <View className="flex-row justify-between pt-3 px-4">
                    <View className="rounded-xl flex-1 overflow-hidden mr-2 relative">
                        <Image source={Eiffel} className="h-32 w-full"/>
                        <View className="absolute bg-black/50 inset-0 justify-center items-center">
                            <Text className="text-lg text-white font-bold">Eiffel Tour</Text>
                            <Text className="text-lg text-white font-bold">Trending</Text>
                        </View>    
                    </View>

                    <View className="rounded-xl flex-1 overflow-hidden ml-2 relative">
                        <Image source={Eiffel} className="h-32 w-full"/>
                        <View className="absolute bg-black/50 inset-0 justify-center items-center">
                            <Text className="text-lg text-white font-bold">Eiffel Tour</Text>
                            <Text className="text-lg text-white font-bold">Trending</Text>
                        </View>  
                    </View>
                </View>

                <Text className="text-xl font-bold text-black pl-4 pt-4">Recent Searches</Text>

                <View className="w-[92%] self-center mt-5 h-16 bg-gray-50 rounded-xl flex-row items-center px-4">
                    <View className="relative bg-blue-200 rounded-xl w-16 h-12 ">
                        <Image source={Sleep} className="h-10 w-10 absolute ml-3"/>
                    </View>
                    <TouchableOpacity onPress={
                        fetchHotelsNearMe
                    }>
                    <Text className="text-black text-lg pl-3 font-medium">Hotels near me</Text>
                    </TouchableOpacity>
                </View>

                <View className="w-[92%] self-center mt-4 h-16 bg-gray-50 rounded-xl flex-row items-center px-4">
                    <View className="relative bg-green-100 rounded-xl w-16 h-12 ">
                        <Image source={Hiking} className="h-10 w-10 absolute ml-3"/>
                    </View>
                    <Text className="text-black text-lg pl-3 font-medium">Tours near me</Text>
                </View>

                <View className="w-[92%] self-center mt-4 h-16 bg-gray-50 rounded-xl flex-row items-center px-4">
                    <View className="relative bg-red-100 rounded-xl w-16 h-12 ">
                        <Image source={Resturant} className="h-10 w-10 absolute ml-3"/>
                    </View>
                    <Text className="text-black text-lg pl-3 font-medium">French Restaurants</Text>
                </View>

                <View className="w-[92%] self-center mt-4 h-16 bg-gray-50 rounded-xl flex-row items-center px-4">
                    <View className="relative bg-purple-100 rounded-xl w-16 h-12 ">
                        <Image source={Camara} className="h-10 w-10 absolute ml-3"/>
                    </View>
                    <Text className="text-black text-lg pl-3 font-medium">Photography spots</Text>
                </View>

                <Text className="text-xl font-bold text-black pl-4 pt-4 pb-3">Suggested for you</Text>
                <View className="mt-3 px-4">
                    <View className="mb-4">
                        <View className="w-full border border-gray-200 rounded-xl flex-row">
                            <Image source={Eiffel} className="h-20 w-20 rounded-xl my-4 mx-4"/>
                            <View className="pt-6">
                                <Text className="text-black font-medium text-xl">Place name</Text>
                                <Text className="text-black text-l">Historic </Text>
                            </View>
                            <Image source={Star} className="h-8 w-8 mt-8 ml-24"/>
                            <Text className="text-gray font-thin text-l mt-10 ml-4">4.8</Text>
                        </View>
                    </View>

                    <View className="mb-4">
                        <View className="w-full border border-gray-200 rounded-xl flex-row">
                            <Image source={Place1} className="h-20 w-20 rounded-xl my-4 mx-4"/>
                            <View className="pt-6">
                                <Text className="text-black font-medium text-xl">Place name</Text>
                                <Text className="text-black text-l">Historic </Text>
                            </View>
                            <Image source={Star} className="h-8 w-8 mt-8 ml-24"/>
                            <Text className="text-gray font-thin text-l mt-10 ml-4">4.8</Text>
                        </View>
                    </View>

                    <View className="mb-4">
                        <View className="w-full border border-gray-200 rounded-xl flex-row">
                            <Image source={Place2} className="h-20 w-20 rounded-xl my-4 mx-4"/>
                            <View className="pt-6">
                                <Text className="text-black font-medium text-xl">Place name</Text>
                                <Text className="text-black text-l">Historic </Text>
                            </View>
                            <Image source={Star} className="h-8 w-8 mt-8 ml-24"/>
                            <Text className="text-gray font-thin text-l mt-10 ml-4">4.8</Text>
                        </View>
                    </View>
                </View>

                </ScrollView>

            </SafeAreaView>
        </SafeAreaProvider>
    )
}