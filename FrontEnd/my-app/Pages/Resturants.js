import React,{useState, useEffect} from 'react';
import '../global.css';
import {Image, Text, ScrollView, TextInput, View,TouchableOpacity, FlatList, Linking, Alert} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import logo from '../assets/search.png';
import place8 from '../assets/place8.jpg';
import star from '../assets/star.png';
import place9 from '../assets/place9.jpg';
import drop from '../assets/drop.png';
import dropw from '../assets/drop-w.png';
import location from '../assets/location-pin.png';
import { useRoute } from '@react-navigation/native';
import BASE_URL from '../config';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Resturants(){

    const[resturant,setResturant]=useState([]);
    const [selected,setSelected]=useState('ALL');
    const Route=useRoute();
    const [loading,setLoading]=useState(false);
    const [search,setSearch]=useState('');
    const [originalResturant, setOriginalResturant] = useState([]);
    const [expand,setExpand]=useState(null);
    const navigation=useNavigation();

    const addToTasks=async(resturant)=>{
        try{
            const saved=await AsyncStorage.getItem('tasks');
            const tasks=saved ? JSON.parse(saved):[];
            const exists=tasks.some(t=>t.restaurant_name===resturant.restaurant_name);
            if(!exists){
                tasks.push(resturant);
                await AsyncStorage.setItem('tasks',JSON.stringify(tasks));
            }
            navigation.replace('Tour Planing');
        }catch(err){
            console.error('Failed to save resturant task:',err);
        }
    };

    const openMap=(link)=>{
        if(link) Linking.openURL(link).catch(()=>Alert.alert('Error','Could not open map'));
    };

    const proxyImage = (rawUrl) => {
        if (!rawUrl) return null;
        const url = rawUrl.replace(/^"|"$/g, '').trim();
        return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=400`;
    };


    useEffect(()=>{
        if(Route.params?.resturant){
            const resturantParam = Route.params.resturant;
            setResturant(Array.isArray(resturantParam) ? resturantParam : [resturantParam]);
            if(Route.params?.filterLabel){
            setSelected(Route.params.filterLabel);
    }
        }else{
            const fetchAllResturants=async()=>{
                try{
                    setLoading(true);
                    const res=await fetch(`${BASE_URL}/Resturants${selected !== 'ALL' ? `?category=${selected}` : ''}`);                    const data=await res.json();
                    setResturant(data);
                    setOriginalResturant(data);
                    
                }catch(err){
                    console.error(err);
                }finally{setLoading(false);
                    
                }
            };
            fetchAllResturants();
        }
    },[Route.params,selected]);

    const fetchResturants=async(query,category=selected)=>{
        try{
            
            let url=`${BASE_URL}/Resturants`;
            if(query && category !== 'ALL'){
                url+=`?q=${query}&category=${category}`
            }
            else if(query){
                url+=`?q=${query}`
            }else if(category !== 'ALL'){
                url+=`?category=${category}`
            }
            setLoading(true);
            const res=await fetch(url);
            const text = await res.text();
            const data = JSON.parse(text);
            setResturant(data);
            
        }catch(err){
            console.error(err);
        }finally{
            setLoading(false)
        }
    };

    const populerResturants=resturant.filter(
        resturant=>resturant.review_count>=380
    );

   

    return(
        <SafeAreaProvider>
            <SafeAreaView className="bg-white flex-1" edges={['top','right','left']}>
                <View className="justify-start pt-6 px-4">
                    <View className="flex-row items-center border border-gray-300 rounded-3xl py-2 px-2">
                        <Image source={logo} className="w-6 h-6 ml-2"/>
                            <TextInput 
                            placeholder="Search restaurants by name, city, cuisine, or nearby attraction…" 
                            className="pl-3 text-[12px] flex-1"
                            style={{ letterSpacing: 1 }}
                            onChangeText={(text)=>{setSearch(text);fetchResturants(text, selected);}}
                            />
                    </View>
                </View>
                <View className="flex-row">
                    {['ALL','Italian','Chinese','Sri Lankan'].map((items)=>(
                        <TouchableOpacity key={items} className={`rounded-3xl flex-1 h-12 justify-center items-center mr-2 mx-4 my-3 border border-gray-200 ${selected===items ? "bg-orange-500":"bg-white"}`}
                         onPress={()=>{setSelected(items);fetchResturants(search, items);}}>
                            <Text className={`text-l font-medium ${selected===items ? "text-white":"text-black"}`}>{items}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className="px-4 py-3">
                    <Text className="text-xl text-black font-bold my-3">Popular Restaurants</Text>
                    <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                        {populerResturants.map((resturant,index)=>(
                            <View key={index} className="rounded-xl bg-white border border-gray-200 w-65 overflow-hidden mr-3" >
                                <Image source={{uri:resturant.image_url_1}} className="h-40 w-60 relative"></Image>
                                <View className="bg-black/45 absolute right-0 left-0 top-0 bottom-0">
                                    <View className="px-4">
                                        <View className="mt-14">
                                            <Text className="text-white font-bold text-lg mt-5">{resturant.restaurant_name.replace(/ Restaurant$/i, '')}</Text>
                                            <Text className="text-white text-sm mt-1">{resturant.amenity_type}   • {resturant.dining_type} </Text>
                                            <View className="flex-row">
                                                <Image source={star} className="h-3 w-3 mt-1"></Image>
                                                <Text className="text-l font-medium text-white pl-2">{resturant.rating}</Text>
                                                <Text className="text-[12px] text-white pl-2 mt-0.5">({resturant.review_count})</Text>
                                                <Text className="text-[12px] text-white pl-2 mt-0.5">• 1.2Km away</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                        </View>
                        ))}
                        {/*
                        <View className="rounded-xl bg-white border border-gray-200 h-60 w-60 overflow-hidden mr-3" >
                            <Image source={place8} className="h-40 w-60 relative"></Image>
                            <View className="bg-white inset-0 absolute top-[55%]">
                                <View className="px-4 py-2">
                                    <Text className="text-black font-bold text-lg">Gallary cafe</Text>
                                    <Text className="text-gray-400 text-sm">International   • Fine Dining </Text>
                                    <View className="flex-row pt-3">
                                        <Image source={star} className="h-3 w-3 mt-1"></Image>
                                        <Text className="text-l font-medium text-black pl-2">4.8</Text>
                                        <Text className="text-[12px] text-gray-400 pl-2">(1,245)</Text>
                                        <Text className="text-[12px] text-gray-400 pl-2">• 1.2Km away</Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                        <View className="rounded-xl bg-white border border-gray-200 h-60 w-60 overflow-hidden mr-3" >
                            <Image source={place8} className="h-40 w-60 relative"></Image>
                            <View className="bg-white inset-0 absolute top-[55%]">
                                <View className="px-4 py-2">
                                    <Text className="text-black font-bold text-lg">Gallary cafe</Text>
                                    <Text className="text-gray-400 text-sm">International   • Fine Dining </Text>
                                    <View className="flex-row pt-3">
                                        <Image source={star} className="h-3 w-3 mt-1"></Image>
                                        <Text className="text-l font-medium text-black pl-2">4.8</Text>
                                        <Text className="text-[12px] text-gray-400 pl-2">(1,245)</Text>
                                        <Text className="text-[12px] text-gray-400 pl-2">• 1.2Km away</Text>
                                    </View>
                                </View>
                            </View>

                        </View>

                        */}

                    </ScrollView> 

                    <View className="py-4 px-4">
                        <Text className="text-black font-bold text-xl">All Restaurants</Text>
                    </View>
                </View>
                    
                <FlatList
                data={resturant}
                keyExtractor={(item,index)=>index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal:16, paddingBottom:20}}
                renderItem={({item:resturant,index})=>(
                    <View className="mb-3">

                        {/* Collapsed Card */}
                        {expand!==index &&(
                        <View className="w-full h-32 bg-white rounded-xl border border-gray-200 flex-row relative">
                            <TouchableOpacity onPress={()=>setExpand(index)} className="flex-row flex-1">
                                <Image source={{uri:proxyImage(resturant.image_url_1)}} className="rounded-xl h-28 w-28 my-2 mx-3"></Image>
                                <View className="pt-4 flex-1 pr-2">
                                    <Text className="text-black text-l font-extrabold" numberOfLines={1}>{resturant.restaurant_name}</Text>
                                    <Text className="text-gray-400 text-sm mt-3">{resturant.amenity_type} • {resturant.cuisine_type}</Text>
                                    <View className="flex-row pt-3">
                                        <Image source={star} className="h-3 w-3 mt-1"></Image>
                                        <Text className="text-l font-medium text-black pl-2">{resturant.rating}</Text>
                                        <Text className="text-[12px] text-gray-400 pl-2 pt-0.5">({resturant.review_count})</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        )}

                        {/* Expanded Card */}
                        {expand===index &&(
                        <View className="bg-white rounded-xl border border-gray-200 w-full mb-2 overflow-hidden">

                            <Image source={{uri:proxyImage(resturant.image_url_1)}} className="w-full h-52" resizeMode="cover" style={{width:'100%',height:208}}/>

                            <TouchableOpacity onPress={()=>setExpand(null)} className="absolute right-4 top-4 bg-black/40 rounded-full p-2">
                                <Image source={dropw} className="h-5 w-5"/>
                            </TouchableOpacity>

                            {/* Dining type badge */}
                            <View className="absolute top-4 left-4 bg-orange-500 rounded-2xl px-3 py-1">
                                <Text className="text-white text-xs font-bold">{resturant.dining_type}</Text>
                            </View>

                            <View className="p-4 bg-white">

                                {/* cuisine type */}
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1 pr-2">
                                        <Text className="text-xl text-black font-bold">{resturant.restaurant_name}</Text>
                                        <View className="flex-row items-center mt-1">
                                            <Image source={star} className="h-4 w-4"/>
                                            <Text className="text-l font-medium text-black pl-2">{resturant.rating}</Text>
                                            <Text className="text-xs text-gray-400 pl-2">({resturant.review_count} reviews)</Text>
                                        </View>
                                    </View>
                                    <View className="bg-orange-100 rounded-lg px-2 py-1">
                                        <Text className="text-orange-600 text-xs font-bold">{resturant.cuisine_type}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center mt-2">
                                    <Image source={location} className="h-4 w-4"/>
                                    <Text className="text-sm text-gray-500 pl-2">{resturant.address}, {resturant.city}, {resturant.district}, {resturant.province}</Text>
                                </View>

                                {resturant.vegetarian_friendly==='Yes' &&(
                                <View className="flex-row items-center mt-2">
                                    <View className="bg-green-100 rounded-2xl px-3 py-1">
                                        <Text className="text-green-600 text-xs font-bold">Vegetarian Friendly</Text>
                                    </View>
                                </View>
                                )}

                                <View className="h-[1px] bg-gray-200 my-4"/>

                                {/* Info grid */}
                                <View className="flex-row flex-wrap border-t border-b border-gray-100 py-3">
                                    {resturant.opening_hours ?(
                                    <View className="w-full my-1 flex-row items-center">
                                        <Text className="text-gray-400 text-xs font-semibold mr-1">Hours:</Text>
                                        <Text className="text-gray-700 text-xs font-bold flex-1">{resturant.opening_hours}</Text>
                                    </View>
                                    ):null}
                                    {resturant.phone ?(
                                    <View className="w-full my-1 flex-row items-center">
                                        <Text className="text-gray-400 text-xs font-semibold mr-1">Phone:</Text>
                                        <Text className="text-gray-700 text-xs font-bold">{resturant.phone}</Text>
                                    </View>
                                    ):null}
                                    {resturant.website ?(
                                    <View className="w-full my-1 flex-row items-center">
                                        <Text className="text-gray-400 text-xs font-semibold mr-1">Website:</Text>
                                        <TouchableOpacity onPress={()=>Linking.openURL(resturant.website)}>
                                            <Text className="text-orange-500 text-xs font-bold">{resturant.website}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    ):null}
                                </View>

                                {/* Nearby attractions */}
                                {resturant.nearby_attractions &&(
                                <View className="mt-4">
                                    <Text className="text-black font-bold text-l mb-2">Nearby Attractions</Text>
                                    <View className="flex-row flex-wrap">
                                        {resturant.nearby_attractions.split(';').map((att,i)=>(
                                            <View key={i} className="bg-orange-50 border border-orange-200 rounded-2xl px-3 py-1 mr-2 mb-2">
                                                <Text className="text-orange-600 text-xs font-medium">{att.trim()}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                                )}

                                <View className="h-[1px] bg-gray-200 my-4"/>

                                <View className="flex-row justify-between items-center">
                                    <TouchableOpacity onPress={()=>openMap(resturant.google_maps_link)} className="flex-1 border border-orange-500 rounded-3xl py-3 mr-2 justify-center items-center">
                                        <Text className="text-orange-500 text-l font-bold">Map</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>addToTasks(resturant)} className="flex-1 bg-orange-500 rounded-3xl py-3 ml-2 justify-center items-center">
                                        <Text className="text-white text-l font-bold">+ Add to Plan</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                        )}

                    </View>
                )}
                />

                

            </SafeAreaView>
        </SafeAreaProvider>
    )
}