import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeFriendsScreen from '../screens/friends/HomeFriendsScreen';
import AddFriendsScreen from '../screens/friends/AddFriendsScreen';
import PendingFriendsScreen from '../screens/friends/PendingFriendsScreen';

// Contains the mailbox and the drafts page
const Stack = createNativeStackNavigator();

// This stack will have a main screen (friends) and two modal screens which can be navigated to
// (pending friend requests and add friends)
// https://reactnavigation.org/docs/modal/
export default function FriendStack() {
  // the "name" property of each screen is what should be referred to when routing with navigators
  return (
    <Stack.Navigator
      initialRouteName="HomeFriendsScreen"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTransparent: true,
        headerTitle: "",
        animationTypeForReplace: "pop",
        contentStyle: { backgroundColor: '#F0F4FF' },
        headerShown: false
      }}>

      <Stack.Screen name='HomeFriendsScreen' component={HomeFriendsScreen} />
      <Stack.Group screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F0F4FF' } }}>
        <Stack.Screen name='AddFriendsScreen' component={AddFriendsScreen}/>
        <Stack.Screen name='PendingFriendsScreen' component={PendingFriendsScreen} />
      </Stack.Group>
      
    </Stack.Navigator>
  );
}