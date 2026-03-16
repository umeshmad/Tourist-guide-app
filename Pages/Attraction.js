import React, { useState } from 'react';
import {Text, View, TouchableOpacity,Image, ScrollView,TextInput} from 'react-native';
import { SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import logo from '../assets/search.png';
import place6 from '../assets/place6.jpg';
import star from '../assets/star.png';
import place7 from '../assets/place7.jpg';
export default function Attraction(){
    const [selected, setSelected]=useState('All');
    return(
        <SafeAreaProvider>
            <SafeAreaView className="bg-white flex-1" edges={['top','right','left']}>
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
                <View className="flex-row py-3 px-4">
                    {['All','Cultural','Nature','Entertain'].map((items)=>(
                        <TouchableOpacity key={items} className={`rounded-3xl h-12 flex-1 border border-gray-200 justify-center items-center mr-1 ${selected===items ? "bg-orange-500":"bg-white"}`} onPress={()=>setSelected(items)}>
                            <Text className={`text-l font-bold  ${selected === items ? "text-white":"text-black"}`}>{items}</Text></TouchableOpacity>))}
                </View>
                <Text className="text-black font-bold text-xl px-4 py-2">Popular Destinations</Text>
                <View className="px-4">
                    <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                        <View className="bg-white border border-gray-200 flex h-40 w-56 rounded-xl overflow-hidden mr-3">
                            <Image source={place6} className="h-40 w-56 relative"></Image>
                            <View className="bg-black/40 inset-0 absolute flex items-start pt-24 pl-2">
                                <Text className="text-white text-xl font-bold">Temple</Text>
                                <View className="flex-row">
                                <Image source={star} className="h-3 w-3 mt-1"></Image>
                                <Text className="text-l font-medium text-white pl-2">4.8</Text>
                                <Text className="text-[12px] text-white pl-2">(1,245)</Text>
                                <Text className="text-[12px] text-white pl-2">• 1.2Km away</Text>
                                </View>
                                
                            </View>
                        </View>
                        <View className="bg-white border border-gray-200  flex h-40 w-56 rounded-xl overflow-hidden mr-3">
                            <Image source={place6} className="h-40 w-56 relative"></Image>
                            <View className="bg-black/40 inset-0 absolute flex items-start pt-24 pl-2">
                                <Text className="text-white text-xl font-bold">Temple</Text>
                                <View className="flex-row">
                                    <Image source={star} className="h-3 w-3 mt-1"></Image>
                                <Text className="text-l font-medium text-white pl-2">4.8</Text>
                                <Text className="text-[12px] text-white pl-2">(1,245)</Text>
                                <Text className="text-[12px] text-white pl-2">• 1.2Km away</Text>
                                </View>
                                
                            </View>
                        </View>
                        <View className="bg-white border border-gray-200  flex h-40 w-56 rounded-xl overflow-hidden mr-3">
                            <Image source={place6} className="h-40 w-56 relative"></Image>
                            <View className="bg-black/40 inset-0 absolute flex items-start pt-24 pl-2">
                                <Text className="text-white text-xl font-bold">Temple</Text>
                                <View className="flex-row">
                                    <Image source={star} className="h-3 w-3 mt-1"></Image>
                                    <Text className="text-l font-medium text-white pl-2">4.8</Text>
                                    <Text className="text-[12px] text-white pl-2">(1,245)</Text>
                                    <Text className="text-[12px] text-white pl-2">• 1.2Km away</Text>
                                </View>
                                
                            </View>
                        </View>  
                    </ScrollView>
                    <View className="py-4">
                        <Text className="text-black font-bold text-xl">All Atrraction</Text>
                        <Text className="text-gray-400 text-l">24 places found</Text>
                    </View>
                </View>
                
                    <ScrollView 
                    showsVerticalScrollIndicator={false}
                    >
                    <View className="px-4">
                        <View className="w-full h-32 bg-white rounded-xl border border-gray-200 flex-row mb-3">
                            <Image source={place7} className="rounded-xl h-28 w-28 my-2 mx-3 "></Image>
                            <View className="pt-3 flex-1 pr-2">
                                <Text className="text-black text-l font-extrabold">Viharamahadevi Park</Text>
                                <Text className="text-gray-400 text-sm">Beautiful urban park with playgrounds, walking paths, and peaceful green spaces.</Text>
                                <View className="flex-row pt-1">
                                    <Image source={star} className="h-3 w-3 mt-1"></Image>
                                    <Text className="text-l font-medium text-black pl-2">4.8</Text>
                                    <Text className="text-[12px] text-black pl-2 pt-0.5">(1,245)</Text>
                                </View>
                            </View>
                            <View className="right-4 ">
                                <Text className="text-[12px] text-black pl-2 pt-0.5 mt-2">1.2 km</Text>
                                <View className="rounded-3xl bg-orange-500 flex justify-center items-center h-8 w-16 mt-14">
                                <Text className="text-white text-l font-bold">+ Add</Text>
                                </View>
                            </View>
                            
                        </View>
                        <View className="w-full h-32 bg-white rounded-xl border border-gray-200 flex-row mb-3">
                            <Image source={place7} className="rounded-xl h-28 w-28 my-2 mx-3 "></Image>
                            <View className="pt-3 flex-1 pr-2">
                                <Text className="text-black text-l font-extrabold">Viharamahadevi Park</Text>
                                <Text className="text-gray-400 text-sm">Beautiful urban park with playgrounds, walking paths, and peaceful green spaces.</Text>
                                <View className="flex-row pt-1">
                                    <Image source={star} className="h-3 w-3 mt-1"></Image>
                                    <Text className="text-l font-medium text-black pl-2">4.8</Text>
                                    <Text className="text-[12px] text-black pl-2 pt-0.5">(1,245)</Text>
                                </View>
                            </View>
                            <View className="right-4 ">
                                <Text className="text-[12px] text-black pl-2 pt-0.5 mt-2">1.2 km</Text>
                                <View className="rounded-3xl bg-orange-500 flex justify-center items-center h-8 w-16 mt-14">
                                <Text className="text-white text-l font-bold">+ Add</Text>
                                </View>
                            </View>
                            
                        </View>
                        <View className="w-full h-32 bg-white rounded-xl border border-gray-200 flex-row mb-3">
                            <Image source={place7} className="rounded-xl h-28 w-28 my-2 mx-3 "></Image>
                            <View className="pt-3 flex-1 pr-2">
                                <Text className="text-black text-l font-extrabold">Viharamahadevi Park</Text>
                                <Text className="text-gray-400 text-sm">Beautiful urban park with playgrounds, walking paths, and peaceful green spaces.</Text>
                                <View className="flex-row pt-1">
                                    <Image source={star} className="h-3 w-3 mt-1"></Image>
                                    <Text className="text-l font-medium text-black pl-2">4.8</Text>
                                    <Text className="text-[12px] text-black pl-2 pt-0.5">(1,245)</Text>
                                </View>
                            </View>
                            <View className="right-4 ">
                                <Text className="text-[12px] text-black pl-2 pt-0.5 mt-2">1.2 km</Text>
                                <View className="rounded-3xl bg-orange-500 flex justify-center items-center h-8 w-16 mt-14">
                                <Text className="text-white text-l font-bold">+ Add</Text>
                                </View>
                            </View>
                            
                        </View>
                        <View className="w-full h-32 bg-white rounded-xl border border-gray-200 flex-row mb-3">
                            <Image source={place7} className="rounded-xl h-28 w-28 my-2 mx-3 "></Image>
                            <View className="pt-3 flex-1 pr-2">
                                <Text className="text-black text-l font-extrabold">Viharamahadevi Park</Text>
                                <Text className="text-gray-400 text-sm">Beautiful urban park with playgrounds, walking paths, and peaceful green spaces.</Text>
                                <View className="flex-row pt-1">
                                    <Image source={star} className="h-3 w-3 mt-1"></Image>
                                    <Text className="text-l font-medium text-black pl-2">4.8</Text>
                                    <Text className="text-[12px] text-black pl-2 pt-0.5">(1,245)</Text>
                                </View>
                            </View>
                            <View className="right-4 ">
                                <Text className="text-[12px] text-black pl-2 pt-0.5 mt-2">1.2 km</Text>
                                <View className="rounded-3xl bg-orange-500 flex justify-center items-center h-8 w-16 mt-14">
                                <Text className="text-white text-l font-bold">+ Add</Text>
                                </View>
                            </View>
                            
                        </View>
                        <View className="w-full h-32 bg-white rounded-xl border border-gray-200 flex-row mb-3">
                            <Image source={place7} className="rounded-xl h-28 w-28 my-2 mx-3 "></Image>
                            <View className="pt-3 flex-1 pr-2">
                                <Text className="text-black text-l font-extrabold">Viharamahadevi Park</Text>
                                <Text className="text-gray-400 text-sm">Beautiful urban park with playgrounds, walking paths, and peaceful green spaces.</Text>
                                <View className="flex-row pt-1">
                                    <Image source={star} className="h-3 w-3 mt-1"></Image>
                                    <Text className="text-l font-medium text-black pl-2">4.8</Text>
                                    <Text className="text-[12px] text-black pl-2 pt-0.5">(1,245)</Text>
                                </View>
                            </View>
                            <View className="right-4 ">
                                <Text className="text-[12px] text-black pl-2 pt-0.5 mt-2">1.2 km</Text>
                                <View className="rounded-3xl bg-orange-500 flex justify-center items-center h-8 w-16 mt-14">
                                <Text className="text-white text-l font-bold">+ Add</Text>
                                </View>
                            </View>
                            
                        </View>
                    </View>
                        
                   </ScrollView> 
            </SafeAreaView>
        </SafeAreaProvider>
    )
}