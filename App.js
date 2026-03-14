import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import "./global.css";

import Home from './Pages/Home';
import Explore from './Pages/Explore';
import Sheduler from './Pages/Sheduler';
import Profile from './Pages/Profile';
import Search from './Pages/Search';
import Hotel from './Pages/Hotels';
import Attraction from './Pages/Attraction';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Explore" component={Explore}/>
        <Stack.Screen name="Tour Planing" component={Sheduler}/>
        <Stack.Screen name="Profile" component={Profile}/>
        <Stack.Screen name="Search" component={Search}/>
        <Stack.Screen name="Hotels" component={Hotel}/>
        <Stack.Screen name="Attraction"component={Attraction}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}