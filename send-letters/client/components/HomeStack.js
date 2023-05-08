import React from 'react';
import { Image } from 'react-native-elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import HomeScreen from '../screens/home/HomeScreen';
import DraftsScreen from '../screens/home/DraftsScreen';
import LetterDetailScreen from '../screens/home/LetterDetailScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeTopTabs from './HomeTopTabs';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Mailbox" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F0F4FF' }}}>
      <Stack.Screen name='HomeTopTabs' component={HomeTopTabs}/>
      <Stack.Screen name='LetterDetail' component={LetterDetailScreen}/> 
    </Stack.Navigator>
  );
}

export default HomeStack;