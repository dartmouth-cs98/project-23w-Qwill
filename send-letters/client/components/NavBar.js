import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeStack from '../components/HomeStack';
import ComposeScreen from '../screens/ComposeScreen';
import FontsScreen from '../screens/FontsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FriendStack from './FriendStack';

// Citation: https://reactnavigation.org/docs/tab-based-navigation

// Our navigator 
const Tab = createBottomTabNavigator();

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
                  iconName = focused ? 'create-sharp' : 'create-outline';
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
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Friends" component={FriendStack} options={{animation: 'none'}}/>
            <Tab.Screen name="Compose" component={ComposeScreen} />
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