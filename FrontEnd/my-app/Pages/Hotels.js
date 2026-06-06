import React,{useState,useEffect} from 'react';
import {Text, Image, View, ScrollView, FlatList, TextInput,TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
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
import beach from '../assets/beach.png';
import air from '../assets/airconditioning.png';
import kitchen from '../assets/kitchen.png';
import family from '../assets/family.png';
import garden from '../assets/park.png';
import cultural from '../assets/cultural.png';
import BASE_URL from '../config';

const proxyImage = (rawUrl) => {
    if (!rawUrl) return null;
    const url = rawUrl.replace(/^"|"$/g, '').trim();
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=400`;
};

const parseAttractionPlaces=(str)=>{
    if(!str) return [];
    return str
    .split(';')
    .map((part)=>part.replace(/\(.*?\)/g, '').trim())
    .filter(Boolean);
};
// database features names
const fetaturesIcon={
    "Free WiFi": wifi,
    "Swimming Pool": pool,
    "Free Parking": parking,
    "Restaurant On-site":fork,
    "Air Conditioning":air,
    "Beach Access":beach,
    "Full Kitchen":kitchen,
    "Family Friendly":family,
    "Garden":garden,
    "Heritage Property":cultural,
};

export default function Hotel(){
    const [selected,setSelected]=useState(1);
    const Route=useRoute();
    const [expand,setExpand]=useState(null);
    const [hotels,setHotels]=useState([]);
    const [search,setsearch]=useState('');          
    const [loading,setLoading]=useState(false);
    const [nearbymap,setNearByMap]=useState({});
    const [nearbyLoading, setNearbyLoading] = useState({});
    const [originalHotels, setOriginalHotels]=useState([]);

    useEffect(()=>{
        if(Route.params?.hotel){
            setHotels(Route.params.hotel);
            setOriginalHotels(Route.params.hotel);
        }else{
            const fetchAllHotels=async()=>{
            try{
                setLoading(true);
                const res=await fetch(`${BASE_URL}/Hotels`)
                const data=await res.json();
                setHotels(data);
            }catch(err){
                console.error(err);
            }finally{
                setLoading(false);
            }
            };
            fetchAllHotels();
        }
    },[Route.params]);

    const fetchSearchResults=async (query)=>{
        try{
            if(!query){ setHotels([]); return; }
            setLoading(true);
            const res=await fetch(`${BASE_URL}/Hotels?q=${query}`);
            const data=await res.json();
            setHotels(data);
            setOriginalHotels(data);
        }catch(err){
            console.error(err);
        }finally{
            setLoading(false);
        }
    };

    const fetchNearbyAtrractionPlaces = async (hotel, index) => {
    if (nearbymap[index]) return;
    const names = parseAttractionPlaces(hotel.nearby_attractions);
    if (names.length === 0) return;
    try {
        setNearbyLoading((prev) => ({ ...prev, [index]: true }));
        const query = names.join(",");
        const res = await fetch(`${BASE_URL}/Attraction/Names?names=${encodeURIComponent(query)}&hotelLat=${hotel.latitude}&hotelLon=${hotel.longitude}`);
        
        const text = await res.text();
        console.log("Server response:", text); // keep for debugging
        const data = JSON.parse(text);         // ✅ parse the text you already have
        
        setNearByMap((prev) => ({ ...prev, [index]: data }));
    } catch (err) {
        console.error('Failed to fetch nearby attractions:', err);
    } finally {
        setNearbyLoading((prev) => ({ ...prev, [index]: false }));
    }
};


    const handleExpand=(hotel,index)=>{
        const isOpening=expand!==index;
        setExpand(isOpening ? index:null);
        if (isOpening) fetchNearbyAtrractionPlaces(hotel, index);
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
                            value={search}
                            onChangeText={(text)=>{ setsearch(text); fetchSearchResults(text); }}
                        />
                    </View>
                </View>

                {hotels.length===0 && search.length>0 && !loading &&(
                    <Text className="text-gray-400 px-4 mt-2">No Hotels Found in this area</Text>
                )}

                {/* ✅ Added: loading indicator while fetching search results */}
                {loading && (
                    <ActivityIndicator size="large" color="#f87171" className="mt-4"/>
                )}

                <View className="flex-row px-4 pt-3 justify-between mb-4">
                    <TouchableOpacity onPress={() => {setSelected(1);setHotels([...originalHotels]);}} className={`h-12 flex-1 rounded-3xl flex-row mr-2 justify-center items-center ${selected===1 ? "bg-red-400":"bg-white border border-gray-200"}`}>
                        <Image source={setting} className="h-5 w-5 mr-2"/>
                        <Text className={`text-l font-bold ${selected===1 ? "text-white":"text-black"}`}>All Filters</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{setSelected(2); setHotels(price=>[...price].sort((a,b)=>{
                        const value1=parseFloat(a.price_per_night_usd.replace('$',''));
                        const value2=parseFloat(b.price_per_night_usd.replace('$',''));
                        return value1-value2;
                    }));
                    }} className={`h-12 flex-1 rounded-3xl flex-row mr-2 ${selected===2 ? "bg-red-400":"bg-white border border-gray-200"}`}>
                        <Text className={`text-l font-bold mt-3 ml-10 ${selected===2 ? "text-white":"text-black"}`}>Pricing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{setSelected(3); setHotels(ratings=>[...ratings].sort((b,c)=>{
                        const value3=parseFloat(b.star_rating);
                        const value4=parseFloat(c.star_rating);
                        return value4-value3;
                    }));
                    }} className={`h-12 flex-1 rounded-3xl flex-row mr-2 justify-center items-center ${selected===3 ? "bg-red-400":"bg-white border border-gray-200"}`}>
                        <Image source={star} className="h-4 w-4 mr-2"/>
                        <Text className={`text-l font-medium ${selected===3 ? "text-white":"text-black"}`}>Ratings</Text>
                    </TouchableOpacity>
                </View>

                {hotels.length>0 && (
                <FlatList 
                    data={hotels} 
                    keyExtractor={(item,index)=>index.toString()}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                    renderItem={({item:hotel,index})=>(
                        <View className="px-4 pb-3">
                            {expand!==index &&(
                            <View className="bg-white rounded-xl border border-gray-200 w-full h-32 translate-y-2 flex-row relative">
                                <Image source={{uri: proxyImage(hotel.image_url)}} className="rounded-xl h-24 w-24 mx-3 my-4"/>
                                <View className="pt-3 pl-2">
                                    <Text className="text-black text-l font-medium pb-1">{hotel.hotel_name}</Text>
                                    <View className="flex-row">
                                        <Image source={star} className="h-4 w-4"/>
                                        <Text className="text-sm font-medium text-black pl-2">{hotel.star_rating}</Text>
                                        <Text className="text-sm font-medium text-gray-400 pl-2">({hotel.review_count})</Text>
                                    </View>
                                    <Text className="font-extrabold text-red-400 text-xl">{hotel.price_per_night_usd}</Text>
                                    <Text className="text-sm font-medium text-gray-400">Per night</Text> 
                                </View>
                            </View>
                            )}

                            <TouchableOpacity onPress={()=>handleExpand(hotel,index)} className="absolute top-[40%] right-6">
                                <Image source={drop} className="h-6 w-6"/>
                            </TouchableOpacity>

                            {expand===index &&(
                            <View className="bg-white rounded-xl border border-gray-200 translate-y-2 w-full mb-12 overflow-hidden">
                                <Image source={{uri: proxyImage(hotel.image_url)}} className="w-full h-48 absolute" resizeMode="cover" style={{width:'100%', height:192}}/>

                                <TouchableOpacity onPress={()=>setExpand(null)} className="absolute right-4 mt-4">
                                    <Image source={dropw} className="h-6 w-6"/>
                                </TouchableOpacity>

                                <View className="bg-white rounded-b-xl mt-32">
                                    <View className="flex-row">
                                        <View className="pl-3 pt-4">
                                            <Text className="text-xl text-black font-bold">{hotel.hotel_name}</Text>
                                            <View className="flex-row pt-1">
                                                <Image source={star} className="h-5 w-5"/>
                                                <Text className="text-l font-medium text-black pl-2">{hotel.star_rating}</Text>
                                                <Text className="text-sm font-medium text-gray-400 pl-2">({hotel.review_count})</Text>
                                                <Text className="text-sm font-medium text-gray-400 pl-2">• 1.2Km away</Text>
                                            </View>
                                        </View>
                                        <View className="flex items-end pl-4 pt-4">
                                            <Text className="text-red-500 font-extrabold text-2xl">{hotel.price_per_night_usd}</Text>
                                            <Text className="text-sm font-medium text-gray-400">per night</Text>
                                        </View>
                                    </View>

                                    //description

                                    <View className="px-4 pt-3">
                                        <Text className="text-l text-gray-600">{hotel.description}</Text>
                                    </View>

                                    <View className="flex-row flex-wrap pl-4 py-3">
                                        {hotel.features ? hotel.features.split(";").map((features,index)=>{
                                            const name=features.trim();
                                            const icon=fetaturesIcon[name];
                                            return(
                                                <View key={index} className="w-1/3 flex-row my-2 items-center">
                                                    {icon && (<Image source={icon} className="w-5 h-5 mr-2 items-center"/>)}
                                                    <Text className="text-green-400 text-xs">{name}</Text>
                                                </View>
                                            );
                                        })
                                        :null}
                                        {/*
                                        <View className="w-1/3 flex-row my-2">
                                            <Image source={wifi} className="w-6 h-6 mr-3 ml-2"/>
                                            <Text className="text-green-400 text-sm">Free Wifi</Text>
                                        </View>
                                        <View className="w-1/3 flex-row my-2">
                                            <Image source={fork} className="w-6 h-6 mr-3 ml-2"/>
                                            <Text className="text-green-400 text-sm">Breakfast</Text>
                                        </View>
                                        <View className="w-1/3 flex-row my-2">
                                            <Image source={pool} className="w-6 h-6 mr-3 ml-2"/>
                                            <Text className="text-green-400 text-sm">Pool</Text>
                                        </View>
                                        <View className="w-1/3 flex-row my-2">
                                            <Image source={parking} className="w-6 h-6 mr-3 ml-2"/>
                                            <Text className="text-green-400 text-sm">parking</Text>
                                        </View>
                                        */}
                                    </View>

                                    <View className="flex items-end px-3">
                                        <TouchableOpacity onPress={()=>Alert.alert("Clicked")} className="bg-red-400 rounded-3xl translate-y-2 border border-gray-100 h-12 w-32 flex justify-center items-center">
                                            <Text className="text-xl font-bold text-white">Select</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View className="h-[1px] bg-gray-300 mx-4 mt-7 mb-6"/>

                                    <View className="flex-row">
                                        <Image source={location} className="h-5 w-5 ml-5 mt-1"/>
                                        <Text className="text-xl text-black font-bold pl-3">Nearby Atrraction places</Text>
                                    </View>

                                    {nearbyLoading[index] ? (
                                        <ActivityIndicator size="large" color="#f87171" className="my-6"/>
                                    ) : (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View className="flex-row py-3 px-6">
                                            {(nearbymap[index] && nearbymap[index].length>0) ? nearbymap[index].map((attraction,i)=>(
                                                <View key={i} className="pr-3">
                                                    <View className="bg-white h-80 w-64 rounded-xl overflow-hidden relative border border-gray-100">
                                                        <Image source={{uri: proxyImage(attraction.image_url)}} className="w-full h-36" onError={(e) => console.log('Image failed:', attraction.image_url, e.nativeEvent.error)}/>
                                                        <View className="left-0 right-0 top-[50%] bg-white rounded-b-xl bottom-0 absolute">
                                                            <Text className="text-black text-l font-bold pt-2">{attraction.attraction_name}</Text>
                                                            <View className="flex-row py-2">
                                                                <Image source={star} className="h-4 w-4"/>
                                                                <Text className="text-sm font-medium text-black pl-2">{attraction.rating}</Text>
                                                                <Text className="text-sm font-medium text-gray-400 pl-2">{attraction.distanceKm != null ? `• ${attraction.distanceKm} km away` : ''}</Text>
                                                            </View>
                                                            <ScrollView style={{ maxHeight: 90 }} showsVerticalScrollIndicator={true}>
                                                            <Text className="text-sm font-medium text-gray-400 px-4">{attraction.description}</Text>
                                                            </ScrollView>
                                                        </View>
                                                    </View>
                                                </View>
                                            )) : null}
                                        </View>
                                    </ScrollView>
                                    )}

                                    <View className="flex items-center px-3 pb-6">
                                        <TouchableOpacity onPress={()=>Alert.alert("Clicked")} className="bg-red-400 rounded-3xl border border-gray-100 h-12 w-64 flex justify-center items-center">
                                            <Text className="text-xl font-bold text-white">Add to To-Do list</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            )}

                        </View>
                    )}
                />
                )}

            </SafeAreaView>
        </SafeAreaProvider>
    )
}