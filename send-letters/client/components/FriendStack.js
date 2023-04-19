import { StyleSheet} from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeFriendsScreen from '../screens/friends/HomeFriendsScreen';
import FriendHistoryScreen from '../screens/friends/FriendHistoryScreen';
import AddFriendsScreen from '../screens/friends/AddFriendsScreen';
import PendingFriendsScreen from '../screens/friends/PendingFriendsScreen';

// Contains the mailbox and the drafts page
const Stack = createNativeStackNavigator();

// This stack will have a main screen (friends) and two modal screens which can be navigated to
// (pending friend requests and add friends)
// https://reactnavigation.org/docs/modal/
export default function FriendStack () {
  // the "name" property of each screen is what should be referred to when routing with navigators
  return (
    <Stack.Navigator 
      initialRouteName="FriendsHome"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F0F4FF' }
      }}>
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
            options={{title: "PendingFriendsScreen",}}
            name='PendingFriendsScreen' 
            component={PendingFriendsScreen}
          />
        </Stack.Group>
    </Stack.Navigator>
  );
}