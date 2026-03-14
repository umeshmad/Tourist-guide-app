import React from 'react';
import {Text, View, TouchableOpacity,Image, ScrollView,TextInput} from 'react-native';
import { SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import logo from '../assets/search.png';

export default function Attraction(){
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
                        <View key={items} className="rounded-3xl h-12 flex-1 bg-orange-500 border border-gray-200 justify-center items-center mr-1">
                            <Text className="text-l font-bold text-white">{items}</Text></View>))}
                    

                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    )
}