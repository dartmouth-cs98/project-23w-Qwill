import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/home/HomeScreen';
import DraftsScreen from '../screens/home/DraftsScreen';
import LetterDetailScreen from '../screens/home/LetterDetailScreen';

// Contains the mailbox and the drafts page
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Mailbox"
      screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen   
        options={{
            animation: 'none',
        }}
        name='Mailbox' 
        component={HomeScreen} 
        />
        <Stack.Screen 
        options={{
            animation: 'none',
        }}
        name='Drafts' 
        component={DraftsScreen}
        /> 
        <Stack.Screen 
        options={{
            animation: 'none',
        }}
        name='LetterDetail' 
        component={LetterDetailScreen}
        /> 
  </Stack.Navigator>
  );
}

export default HomeStack

const styles = StyleSheet.create({})