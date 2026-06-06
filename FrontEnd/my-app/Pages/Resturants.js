import React,{useState, useEffect} from 'react';
import '../global.css';
import {Image, Text, ScrollView, TextInput, View,TouchableOpacity} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import logo from '../assets/search.png';
import place8 from '../assets/place8.jpg';
import star from '../assets/star.png';
import place9 from '../assets/place9.jpg';
import { useRoute } from '@react-navigation/native';
import BASE_URL from '../config';

export default function Resturants(){

    const[resturant,setResturant]=useState([]);
    const [selected,setSelected]=useState('ALL');
    const Route=useRoute();
    const [loading,setLoading]=useState(false);
    const [search,setSearch]=useState('');
    const [originalResturant, setOriginalResturant] = useState([]);

    const proxyImage = (rawUrl) => {
        if (!rawUrl) return null;
        const url = rawUrl.replace(/^"|"$/g, '').trim();
        return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=400`;
    };


    useEffect(()=>{
        if(Route.params?.resturant){
            setResturant(Route.params.resturant)
        }else{
            const fetchAllResturants=async()=>{
                try{
                    setLoading(true);
                    const res=await fetch(`${BASE_URL}/Resturants`);
                    const data=await res.json();
                    setResturant(data);
                    setOriginalResturant(data);
                    
                }catch(err){
                    console.error(err);
                }finally{setLoading(false);
                    
                }
            };
            fetchAllResturants();
        }
    },[Route.params]);

    const fetchResturants=async(query)=>{
        try{
            if(!query){
                setResturant(originalResturant);

                return;
            }
            setLoading(true);
            const res=await fetch(`${BASE_URL}/Resturants?q=${query}`);an
            const text = await res.text();
            console.log("Server response:", text);
            const data = JSON.parse(text);
            setResturant(data);
            
        }catch(err){
            console.error(err);
        }finally{
            setLoading(false)
        }
    };
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
                            onChangeText={(text)=>{setSearch(text);fetchResturants(text);}}
                            />
                    </View>
                </View>
                <View className="flex-row">
                    {['ALL','Italian','Chinese','Sri Lankan'].map((items)=>(
                        <TouchableOpacity key={items} className={`rounded-3xl flex-1 h-12 justify-center items-center mr-2 mx-4 my-3 border border-gray-200 ${selected===items ? "bg-orange-500":"bg-white"}`} onPress={()=>setSelected(items)}>
                            <Text className={`text-l font-medium ${selected===items ? "text-white":"text-black"}`}>{items}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className="px-4 py-3">
                    <Text className="text-xl text-black font-bold my-3">Popular Restaurants</Text>
                    <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}>
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

                    </ScrollView> 

                    <View className="py-4 px-4">
                        <Text className="text-black font-bold text-xl">All Restaurants</Text>
                    </View>
                </View>
                    
                <ScrollView 
                showsVerticalScrollIndicator={false}>
                    <View className="px-4">
                         {resturant.map((resturant,index)=>(
                            <View key={index} className="w-full h-32 bg-white rounded-xl border border-gray-200 flex-row mb-3">
                            <Image source={{uri:proxyImage(resturant.image_url_1)}} className="rounded-xl h-28 w-28 my-2 mx-3 "></Image>
                            <View className="pt-3 flex-1 pr-2">
                                <Text className="text-black text-l font-extrabold">{resturant.restaurant_name}</Text>
                                <Text className="text-gray-400 text-sm mt-3">Chines • Dim sum</Text>
                                <View className="flex-row pt-3">
                                    <Image source={star} className="h-3 w-3 mt-1"></Image>
                                    <Text className="text-l font-medium text-black pl-2">4.8</Text>
                                    <Text className="text-[12px] text-black pl-2 pt-0.5">(1,245)</Text>
                                </View>
                            </View>
                            <View className="right-4 ">
                                <Text className="text-[12px] text-black pl-2 pt-0.5 mt-2.5">1.2 km Away</Text>
                            </View>
                        </View>

                         ))}
                        {/*
                        <View className="w-full h-32 bg-white rounded-xl border border-gray-200 flex-row mb-3">
                            <Image source={place9} className="rounded-xl h-28 w-28 my-2 mx-3 "></Image>
                            <View className="pt-3 flex-1 pr-2">
                                <Text className="text-black text-l font-extrabold">Golden cafe</Text>
                                <Text className="text-gray-400 text-sm mt-3">Chines • Dim sum</Text>
                                <View className="flex-row pt-3">
                                    <Image source={star} className="h-3 w-3 mt-1"></Image>
                                    <Text className="text-l font-medium text-black pl-2">4.8</Text>
                                    <Text className="text-[12px] text-black pl-2 pt-0.5">(1,245)</Text>
                                </View>
                            </View>
                            <View className="right-4 ">
                                <Text className="text-[12px] text-black pl-2 pt-0.5 mt-2.5">1.2 km Away</Text>
                            </View>
                        </View>
                        <View className="w-full h-32 bg-white rounded-xl border border-gray-200 flex-row mb-3">
                            <Image source={place9} className="rounded-xl h-28 w-28 my-2 mx-3 "></Image>
                            <View className="pt-3 flex-1 pr-2">
                                <Text className="text-black text-l font-extrabold">Golden cafe</Text>
                                <Text className="text-gray-400 text-sm mt-3">Chines • Dim sum</Text>
                                <View className="flex-row pt-3">
                                    <Image source={star} className="h-3 w-3 mt-1"></Image>
                                    <Text className="text-l font-medium text-black pl-2">4.8</Text>
                                    <Text className="text-[12px] text-black pl-2 pt-0.5">(1,245)</Text>
                                </View>
                            </View>
                            <View className="right-4 ">
                                <Text className="text-[12px] text-black pl-2 pt-0.5 mt-2.5">1.2 km Away</Text>
                            </View>
                        </View>
                        <View className="w-full h-32 bg-white rounded-xl border border-gray-200 flex-row mb-3">
                            <Image source={place9} className="rounded-xl h-28 w-28 my-2 mx-3 "></Image>
                            <View className="pt-3 flex-1 pr-2">
                                <Text className="text-black text-l font-extrabold">Golden cafe</Text>
                                <Text className="text-gray-400 text-sm mt-3">Chines • Dim sum</Text>
                                <View className="flex-row pt-3">
                                    <Image source={star} className="h-3 w-3 mt-1"></Image>
                                    <Text className="text-l font-medium text-black pl-2">4.8</Text>
                                    <Text className="text-[12px] text-black pl-2 pt-0.5">(1,245)</Text>
                                </View>
                            </View>
                            <View className="right-4 ">
                                <Text className="text-[12px] text-black pl-2 pt-0.5 mt-2.5">1.2 km Away</Text>
                            </View>
                        </View>

                        */}
                            
                            

                    </View>
                    </ScrollView>

                

            </SafeAreaView>
        </SafeAreaProvider>
    )
}