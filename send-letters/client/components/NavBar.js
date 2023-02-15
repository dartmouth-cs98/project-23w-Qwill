import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons'; 
import Ionicons from '@expo/vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import FriendsScreen from '../screens/FriendsScreen';
import SelectRecipientScreen from '../screens/compose/SelectRecipientScreen';
import FontsScreen from '../screens/FontsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ComposeScreen from '../screens/compose/ComposeScreen';
import PreviewScreen from '../screens/compose/PreviewScreen';

// Citation: 
// https://reactnavigation.org/docs/tab-based-navigation
// Custom bottom nav button: https://www.youtube.com/watch?v=gPaBicMaib4

const Tab = createBottomTabNavigator();
const ComposeStack = createNativeStackNavigator();

const CustomComposeButton = ({children, onPress}) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center'
    }}
    onPress={onPress}>
    <View
      style={{
        width: 70, 
        height: 70,
        borderRadius: 35,
        backgroundColor: "#383a9c"
      }}>
      {children}
    </View>
  </TouchableOpacity>
);

function ComposeStack() {
  return (
    <ComposeStack.Navigator initialRouteName="SelectRecipient">
      <ComposeStack.Screen 
        name="SelectRecipient" 
        component={SelectRecipientScreen}
        options= {{
          tabBarButton: (props) => (
            <CustomComposeButton {...props} />
          )
        }}/>
      <ComposeStack.Screen name="Compose" component={ComposeScreen} />
      <ComposeStack.Screen name="Preview" component={PreviewScreen} />
    </ComposeStack.Navigator>
  );
};

function NavBar() {
    return (
      <View style={styles.container}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false, 
              tabBarShowLabel: false,
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'home': 'home-outline';
                } else if (route.name === 'Friends') {
                  iconName = focused ? 'people' : 'people-outline';
                } else if (route.name === 'Compose') {
                  // For this letter create button, we'll use a special icon
                  // https://icons.expo.fyi/Feather/pen-tool
                  return <Feather name="pen-tool" size={size} color = "white"/>;
                } else if (route.name === 'Fonts') {
                  iconName = focused ? 'pencil' : 'pencil-outline';
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'person-circle' : 'person-circle-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'black',
              tabBarInactiveTintColor: 'gray',   
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Friends" component={FriendsScreen} />
            <Tab.Screen 
              name="Compose" 
              component={ComposeStack}
              options= {{
                tabBarButton: (props) => (
                  <CustomComposeButton {...props} />
                )
              }}/>
            <Tab.Screen name="Fonts" component={FontsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
    },
  });

export default NavBar