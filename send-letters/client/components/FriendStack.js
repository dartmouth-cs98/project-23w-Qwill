import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FriendsScreen from '../screens/friends/FriendsScreen';
import AddFriendsScreen from '../screens/friends/AddFriendsScreen';
import PendingFriendsScreen from '../screens/friends/PendingFriendsScreen';

// Contains the mailbox and the drafts page
const Stack = createNativeStackNavigator();

// This stack will have a main screen (friends) and two modal screens which can be navigated to
// (pending friend requests and add friends)
// https://reactnavigation.org/docs/modal/
const FriendStack = () => {
  // the "name" property of each screen is what should be referred to when routing with navigators
  return (
    <Stack.Navigator 
      initialRouteName="FriendsHome"
      screenOptions={{
        headerShown: false
      }}>
        <Stack.Group>
            <Stack.Screen   
            options={{
                title: "Friends",
            }}
            name='FriendsHome' 
            component={FriendsScreen} 
            />

        </Stack.Group>
        <Stack.Group screenOptions={{presentation: 'modal'}}>
            <Stack.Screen 
            options={{
                title: "Add Friends",
            }}
            name='AddFriends' 
            component={AddFriendsScreen}
            />
            <Stack.Screen 
            options={{
              title: "Friend Requests",
            }}
            name='PendingFriends' 
            component={PendingFriendsScreen}
        /> 
        </Stack.Group>
    </Stack.Navigator>
  );
}

export default FriendStack

const styles = StyleSheet.create({})