import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LetterDetailScreen from '../screens/home/LetterDetailScreen';
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