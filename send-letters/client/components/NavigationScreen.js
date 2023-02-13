import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer,  getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { AuthContext, AuthProvider } from '../context/auth';
import NavBar from './NavBar';

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

const NavigationScreen = () => {

    const [state, setState] = useContext(AuthContext);
    const authentificated = state && state.token !== "" && state.user !== null;

    return (
      <Stack.Navigator initialRouteName="NavBar" screenOptions={globalScreenOptions}>
        {authentificated ? 
          (
            <>
              <Stack.Screen 
                options={({ route }) => ({
                  headerTitle: getHeaderTitle(route),
                })}        
                name='NavBar' 
                component={NavBar} 
              />
            </>
          ) : (
            <>
              <Stack.Screen 
                  options={{
                  title: "SignIn",
                  }}
                  name='SignIn' 
                  component={SignInScreen}
                /> 
                <Stack.Screen 
                  options={{
                    title: "SignUp"
                  }}
                  name="SignUp"
                  component={SignUpScreen}
                />
            </>
          )
        }
      </Stack.Navigator>
    );
};

export default NavigationScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      // alignItems: 'center',
      justifyContent: 'center',
    },
  });
  