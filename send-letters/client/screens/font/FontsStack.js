import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FontsScreen from './FontsScreen';
import CameraScreen from './CameraScreen';
import ImagePickerScreen from './ImagePickerScreen';
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
            <Stack.Screen 
            options={{
                title: "ImagePickerScreen",
            }}
            name='ImagePickerScreen' 
            component={ImagePickerScreen}
            />
        </Stack.Group>
    </Stack.Navigator>
  );
}

export default FontsStack