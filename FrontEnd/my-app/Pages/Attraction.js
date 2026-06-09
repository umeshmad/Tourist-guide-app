import React, { useEffect, useState } from 'react';
import {Text, View, TouchableOpacity,Image, ScrollView,TextInput,FlatList} from 'react-native';
import { SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import logo from '../assets/search.png';
import place6 from '../assets/place6.jpg';
import star from '../assets/star.png';
import place7 from '../assets/place7.jpg';
import drop from '../assets/drop.png';
import dropw from '../assets/drop-w.png';
import location from '../assets/location-pin.png';
import {useRoute} from '@react-navigation/native';
import BASE_URL from '../config';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Attraction(){
    const [selected, setSelected]=useState('All');
    const [attraction,setAttraction]=useState([]);
    const [search,setSearch]=useState('');
    const Route=useRoute();
    const navigation = useNavigation();
    const singlePlace=Route.params?.place;
    const [expand,setExpand]=useState(null);

    const addToTasks = async (place) => {
        try {
            const saved = await AsyncStorage.getItem('tasks');
            const tasks = saved ? JSON.parse(saved) : [];
            const exists = tasks.some(
                t => t.attraction_name === place.attraction_name
            );

            if (!exists) {
                tasks.push(place);
                await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
            }

            navigation.replace('Tour Planing');
        } catch (err) {
            console.error('Failed to save attraction task:', err);
        }
    };

    const fetchAttraction=async()=>{
        try{
            let url=`${BASE_URL}/Attraction`;
            if (search && selected !== 'All') {
                url += `?q=${search}&category=${selected}`;
            } else if (search) {
                url += `?q=${search}`;
            } else if (selected !== 'All') {
                url += `?category=${selected}`;
            }
            const res=await fetch(url);
            const text=await res.text();
            const data=JSON.parse(text);
            setAttraction(data);
        }catch(err){
            console.error(err);
        }

    }
    const populerDestination=Array.isArray(attraction)? attraction.filter(
        item=>item.num_reviews>=5000
    ):[];

    const logClick=async(attraction)=>{
        try {
            await fetch(`${BASE_URL}/log/click`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    attraction_id: attraction._id,
                    attraction_name: attraction.attraction_name,
                })
            });
        } catch (err) {
            // Logged silently
        }
    };
    useEffect(()=>{
        if(singlePlace){
            setAttraction([singlePlace]);
        }else{
            fetchAttraction();
        }
    },[singlePlace,search,selected]);

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
                            onChangeText={setSearch}
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
                        {populerDestination.map((item,index)=>(
                        <View key={index} className="bg-white border border-gray-200 flex h-40 w-56 rounded-xl overflow-hidden mr-3">
                            <Image source={{uri:item.image_url}} className="h-40 w-56 relative"></Image>
                            <View className="bg-black/40 absolute top-0 left-0 right-0 bottom-0 flex items-start pt-24 pl-2">
                                <Text className="text-white text-lg font-bold" numberOfLines={1}>{item.attraction_name}</Text>
                                <View className="flex-row">
                                <Image source={star} className="h-3 w-3 mt-1"></Image>
                                <Text className="text-l font-medium text-white pl-2">{item.rating}</Text>
                                <Text className="text-[12px] text-white pl-2 pt-0.5">• 1.2Km away</Text>
                                </View>
                                
                            </View>
                        </View>

                        ))}
                        
                            
                        
                        {/*
                        <View className="bg-white border border-gray-200  flex h-40 w-56 rounded-xl overflow-hidden mr-3">
                            <Image source={place6} className="h-40 w-56 relative"></Image>
                            <View className="bg-black/40 absolute top-0 left-0 right-0 bottom-0 flex items-start pt-24 pl-2">
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
                            <View className="bg-black/40 absolute top-0 left-0 right-0 bottom-0 flex items-start pt-24 pl-2">
                                <Text className="text-white text-xl font-bold">Temple</Text>
                                <View className="flex-row">
                                    <Image source={star} className="h-3 w-3 mt-1"></Image>
                                    <Text className="text-l font-medium text-white pl-2">4.8</Text>
                                    <Text className="text-[12px] text-white pl-2">(1,245)</Text>
                                    <Text className="text-[12px] text-white pl-2">• 1.2Km away</Text>
                                </View>
                                
                            </View>
                        </View>  
                        */}
                    </ScrollView>
                    <View className="py-4">
                        <Text className="text-black font-bold text-xl">All Atrraction</Text>
                        <Text className="text-gray-400 text-l">24 places found</Text>
                    </View>
                </View>
                
                    <FlatList
                    data={attraction}
                    keyExtractor={(item,index)=>index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal:16, paddingBottom:20}}
                    renderItem={({item,index})=>(
                        <View className="mb-3">

                            {/* Collapsed Card */}
                            {expand!==index &&(
                            <View className="w-full h-32 bg-white rounded-xl border border-gray-200 flex-row relative">
                                <TouchableOpacity onPress={()=>{logClick(item); setExpand(index);}} className="flex-row flex-1">
                                    <Image source={{uri:item.image_url}} className="rounded-xl h-28 w-28 my-2 mx-3"></Image>
                                    <View className="pt-3 flex-1 pr-2">
                                        <Text className="text-black text-l font-extrabold" numberOfLines={1}>{item.attraction_name}</Text>
                                        <Text className="text-gray-400 text-sm" numberOfLines={2}>{item.description}</Text>
                                        <View className="flex-row pt-1">
                                            <Image source={star} className="h-3 w-3 mt-1"></Image>
                                            <Text className="text-l font-medium text-black pl-2">{item.rating}</Text>
                                            <Text className="text-[12px] text-gray-400 pl-2 pt-0.5">({item.num_reviews})</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>setExpand(index)} className="absolute bottom-3 right-2">
                                    <Image source={drop} className="h-6 w-6"/>
                                </TouchableOpacity>
                            </View>
                            )}

                            {/* Expanded Card */}
                            {expand===index &&(
                            <View className="bg-white rounded-xl border border-gray-200 w-full mb-2 overflow-hidden">

                                <Image source={{uri:item.image_url}} className="w-full h-52" resizeMode="cover" style={{width:'100%',height:208}}/>
                                <TouchableOpacity onPress={()=>setExpand(null)} className="absolute right-4 top-4 bg-black/40 rounded-full p-2">
                                    <Image source={dropw} className="h-5 w-5"/>
                                </TouchableOpacity>

                                <View className="absolute top-4 left-4 bg-orange-500 rounded-2xl px-3 py-1">
                                    <Text className="text-white text-xs font-bold">{item.famous_or_hidden_gem}</Text>
                                </View>

                                <View className="p-4 bg-white">

                                    <View className="flex-row justify-between items-start">
                                        <View className="flex-1 pr-2">
                                            <Text className="text-xl text-black font-bold">{item.attraction_name}</Text>
                                            <View className="flex-row items-center mt-1">
                                                <Image source={star} className="h-4 w-4"/>
                                                <Text className="text-l font-medium text-black pl-2">{item.rating}</Text>
                                                <Text className="text-xs text-gray-400 pl-2">({item.num_reviews} reviews)</Text>
                                            </View>
                                        </View>
                                        <View className="bg-orange-100 rounded-lg px-2 py-1">
                                            <Text className="text-orange-600 text-xs font-bold">{item.attraction_type}</Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-center mt-2">
                                        <Image source={location} className="h-4 w-4"/>
                                        <Text className="text-sm text-gray-500 pl-2">{item.city}, {item.district}, {item.province}</Text>
                                    </View>

                                    <Text className="text-sm text-gray-600 mt-3">{item.description}</Text>

                                    <View className="h-[1px] bg-gray-200 my-4"/>

                                    {/* Suggested Activities */}
                                    <Text className="text-black font-bold text-l mb-2">Suggested Activities</Text>
                                    <View className="flex-row flex-wrap">
                                        {item.suggested_activities ? item.suggested_activities.split(';').map((act,i)=>(
                                            <View key={i} className="bg-orange-50 border border-orange-200 rounded-2xl px-3 py-1 mr-2 mb-2">
                                                <Text className="text-orange-600 text-xs font-medium">{act.trim()}</Text>
                                            </View>
                                        )) : null}
                                    </View>

                                    <View className="h-[1px] bg-gray-200 my-4"/>

                                    {/* Tourist Tips */}
                                    <Text className="text-black font-bold text-l mb-2">Tourist Tips</Text>
                                    <Text className="text-sm text-gray-500">{item.tourist_tips}</Text>

                                    {/* Safety Level */}
                                    <View className="flex-row items-center mt-3">
                                        <View className={`rounded-2xl px-3 py-1 ${ item.safety_level==='Safe' ? 'bg-green-100' : 'bg-yellow-100' }`}>
                                            <Text className={`text-xs font-bold ${ item.safety_level==='Safe' ? 'text-green-600' : 'text-yellow-600' }`}>🛡 {item.safety_level}</Text>
                                        </View>
                                    </View>

                                    <View className="h-[1px] bg-gray-200 my-4"/>

                                    <View className="flex-row justify-between items-center">
                                        <TouchableOpacity onPress={()=>setExpand(null)} className="flex-1 border border-orange-500 rounded-3xl py-3 mr-2 justify-center items-center">
                                            <Text className="text-orange-500 text-l font-bold">Close</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>addToTasks(item)} className="flex-1 bg-orange-500 rounded-3xl py-3 ml-2 justify-center items-center">
                                            <Text className="text-white text-l font-bold">+ Add to Plan</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                            )}

                        </View>
                    )}
                    />
                        {/*
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
                        */}
                    
            </SafeAreaView>
        </SafeAreaProvider>
    )
}