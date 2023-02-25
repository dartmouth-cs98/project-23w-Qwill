import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SelectRecipientScreen from '../screens/compose/SelectRecipientScreen';
import ComposeScreen from '../screens/compose/ComposeScreen';
import PreviewScreen from '../screens/compose/PreviewScreen';
import SelectFontScreen from '../screens/compose/SelectFontScreen';
import SelectThemeScreen from '../screens/compose/SelectThemeScreen';
import Ionicons from '@expo/vector-icons/Ionicons';

const Stack = createNativeStackNavigator();

const ComposeStack = ({navigation}) => {
  
  /**
   *  We are going to have scenarios in which the user needs to go back within this stack. Within the normal 
   * flow (user presses the middle compose button in the nav bar and is lead to select recipient), screens will be
   * pushed in sequence, so navigation.goBack() will work as normal. However, there are two scenarios in which 
   * users will be taken to the ComposeHome screen without screens from the compose stack pushed underneath, which will cause 
   * goBack to fail:
   * 1. The user hits reply from a letter detail view inside Home stack. In this case, they will be taken to select a theme with
   *    a recipient as param, but the goBack function will fail. Recipient will then be passed on thru the stack using context.   
   * 2. The user edits a draft, and is taken to the ComposeHome view. Here, they will need to be able to go back to theme and font 
   *    picking, while preserving the text. 
   * 
   * The goBack for the headerLeft back button will therefore need to be dealt with case by case. We can override the onPress
   * function in each screen of the stack using navigation.setOptions (https://reactnavigation.org/docs/header-buttons/).
   * 
   * See ../helpers/composeStackGoBack.js to see the generalized helper function.
   * */

    return (
      <Stack.Navigator 
        initialRouteName="SelectRecipient"
        screenOptions={{
            headerBackTitleVisible: false,
            headerTransparent: true,
            headerTitle: "",
            animationTypeForReplace: 'pop'
        }}>
        <Stack.Screen 
          name="SelectRecipient" 
          component={SelectRecipientScreen}
          options= {{
            tabBarButton: (props) => (
              <CustomComposeButton {...props} />
            ),
            animationTypeForReplace: 'pop',
          }}
          />
        <Stack.Screen 
          name="ComposeHome" 
          component={ComposeScreen}
          options= {{
            headerShown: false
          }} />
        <Stack.Screen 
          name="Preview" 
          component={PreviewScreen}
          options= {{
            headerShown: false
          }} />
        <Stack.Screen 
          name="SelectFont" 
          component={SelectFontScreen}
          options= {{
            headerShown: false
          }} />
        <Stack.Screen 
          name="SelectTheme" 
          component={SelectThemeScreen}
          options= {{
            headerShown: false,
            animationTypeForReplace: 'pop'
          }} />
      </Stack.Navigator>
    );
  };

  export default ComposeStack;