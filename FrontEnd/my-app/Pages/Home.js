import "../global.css";
import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import * as Location from 'expo-location';
import { useColorScheme } from 'nativewind';
import logo from '../assets/search.png';
import Sleep from '../assets/sleep.png';
import rest from '../assets/rest.png';
import Locationping from '../assets/location-pin.png';
import Hiking from '../assets/hiking.png';
import Foggy from '../assets/Foggy.png';
import Clear from '../assets/Clear.png';
import stormy from '../assets/stormy.png';
import PartlyCloudy from '../assets/PartlyCloudy.png';
import Showers from '../assets/Showers.png';
import Snow from '../assets/Snow.png';
import rainy from '../assets/rainy.png';
import crisis from '../assets/crisis.png';
import moneyExchange from '../assets/moneyExchange.png';
import BASE_URL from '../config';


// Real place
const FEATURED = [
  { name: 'Sigiriya Rock', sub: 'Sri Lanka · 4.9 ★', uri: 'https://res.cloudinary.com/dojoopvkn/image/upload/v1780993545/photo%20spots/Pidurangala%20Rock.jpg' },
  { name: 'Nine Arch Bridge', sub: 'Ella, Sri Lanka · 4.9 ★', uri: 'https://res.cloudinary.com/dojoopvkn/image/upload/v1780994134/photo%20spots/Nine%20Arch%20Bridge.jpg' },
  { name: 'Mirissa Beach', sub: 'Matara · 4.8 ★', uri: 'https://res.cloudinary.com/dojoopvkn/image/upload/v1780993591/photo%20spots/Mirissa%20Beach.jpg' },
  { name: 'Yala National Park', sub: 'Hambantota · 4.9 ★', uri: 'https://res.cloudinary.com/dojoopvkn/image/upload/v1780993592/photo%20spots/Yala%20National%20Park.jpg' },
];

