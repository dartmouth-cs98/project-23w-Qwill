import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer,  getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import { AuthProvider } from './context/auth';
import NavBar from './components/NavBar';
import Navigation from './components/Navigation';


export default function App() {

  let [fontsLoaded] = useFonts({
    'NothingYouCouldDo': require('client/assets/fonts/NothingYouCouldDo-Regular.ttf'),
    'Zeyada': require('./assets/fonts/Zeyada-Regular.ttf'),
  })

  return (
    <NavigationContainer>
      <AuthProvider>
          <Navigation />
      </AuthProvider>
    </NavigationContainer>
  );
}


