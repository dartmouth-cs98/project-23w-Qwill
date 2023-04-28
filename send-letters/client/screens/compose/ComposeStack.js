import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SelectRecipientScreen from './SelectRecipientScreen';
import ComposeScreen from './ComposeScreen';
import PreviewScreen from './PreviewScreen';
import SelectFontScreen from './SelectFontScreen';
import SelectThemeScreen from './SelectThemeScreen';
import { ComposeContextProvider } from '../../context/ComposeStackContext';
import ChangeRecipientScreen from './ChangeRecipientScreen';
import ChangeFontScreen from './ChangeFontScreen';
import ChangeStickerScreen from './ChangeStickerScreen';
import ChangeThemeScreen from './ChangeThemeScreen';

const Stack = createNativeStackNavigator();

const ComposeStack = ({ navigation }) => {

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
    <ComposeContextProvider>
      <Stack.Navigator
        initialRouteName="SelectRecipient"
        screenOptions={{
          headerBackTitleVisible: false,
          headerTransparent: true,
          headerTitle: "",
          animationTypeForReplace: "pop",
          contentStyle: { backgroundColor: '#F0F4FF' },
          headerShown: false
        }}>
        <Stack.Screen name="SelectRecipient" component={SelectRecipientScreen}
          options={{
            tabBarButton: (props) => (
              <CustomComposeButton {...props} />
            ),
            animationTypeForReplace: 'pop'
          }}
        />
        <Stack.Screen name="ComposeHome" component={ComposeScreen} />
        <Stack.Screen name="Preview" component={PreviewScreen} />
        <Stack.Screen name="SelectFont" component={SelectFontScreen} />
        <Stack.Screen name="SelectTheme" component={SelectThemeScreen} />

        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name='ChangeRecipientScreen' component={ChangeRecipientScreen} /> 
          <Stack.Screen name='ChangeFontScreen' component={ChangeFontScreen} />
          <Stack.Screen name='ChangeThemeScreen' component={ChangeThemeScreen} />
          <Stack.Screen name='ChangeStickerScreen' component={ChangeStickerScreen} /> 
        </Stack.Group>

      </Stack.Navigator>
    </ComposeContextProvider>
  );
};

export default ComposeStack;