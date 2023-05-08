import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/home/HomeScreen';
import DraftsScreen from '../screens/home/DraftsScreen';
import LetterDetailScreen from '../screens/home/LetterDetailScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Mailbox" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F0F4FF' }}}>
      <Stack.Screen name='Mailbox' component={HomeScreen}/>
      <Stack.Screen name='Drafts' component={DraftsScreen}/> 
      <Stack.Screen name='LetterDetail' component={LetterDetailScreen}/>  
    </Stack.Navigator>
  );
}

export default HomeStack;