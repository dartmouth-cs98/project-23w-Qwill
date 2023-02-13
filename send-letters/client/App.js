import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer,  getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import { AuthProvider } from './context/auth';
import NavBar from './components/NavBar';
import Navigation from './components/Navigation';
import NavigationScreen from './components/NavigationScreen';


export default function App() {
  return (
    <Navigation />
  );
}


