import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import "./global.css";

import Login from './Pages/Login';
import Register from './Pages/Register';
import Preferences from './Pages/Preferences';
import Festivals from './Pages/Festivals';
import Home from './Pages/Home';
import Explore from './Pages/Explore';
import Sheduler from './Pages/Sheduler';
import Profile from './Pages/Profile';
import Search from './Pages/Search';
import Hotel from './Pages/Hotels';
import Attraction from './Pages/Attraction';
import Resturants from './Pages/Resturants';
import PhotoSpots from './Pages/PhotoSpots';
import EditProfile from './Pages/EditProfile';
import AppSettings from './Pages/AppSettings';
const Stack = createNativeStackNavigator();

export default function App() {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('appSettings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (parsed.isDarkMode !== undefined) {
            setColorScheme(parsed.isDarkMode ? 'dark' : 'light');
          }
        }
      } catch (error) {
        console.error("Failed to load theme setting", error);
      }
    };
    loadTheme();
  }, []); // Remove setColorScheme from dependency array to prevent flickering

  const isDark = colorScheme === 'dark';

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: isDark ? '#111827' : '#FFFFFF' },
          headerTintColor: isDark ? '#FFFFFF' : '#111827',
          headerShadowVisible: !isDark,
        }}
      >
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Preferences" component={Preferences} options={{ headerShown: false }} />
        <Stack.Screen name="Festivals" component={Festivals} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Explore" component={Explore}/>
        <Stack.Screen name="Tour Planing" component={Sheduler}/>
        <Stack.Screen name="Profile" component={Profile}/>
        <Stack.Screen name="Search" component={Search}/>
        <Stack.Screen name="Hotels" component={Hotel}/>
        <Stack.Screen name="Attraction"component={Attraction}/>
        <Stack.Screen name="Resturants" component={Resturants}/>
        <Stack.Screen name="PhotoSpots" component={PhotoSpots}/>
        <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }}/>
        <Stack.Screen name="AppSettings" component={AppSettings} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}