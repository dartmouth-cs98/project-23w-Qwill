import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FontsScreen from '../screens/font/FontsScreen';
import CameraScreen from '../screens/font/CameraScreen';
import InstructionsScreen from '../screens/font/InstructionsScreen';
import ImagePickerScreen from '../screens/font/ImagePickerScreen';
const Stack = createNativeStackNavigator();

/* 
This Fonts Stack will have a main screen (fonts) and one modal camera screen which can be navigated to.
Citation: 
https://reactnavigation.org/docs/modal/
https://docs.expo.dev/versions/latest/sdk/camera/
*/

const FontsStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="FontsScreen"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F0F4FF' }
      }}
    >
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
        <Stack.Screen name='InstructionsScreen' component={InstructionsScreen}/>
        <Stack.Screen name='CameraScreen' component={CameraScreen}/>
        <Stack.Screen name='ImagePickerScreen' component={ImagePickerScreen}/>
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default FontsStack