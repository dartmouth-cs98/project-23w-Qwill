import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeFriendsScreen from '../screens/friends/HomeFriendsScreen';
import FriendHistoryScreen from '../screens/friends/FriendHistoryScreen';
import AddFriendsScreen from '../screens/friends/AddFriendsScreen';
import LetterHistoryDetailScreen from '../screens/friends/LetterHistoryDetailScreen';

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
      }}
    >
      <Stack.Group>
        <Stack.Screen   
          options={{title: "HomeFriendsScreen",}}
          name='HomeFriendsScreen' 
          component={HomeFriendsScreen} 
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F0F4FF' }}}>
        <Stack.Screen 
          options={{title: "FriendHistoryScreen",}}
          name='FriendHistoryScreen' 
          component={FriendHistoryScreen}
        />
        <Stack.Screen 
          options={{title: "AddFriendsScreen",}}
          name='AddFriendsScreen' 
          component={AddFriendsScreen}
        />
        <Stack.Screen 
          options={{title: "LetterHistoryDetail",}}
          name='LetterHistoryDetail' 
          component={LetterHistoryDetailScreen}
        />
        
      </Stack.Group>
    </Stack.Navigator>
  );
}