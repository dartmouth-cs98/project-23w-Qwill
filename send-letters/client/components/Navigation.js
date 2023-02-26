import React, {useContext} from 'react';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import {AuthContext} from '../context/auth';
import NavBar from './NavBar';

const Stack = createNativeStackNavigator();

// Header tint color turns icons put inside the header white
const globalScreenOptions = {
  headerStyle: {backgroundColor: "#b84a32"},
  headerTitleStyle: {color: "white"},
  headerTintColor: "white"
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
      return 'Qwill';
    case 'Profile':
      return 'My profile';
    case 'Friends':
      return 'Qwill';
    case 'Compose':
      return 'Compose a letter';
    case 'Fonts':
      return 'Fonts';
  }
}


// This screen determines which pages to load based on the user's authentification status
const Navigation = () => {

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
                  headerShown: false,
                  contentStyle: { backgroundColor: '#F0F4FF' }
                })}        
                name='NavBar'
                component={NavBar}
              />
            </>
          ) : (
            <>
              <Stack.Screen 
                  options={{
                  headerShown: false
                  }}
                  name='SignIn'
                  component={SignInScreen}
                /> 
                <Stack.Screen 
                  options={{
                    headerShown: false
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

export default Navigation;
