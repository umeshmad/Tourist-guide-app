import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import "./global.css";

import Home from './Pages/Home';
import Explore from './Pages/Explore';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Explore" component={Explore}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}