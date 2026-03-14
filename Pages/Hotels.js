import React,{useState} from 'react';
import {Text, Image, View, ScrollView, TextInput,TouchableOpacity, Alert} from 'react-native';
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';
import logo from '../assets/search.png';
import setting from '../assets/settings 1.png';
import star from '../assets/star.png';
import hotel1 from '../assets/hotel1.jpg';
import wifi from '../assets/wifi.png';
import fork from '../assets/fork-and-knife.png';
import pool from '../assets/swimming-pool.png';
import parking from '../assets/parking.png';
import location from '../assets/location-pin.png';
import place4 from '../assets/place4.jpg';
import place5 from '../assets/place5.jpg';
import drop from '../assets/drop.png';
import dropw from '../assets/drop-w.png';

export default function Hotel(){
    const [selected,setSelected]=useState(1);
    const [expand,setExpand]=useState(null);
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
                <View className="flex-row px-4 pt-3 justify-between mb-4">
                    <TouchableOpacity onPress={() => setSelected(1)} className={`h-12 flex-1 rounded-3xl flex-row mr-2 justify-center items-center ${selected=== 1 ? "bg-red-400":"bg-white border border-gray-200"}`}>
                        <Image source={setting} className="h-5 w-5 mr-2"></Image>
                        <Text className={`text-l font-bold ${selected===1 ? "text-white":"text-black"}`}>All Filters</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>setSelected(2)}
                    className={`h-12 flex-1 rounded-3xl flex-row mr-2 ${selected===2 ? "bg-red-400":"bg-white border border-gray-200"}`}>
                        <Text className={`text-l font-bold mt-3 ml-10 ${selected===2 ? "text-white":"text-black"}`}>Pricing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>setSelected(3)} 
                    className={`h-12 flex-1 rounded-3xl flex-row mr-2 justify-center items-center  ${selected===3 ? "bg-red-400":"bg-white border border-gray-200"}`}>
                        <Image source={star} className="h-4 w-4 mr-2"></Image>
                        <Text className={`text-l font-medium ${selected===3 ? "text-white":"text-black"}`}>Ratings</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView 
                showsVerticalScrollIndicator={false}>
                    <View className="px-4">
                        <View className="pb-3">
                        {expand !=='card1' &&(
                        <View className="bg-white rounded-xl border border-gray-200 w-full h-32 translate-y-2 flex-row relative">
                            <Image source={place5} className="rounded-xl h-24 w-24 mx-3 my-4"></Image>
                            <View className="pt-3 pl-2">
                                <Text className="text-black text-l font-medium pb-1">Cinamon grand</Text>
                                <View className="flex-row">
                                    <Image source={star} className="h-4 w-4"></Image>
                                    <Text className="text-sm font-medium text-black pl-2">4.8</Text>
                                    <Text className="text-sm font-medium text-gray-400 pl-2">(1,245)</Text>
                                </View>
                                <Text className="font-extrabold text-red-400 text-xl">$ 180</Text>
                                <Text className="text-sm font-medium text-gray-400 ">Per night</Text> 
                            </View>
                        </View>)}
                        <TouchableOpacity onPress={()=>setExpand(expand==='card1'? null:'card1')} className="absolute top-[40%] right-6">
                            <Image source={drop} className="h-6 w-6 "></Image>
                        </TouchableOpacity>
                        {expand==='card1' &&(
                        <View className="bg-white rounded-xl border border-gray-200 translate-y-2 w-full mb-12 overflow-hidden">
                            <Image source={hotel1} className="w-full h-48 absolute "></Image>
                            <TouchableOpacity onPress={()=>setExpand('null')} className="absolute right-4 mt-4">
                            <Image source={dropw} className="h-6 w-6 "></Image>
                            </TouchableOpacity>
                            <View className="bg-white rounded-b-xl mt-32">
                                <View className="flex-row">
                                    <View className="pl-3 pt-4">
                                        <Text className="text-xl text-black font-bold">Shamgrilla Hotel</Text>
                                        <View className="flex-row pt-1">
                                            <Image source={star} className="h-5 w-5"></Image>
                                            <Text className="text-l font-medium text-black pl-2">4.8</Text>
                                            <Text className="text-sm font-medium text-gray-400 pl-2">(1,245)</Text>
                                            <Text className="text-sm font-medium text-gray-400 pl-2">• 1.2Km away</Text>
                                        </View>
                                    </View>
                                    <View className="pl-28 pt-4">
                                        <Text className="text-red-500 font-extrabold text-2xl">$180</Text>
                                        <Text className="text-sm font-medium text-gray-400">per night</Text>
                                    </View>
                                </View>
                                <View className="px-4 pt-3">
                                    <Text className="text-l text-gray-600">Luxurious 5-star hotel with stunning ocean views, world-class dining, and exceptional service in the heart of Colombo's business district.</Text>
                                </View>
                                <View className="flex-row flex-wrap pl-4 py-3">
                                    <View className="w-1/3 flex-row my-2">
                                        <Image source={wifi} className="w-6 h-6 mr-3 ml-2"></Image>
                                        <Text className="text-green-400 text-sm">Free Wifi</Text>
                                    </View>
                                    <View className="w-1/3 flex-row my-2">
                                        <Image source={fork} className="w-6 h-6 mr-3 ml-2"></Image>
                                        <Text className="text-green-400 text-sm">Breakfast</Text>
                                    </View>
                                    <View className="w-1/3 flex-row my-2">
                                        <Image source={pool} className="w-6 h-6 mr-3 ml-2"></Image>
                                        <Text className="text-green-400 text-sm">Pool</Text>
                                    </View>
                                    <View className="w-1/3 flex-row my-2">
                                        <Image source={parking} className="w-6 h-6 mr-3 ml-2"></Image>
                                        <Text className="text-green-400 text-sm">parking</Text>
                                    </View>
                                </View>
                                <View className="flex items-end px-3">
                                    <TouchableOpacity onPress={()=>Alert.alert("Clicked")} className="bg-red-400 rounded-3xl translate-y-2 border border-gray-100 h-12 w-32 flex justify-center items-center">
                                        <Text className="text-xl font-bold text-white">Select</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="h-[1px] bg-gray-300 mx-4 mt-7 mb-6"></View>
                                <View className="flex-row">
                                    <Image source={location} className="h-5 w-5 ml-5 mt-1"></Image>
                                    <Text className="text-xl text-black font-bold pl-3">Nearby Atrraction places</Text>
                                </View>
                                <ScrollView
                                showsHorizontalScrollIndicator={false}
                                horizontal>
                                    <View className="flex-row py-3 px-6">
                                        <View className="pr-3">
                                        <View className="bg-white h-80 w-64 rounded-xl overflow-hidden relative border border-gray-100">
                                            <Image source={place4} className="w-full h-36"></Image>
                                            <View className="left-0 right-0 top-[50%] bg-white rounded-b-xl bottom-0 absolute">
                                                <Text className="text-black text-l font-bold pt-2">Nice Place</Text>
                                                <View className="flex-row py-2">
                                                    <Image source={star} className="h-4 w-4"></Image>
                                                    <Text className="text-sm font-medium text-black pl-2">4.8</Text>
                                                    <Text className="text-sm font-medium text-gray-400 pl-2">• 1.2Km away</Text>
                                                </View>
                                                <Text className="text-sm font-medium text-gray-400 px-4">Scenic lake in the heart of Colombo, perfect for boat rides and sunset views.</Text>
                                            </View>
                                        </View>
                                        </View>
                                        <View className="pr-3">
                                        <View className="bg-white h-80 w-64 rounded-xl overflow-hidden relative border border-gray-100">
                                            <Image source={place4} className="w-full h-36"></Image>
                                            <View className="left-0 right-0 top-[50%] bg-white rounded-b-xl bottom-0 absolute">
                                                <Text className="text-black text-l font-bold pt-2">Nice Place</Text>
                                                <View className="flex-row py-2">
                                                    <Image source={star} className="h-4 w-4"></Image>
                                                    <Text className="text-sm font-medium text-black pl-2">4.8</Text>
                                                    <Text className="text-sm font-medium text-gray-400 pl-2">• 1.2Km away</Text>
                                                </View>
                                                <Text className="text-sm font-medium text-gray-400 px-4">Scenic lake in the heart of Colombo, perfect for boat rides and sunset views.</Text>
                                            </View>
                                        </View>
                                        </View>
                                        <View className="pr-3">
                                        <View className="bg-white h-70 w-64 rounded-xl overflow-hidden relative border border-gray-100">
                                            <Image source={place4} className="w-full h-36"></Image>
                                            <View className="left-0 right-0 top-[50%] bg-white rounded-b-xl bottom-0 absolute">
                                                <Text className="text-black text-l font-bold pt-2">Nice Place</Text>
                                                <View className="flex-row py-2">
                                                    <Image source={star} className="h-4 w-4"></Image>
                                                    <Text className="text-sm font-medium text-black pl-2">4.8</Text>
                                                    <Text className="text-sm font-medium text-gray-400 pl-2">• 1.2Km away</Text>
                                                </View>
                                                <Text className="text-sm font-medium text-gray-400 px-4">Scenic lake in the heart of Colombo, perfect for boat rides and sunset views.</Text>
                                            </View>
                                        </View>
                                        </View>
                                    </View>
                                </ScrollView>
                                <View className="flex items-center px-3 pb-6">
                                    <TouchableOpacity onPress={()=>Alert.alert("Clicked")} className="bg-red-400 rounded-3xl border border-gray-100 h-12 w-64 flex justify-center items-center">
                                        <Text className="text-xl font-bold text-white">Add to To-Do list</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        )}
                        </View>

                        

                    </View>

                    <View className="px-4 pb-6">
                        <View className="pb-3">
                        <View className="bg-white rounded-xl border border-gray-200 w-full h-32 translate-y-2 flex-row relative">
                            <Image source={place5} className="rounded-xl h-24 w-24 mx-3 my-4"></Image>
                            <View className="pt-3 pl-2">
                                <Text className="text-black text-l font-medium pb-1">Cinamon grand</Text>
                                <View className="flex-row">
                                    <Image source={star} className="h-4 w-4"></Image>
                                    <Text className="text-sm font-medium text-black pl-2">4.8</Text>
                                    <Text className="text-sm font-medium text-gray-400 pl-2">(1,245)</Text>
                                </View>
                                <Text className="font-extrabold text-red-400 text-xl">$ 180</Text>
                                <Text className="text-sm font-medium text-gray-400 ">Per night</Text> 
                            </View>
                        </View>
                            <Image source={drop} className="h-6 w-6 absolute top-[40%] right-6"></Image>
                        </View>
                        <View className="pb-3">
                        <View className="bg-white rounded-xl border border-gray-200 w-full h-32 translate-y-2 flex-row relative">
                            <Image source={place5} className="rounded-xl h-24 w-24 mx-3 my-4"></Image>
                            <View className="pt-3 pl-2">
                                <Text className="text-black text-l font-medium pb-1">Cinamon grand</Text>
                                <View className="flex-row">
                                    <Image source={star} className="h-4 w-4"></Image>
                                    <Text className="text-sm font-medium text-black pl-2">4.8</Text>
                                    <Text className="text-sm font-medium text-gray-400 pl-2">(1,245)</Text>
                                </View>
                                <Text className="font-extrabold text-red-400 text-xl">$ 180</Text>
                                <Text className="text-sm font-medium text-gray-400 ">Per night</Text> 
                            </View>
                        </View>
                            <Image source={drop} className="h-6 w-6 absolute top-[40%] right-6"></Image>
                        </View>
                        <View className="pb-3">
                        <View className="bg-white rounded-xl border border-gray-200 w-full h-32 translate-y-2 flex-row relative">
                            <Image source={place5} className="rounded-xl h-24 w-24 mx-3 my-4"></Image>
                            <View className="pt-3 pl-2">
                                <Text className="text-black text-l font-medium pb-1">Cinamon grand</Text>
                                <View className="flex-row">
                                    <Image source={star} className="h-4 w-4"></Image>
                                    <Text className="text-sm font-medium text-black pl-2">4.8</Text>
                                    <Text className="text-sm font-medium text-gray-400 pl-2">(1,245)</Text>
                                </View>
                                <Text className="font-extrabold text-red-400 text-xl">$ 180</Text>
                                <Text className="text-sm font-medium text-gray-400 ">Per night</Text> 
                            </View>
                        </View>
                            <Image source={drop} className="h-6 w-6 absolute top-[40%] right-6"></Image>
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}