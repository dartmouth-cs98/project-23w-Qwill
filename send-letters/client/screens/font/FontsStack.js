import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FontsScreen from './FontsScreen';
import CameraScreen from './CameraScreen';
const Stack = createNativeStackNavigator();

// This stack will have a main screen (fonts) and one modal screen which can be navigated to
// https://reactnavigation.org/docs/modal/
const FontsStack = () => {
  // the "name" property of each screen is what should be referred to when routing with navigators
  return (
    <Stack.Navigator 
      initialRouteName="FontsScreen"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F0F4FF' }
      }}>
        <Stack.Group>
            <Stack.Screen   
            options={{
                title: "FontsScreen",
            }}
            name='FontsScreen' 
            component={FontsScreen} 
            />

        </Stack.Group>
        <Stack.Group screenOptions={{presentation: 'modal'}}>
            <Stack.Screen 
            options={{
                title: "CameraScreen",
            }}
            name='CameraScreen' 
            component={CameraScreen}
            />
        </Stack.Group>
    </Stack.Navigator>
  );
}

export default FontsStack