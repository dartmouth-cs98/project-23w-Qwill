import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SelectRecipientScreen from '../screens/compose/SelectRecipientScreen';
import ComposeScreen from '../screens/compose/ComposeScreen';
import PreviewScreen from '../screens/compose/PreviewScreen';

const Stack = createNativeStackNavigator();

const ComposeStack = () => {
    return (
      <Stack.Navigator initialRouteName="SelectRecipient">
        <Stack.Screen 
          name="SelectRecipient" 
          component={SelectRecipientScreen}
          options= {{
            tabBarButton: (props) => (
              <CustomComposeButton {...props} />
            )
          }}/>
        <Stack.Screen name="ComposeHome" component={ComposeScreen} />
        <Stack.Screen name="Preview" component={PreviewScreen} />
      </Stack.Navigator>
    );
  };

  export default ComposeStack;