const POPULAR = [
  { name: 'Eiffel Tower', sub: 'Paris, France', rating: '4.9 ★', ratingBg: 'bg-blue-50 dark:bg-blue-900/40', ratingText: 'text-blue-500 dark:text-blue-400', uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/400px-Tour_Eiffel_Wikimedia_Commons.jpg' },
  { name: 'Colosseum', sub: 'Rome, Italy', rating: '4.8 ★', ratingBg: 'bg-amber-50 dark:bg-amber-900/40', ratingText: 'text-amber-500 dark:text-amber-400', uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/400px-Colosseo_2020.jpg' },
  { name: 'Grand Canyon', sub: 'Arizona, USA', rating: '4.7 ★', ratingBg: 'bg-emerald-50 dark:bg-emerald-900/40', ratingText: 'text-emerald-500 dark:text-emerald-400', uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Grand_Canyon_view_from_Pima_Point_2010.jpg/400px-Grand_Canyon_view_from_Pima_Point_2010.jpg' },
];

export default function Home() {
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [attraction, setAttraction] = useState([]);
  const [lkrAmount, setLkrAmount] = useState('1000');
  const [foreignAmount, setForeignAmount] = useState('3.31');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [weather, setweather] = useState({ temp: '--', weathercode: undefined, city: 'Loading...' });
  
  const getWeatherLabel = (code) => {
    if (code === 0) return Clear;
    if (code <= 3) return PartlyCloudy;
    if (code <= 48) return Foggy;
    if (code <= 67) return rainy;
    if (code <= 77) return Snow;
    if (code <= 82) return Showers;
    return stormy;
  };

  const exchangeRates = {
    USD: 302.50,
    EUR: 326.80,
    GBP: 385.40,
    AUD: 201.20,
  };

  const [alerts, setAlerts] = useState([]);

  const handleLkrChange = (val) => {
    setLkrAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setForeignAmount((num / exchangeRates[selectedCurrency]).toFixed(2));
    } else {
      setForeignAmount('');
    }
  };

  const handleForeignChange = (val) => {
    setForeignAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setLkrAmount((num * exchangeRates[selectedCurrency]).toFixed(0));
    } else {
      setLkrAmount('');
    }
  };

  const handleCurrencyChange = (cur) => {
    setSelectedCurrency(cur);
    const lkrNum = parseFloat(lkrAmount);
    if (!isNaN(lkrNum)) {
      setForeignAmount((lkrNum / exchangeRates[cur]).toFixed(2));
    }
  };


  useEffect(() => {
    (async () => {
      let lat = 6.9271;
      let lon = 79.8612;
      let city = 'Colombo';

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }).catch(() => null);
          if (!loc) {
            loc = await Location.getLastKnownPositionAsync({}).catch(() => null);
          }
          if (loc) {
            lat = loc.coords.latitude;
            lon = loc.coords.longitude;
            city = 'Your Location';
            const geo = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon }).catch(() => null);
            if (geo && geo[0]) {
              city = geo[0].city || geo[0].district || geo[0].subregion || geo[0].region || geo[0].name || 'Your Location';
            }
          }
        }
      } catch (err) {
        console.warn("Location error:", err);
      }

      fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}`)
        .then(t => t.json())
        .then(data => setweather({
          temp: Math.round(data.temperature_2m),
          weathercode: data.weathercode,
          city
        }))
        .catch(() => { });
      fetch(`${BASE_URL}/weather/alert?lat=${lat}&lon=${lon}`)
        .then(t => t.json())
        .then(data => setAlerts(data.alerts || []))
        .catch(() => { });

      fetch(`${BASE_URL}/Attraction`)
        .then(t => t.json())
        .then(data => {
          if (Array.isArray(data)) {
            setAttraction(data);
          }
        })
        .catch(() => { });

    })();
  }, []);

  const populerDestination = Array.isArray(attraction) ? attraction.filter(
    item => item.num_reviews >= 5000
  ).slice(0, 10) : [];

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top', 'left', 'right']}>

        {/* Header */}
        <View className="px-5 pt-5 pb-2 flex-row justify-between items-start">
          <View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white" style={{ letterSpacing: 0.5 }}>
              Where do you{"\n"}want to go?
            </Text>
          </View>
          {/* weather status */}
          <View className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-2xl px-3 py-2 items-center">
            <Text className="text-sm font-bold text-blue-700 dark:text-blue-400">{weather.city}</Text>
            <View className="flex-row items-center mt-0.5">
              {weather.weathercode !== undefined && (
                <Image
                  source={getWeatherLabel(weather.weathercode)}
                  className="w-4 h-4 mr-1"
                  resizeMode="contain"
                />
              )}
              <Text className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{weather.temp}°C</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <View className="px-5 pt-2 pb-1">
            <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-2xl py-3 px-4">
              <Image source={logo} className="w-5 h-5 opacity-50" style={isDark ? { tintColor: 'white' } : {}} />
              <TextInput
                placeholder="Search places, hotels, food..."
                placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
                className="pl-3 text-[15px] flex-1 text-gray-600 dark:text-gray-300"
                editable={false}
                pointerEvents="None"
              />
            </View>
          </View>
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

          {/* Safety Warnings */}

          {alerts.length > 0 && (
            <View className="mt-4 px-5">
              {alerts.slice(0, 2).map((alert, i) => (
                <View
                  key={i}
                  className={`rounded-2xl p-4 flex-row items-start mb-2 ${alert.level === 'red' ? 'bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800' :
                    alert.level === 'amber' ? 'bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800' :
                      'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-100 dark:border-yellow-800'
                    }`}
                  style={{ elevation: isDark ? 0 : 1 }}
                >
                  <Image source={crisis} className="h-5 w-5"></Image>
                  <View className="flex-1">
                    <Text className={`font-bold text-sm ${alert.level === 'red' ? 'text-red-800 dark:text-red-400' :
                      alert.level === 'amber' ? 'text-orange-800 dark:text-orange-400' :
                        'text-yellow-800 dark:text-yellow-400'
                      }`}>
                      {alert.place}
                    </Text>
                    <Text className={`text-xs mt-0.5 leading-4 ${alert.level === 'red' ? 'text-red-600 dark:text-red-500' :
                      alert.level === 'amber' ? 'text-orange-600 dark:text-orange-500' :
                        'text-yellow-600 dark:text-yellow-500'
                      }`}>
                      {alert.message}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Featured Destinations */}
          <View className="mt-6 px-5">
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-lg text-gray-900 dark:text-white">Featured Destinations</Text>
              <Text className="text-blue-500 dark:text-blue-400 text-sm font-medium">See all</Text>
            </View>
          </View>

          <View className="h-48 mt-3">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
              {FEATURED.map((item, i) => (
                <View key={i} className="w-52 h-44 mr-3 rounded-2xl overflow-hidden relative" style={{ elevation: isDark ? 0 : 4 }}>
                  <Image source={{ uri: item.uri }} className="w-full h-full absolute" resizeMode="cover" />
                  <View className="absolute inset-0 bg-black/35" />
                  <View className="absolute bottom-0 left-0 right-0 p-4">
                    <Text className="text-white font-bold text-base">{item.name}</Text>
                    <Text className="text-white/80 text-xs mt-0.5">{item.sub}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Explore Categories */}
          <View className="mt-6 px-5">
            <Text className="font-bold text-lg text-gray-900 dark:text-white">Explore Categories</Text>
            <View className="flex-row justify-between mt-4">

              <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Hotels")}>
                <View className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl justify-center items-center mb-2 border border-blue-100 dark:border-blue-800" style={{ elevation: isDark ? 0 : 2 }}>
                  <Image source={Sleep} className="w-8 h-8" resizeMode="contain" />
                </View>
                <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">Hotels</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Resturants")}>
                <View className="w-16 h-16 bg-orange-50 dark:bg-orange-900/30 rounded-2xl justify-center items-center mb-2 border border-orange-100 dark:border-orange-800" style={{ elevation: isDark ? 0 : 2 }}>
                  <Image source={rest} className="w-8 h-8" resizeMode="contain" />
                </View>
                <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">Foods</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Attraction")}>
                <View className="w-16 h-16 bg-rose-50 dark:bg-rose-900/30 rounded-2xl justify-center items-center mb-2 border border-rose-100 dark:border-rose-800" style={{ elevation: isDark ? 0 : 2 }}>
                  <Image source={Locationping} className="w-8 h-8" resizeMode="contain" />
                </View>
                <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">Places</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center" onPress={() => navigation.navigate("PhotoSpots")}>
                <View className="w-16 h-16 bg-violet-50 dark:bg-violet-900/30 rounded-2xl justify-center items-center mb-2 border border-violet-100 dark:border-violet-800" style={{ elevation: isDark ? 0 : 2 }}>
                  <Image source={Hiking} className="w-8 h-8" resizeMode="contain" />
                </View>
                <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">Tours</Text>
              </TouchableOpacity>

            </View>
          </View>

          {/* Currency Converter */}
          <View className="mt-8 px-5">
            <View className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm" style={{ elevation: isDark ? 0 : 3 }}>
              <View className="flex-row">
                <Image source={moneyExchange} className="w-6 h-6" resizeMode="contain" />
                <Text className="text-base font-bold text-gray-900 dark:text-white mb-1 ml-2">Currency Converter (LKR)</Text>
              </View>
              <Text className="text-gray-400 dark:text-gray-500 text-xs mb-3">Live mid-market rates for travelers in Sri Lanka</Text>

              <View className="flex-row justify-between mb-3">
                {['USD', 'EUR', 'GBP', 'AUD'].map((cur) => (
                  <TouchableOpacity
                    key={cur}
                    onPress={() => handleCurrencyChange(cur)}
                    className={`py-1.5 px-3 rounded-lg border ${selectedCurrency === cur ? 'bg-blue-600 border-blue-600' : 'bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600'
                      }`}
                  >
                    <Text className={`text-xs font-bold ${selectedCurrency === cur ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                      {cur}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="flex-row items-center justify-between">
                <View className="w-[45%]">
                  <Text className="text-[10px] text-gray-400 dark:text-gray-500 font-bold mb-1">LKR Amount</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={lkrAmount}
                    onChangeText={handleLkrChange}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white font-semibold"
                  />
                </View>
                <Text className="text-gray-300 dark:text-gray-600 font-bold text-lg mt-4">⇆</Text>
                <View className="w-[45%]">
                  <Text className="text-[10px] text-gray-400 dark:text-gray-500 font-bold mb-1">{selectedCurrency} Amount</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={foreignAmount}
                    onChangeText={handleForeignChange}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white font-semibold"
                  />
                </View>
              </View>
              <Text className="text-[10px] text-gray-400 dark:text-gray-500 mt-2.5 text-center">
                1 {selectedCurrency} ≈ {exchangeRates[selectedCurrency]} LKR
              </Text>
            </View>
          </View>

          {/* Popular Destinations */}
          <View className="mt-8 px-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-bold text-lg text-gray-900 dark:text-white">Popular Destinations</Text>
            </View>

            <ScrollView style={{ maxHeight: 280 }} showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
              {populerDestination.map((item, i) => {
                const ratingVal = parseFloat(item.rating) || 0;
                let ratingBg = 'bg-emerald-50 dark:bg-emerald-900/30';
                let ratingText = 'text-emerald-500 dark:text-emerald-400';
                if (ratingVal >= 4.8) {
                  ratingBg = 'bg-blue-50 dark:bg-blue-900/30';
                  ratingText = 'text-blue-500 dark:text-blue-400';
                } else if (ratingVal >= 4.6) {
                  ratingBg = 'bg-amber-50 dark:bg-amber-900/30';
                  ratingText = 'text-amber-500 dark:text-amber-400';
                }

                return (
                  <View key={i} className="bg-white dark:bg-gray-800 p-3 rounded-2xl mb-3 flex-row items-center border border-gray-100 dark:border-gray-700" style={{ elevation: isDark ? 0 : 3 }}>
                    <Image source={{ uri: item.image_url }} className="h-16 w-16 rounded-xl mr-3" resizeMode="cover" />
                    <View className="flex-1">
                      <Text className="text-base font-bold text-gray-900 dark:text-white">{item.attraction_name}</Text>
                      <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1">{item.city}, {item.province}</Text>
                    </View>
                    <View className={`${ratingBg} px-2 py-1 rounded-lg`}>
                      <Text className={`${ratingText} text-xs font-bold`}>{item.rating} ★</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>

        </ScrollView>

        {/* Bottom Navigation*/}
        <View className="absolute bottom-0 w-full bg-white dark:bg-gray-900 pt-3 pb-5 px-8 flex-row justify-between items-center border-t border-gray-100 dark:border-gray-800" style={{ elevation: isDark ? 0 : 10 }}>
          <View className="items-center">
            <View className="w-1.5 h-1.5 bg-blue-500 rounded-full mb-1" />
            <Text className="text-[13px] font-bold text-blue-500">Home</Text>
          </View>
          <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Explore")}>
            <View className="w-1.5 h-1.5 rounded-full mb-1" />
            <Text className="text-[13px] font-medium text-gray-400 dark:text-gray-500">Explore</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Tour Planing")}>
            <View className="w-1.5 h-1.5 rounded-full mb-1" />
            <Text className="text-[13px] font-medium text-gray-400 dark:text-gray-500">Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Profile")}>
            <View className="w-1.5 h-1.5 rounded-full mb-1" />
            <Text className="text-[13px] font-medium text-gray-400 dark:text-gray-500">Profile</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}