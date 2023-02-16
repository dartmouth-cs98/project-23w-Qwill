import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/home/HomeScreen';
import DraftsScreen from '../screens/home/DraftsScreen';

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
            title: "Mailbox",
            animation: 'none',
        }}
        name='Mailbox' 
        component={HomeScreen} 
        />
        <Stack.Screen 
        options={{
            title: "Drafts",
            animation: 'none',
        }}
        name='Drafts' 
        component={DraftsScreen}
        /> 
  </Stack.Navigator>
  );
}

export default HomeStack

const styles = StyleSheet.create({})