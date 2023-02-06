import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer,  getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import NavBar from './components/NavBar';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createNativeStackNavigator();

// Header tint color turns icons put inside the header white
const globalScreenOptions = {
  headerStyle: { backgroundColor: "#b84a32"},
  headerTitleStyle: {color: "white"},
  headerTintColor: "white",
};

// Code from https://reactnavigation.org/docs/screen-options-resolution/#setting-parent-screen-options-based-on-child-navigators-state
// This is necessary because you cannot set the parent navigator (navigation stack) title from the 
// child nav (nav bar screens) screen options.
function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Home" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

  switch (routeName) {
    case 'Home':
      return 'Mailbox';
    case 'Profile':
      return 'My profile';
    case 'Friends':
      return 'Friends';
    case 'Compose':
      return 'Compose a letter';
    case 'Fonts':
      return 'Fonts';
  }
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName='Login'
        screenOptions={globalScreenOptions}>
        <Stack.Screen 
          options={{
            title: "Log in",
          }}
          name='Login' 
          component={LoginScreen}/> 
          <Stack.Screen options={{
            title: "Sign up"
          }}
          name="Register"
          component={RegisterScreen}/>
        <Stack.Screen 
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
          })}        
          name='NavBar' 
          component={NavBar} 
        />
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
