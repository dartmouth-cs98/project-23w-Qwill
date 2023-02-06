import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import NavBar from './components/NavBar';

const Stack = createNativeStackNavigator();

// Header tint color turns icons put inside the header white
const globalScreenOptions = {
  headerStyle: { backgroundColor: "#b84a32"},
  headerTitleStyle: {color: "white"},
  headerTintColor: "white",
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName='Home'
        screenOptions={globalScreenOptions}>
        <Stack.Screen 
          options={{
            title: "Log in",
          }}
          name='Login' 
          component={LoginScreen}/> 
        <Stack.Screen name='NavBar' component={NavBar}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'center',
  },
});
