import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SelectRecipientScreen from '../screens/compose/SelectRecipientScreen';
import ComposeScreen from '../screens/compose/ComposeScreen';
import PreviewScreen from '../screens/compose/PreviewScreen';
import Ionicons from '@expo/vector-icons/Ionicons';

const Stack = createNativeStackNavigator();

const ComposeStack = ({navigation}) => {
    return (
      <Stack.Navigator 
        initialRouteName="SelectRecipient"
        screenOptions={{
            headerBackTitleVisible: false,
            headerTransparent: true,
            headerTitle: "",
            headerLeft:  () => (
              <Ionicons name={"arrow-back"} size={30} onPress={()=>navigation.goBack()}/>
            )
        }}>
        <Stack.Screen 
          name="SelectRecipient" 
          component={SelectRecipientScreen}
          options= {{
            tabBarButton: (props) => (
              <CustomComposeButton {...props} />
            )
          }}/>
        <Stack.Screen 
          name="ComposeHome" 
          component={ComposeScreen}
          options= {{
            headerShown: false
          }} />
        <Stack.Screen 
          name="Preview" 
          component={PreviewScreen}
          options= {{
            headerShown: false
          }} />
      </Stack.Navigator>
    );
  };

  export default ComposeStack;