import "../global.css";
import React from "react";
import {View, Text, Image,TouchableOpacity, Alert} from 'react-native' ;
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Calander from '../assets/event.png';
import Plus from '../assets/plus.png';
import calander2 from '../assets/schedule.png';
import { useNavigation } from "@react-navigation/native";

export default function TourPlaning(){
    const navigation = useNavigation();
    return(
        <SafeAreaProvider>
            <SafeAreaView className="bg-white flex-1" edges={['top','right','left']}>
                <View className="flex-row justify-between px-4 pt-4">
                    <Text className="text-black font-bold text-2xl flex justify-center">Paris Adventure</Text>
                    <TouchableOpacity 
                    onPress={() => Alert.alert("Clicked!")}
                    className="bg-blue-600 rounded-xl px-4 py-2 flex justify-center items-center">
                        <Text className="text-white text-base font-bold">+  Add</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row pt-3 px-4">
                    <Image source={Calander} className="w-8 h-8"></Image>
                    <Text className="text-gray-500 text-xl pt-1 px-3">1 Day Tour</Text>
                </View>
                <View className="px-4 mt-8">
                    <View className="bg-blue-700 relative  w-full h-64 rounded-2xl flex translalte-y-2 overflow-hidden border border-gray-200 ">
                        <View className="pt-4 px-4 flex-row justify-between">
                            <View className="w-20 h-20 mt-3 rounded-full relative bg-white/30 flex justify-center items-center">
                                <Image source={calander2} className="absolute w-12 h-12 "></Image>
                            </View>
                            <View className="flex-col flex-1 mt-4 pl-6">
                                <Text className="text-white font-bold text-2xl">Day 1</Text>
                                <Text className="text-white text-xl">Moneday,March 15</Text>
                            </View>
                            
                            <View className="">
                                <View className="w-12 h-12 rounded-full relative bg-white/30 flex justify-center items-center">
                                <Image source={Plus} className="absolute w-6 h-6 "></Image>
                                </View>
                            </View>  
                        </View>
                        
                        <View className="absolute w-full h-[48%] bg-white bottom-0 ">
                            <View className="flex-row justify-between py-8 px-4">
                                <Text className="text-black font-bold text-2xl pt-2">Task Name</Text>
                                <TouchableOpacity onPress={()=>Alert.alert("Clicked")} 
                                className="bg-blue-600 flex justify-center items-center rounded-xl px-4 py-4">
                                    <Text className="text-white text-base font-bold ">View Place</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="absolute bottom-0 h-20 w-full bg-white border-t border-gray-200 flex-row justify-around items-center">
                    <TouchableOpacity className="items-center" onPress={()=>navigation.navigate("Home")}>
                        <Text className="text-[16px] font-medium">Home</Text>
                    </TouchableOpacity>
                
                    <TouchableOpacity
                    className="items-center" onPress={()=>navigation.navigate("Explore")}>
                        <Text className="text-[16px] font-medium">Explore</Text>
                    </TouchableOpacity>
                
                    <TouchableOpacity className="items-center" onPress={()=>navigation.navigate("Tour Planing")}>
                        <Text className="text-[16px] font-medium">Sheduler</Text>
                    </TouchableOpacity>
                
                    <TouchableOpacity className="items-center" onPress={()=>navigation.navigate("Profile")}>
                        <Text className="text-[16px] font-medium">Profile</Text>
                    </TouchableOpacity>
                
                </View>
                

            </SafeAreaView>
        </SafeAreaProvider>
    )

}