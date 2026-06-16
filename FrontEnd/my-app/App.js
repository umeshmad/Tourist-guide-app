import React from 'react';
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

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}