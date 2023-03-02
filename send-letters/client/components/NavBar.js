import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Feather} from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeStack from '../components/HomeStack';
import FontsScreen from '../screens/font/FontsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FriendStack from './FriendStack';
import ComposeStack from './ComposeStack';

// Citation: 
// https://reactnavigation.org/docs/tab-based-navigation
// Custom bottom nav button: https://www.youtube.com/watch?v=gPaBicMaib4

// Our navigator 
const Tab = createBottomTabNavigator();

const CustomComposeButton = ({children, onPress}) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}>
    <View>
        <View
          style={{
            width: 70, 
            height: 70,
            borderRadius: 35,
            backgroundColor: "#ACC3FF",
            shadowColor: 'rgba(0,0,0, .4)',
            shadowOffset: { height: 1, width: 1 },
            shadowOpacity: 1,
            shadowRadius: 2,
          }}>
          {children}
        </View>
      </View>
  </TouchableOpacity>
);


function NavBar() {
    return (
        <Tab.Navigator
          backBehavior={'history'}
          screenOptions={({ route }) => ({
            headerShown: false, 
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: "#E2E8F6"
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'mail': 'mail-outline';
              } else if (route.name === 'Friends') {
                iconName = focused ? 'people' : 'people-outline';
              } else if (route.name === 'Compose') {
                // For this letter create button, we'll use a special icon
                // https://icons.expo.fyi/Feather/pen-tool
                return <Feather name="pen-tool" size={size * 1.4} color="#373F41"/>;
              } else if (route.name === 'Fonts') {
                // iconName = focused ? 'pencil' : 'pencil-outline';
                if (focused) {
                  return (
                    <View style={[styles.fontIcon, styles.fontIconSelected]}>
                      <Text style={styles.fontIconTextSelected}>Aa</Text>
                    </View>
                  )}
                else {
                  return (
                    <View style={[styles.fontIcon, styles.fontIconUnselected]}>
                      <Text style={styles.fontIconTextUnselected}>Aa</Text>
                    </View>
                  )}
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person-circle' : 'person-circle-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'gray'
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Friends" component={FriendStack} />
          <Tab.Screen 
            name="Compose" 
            component={ComposeStack}
            options= {{
              tabBarButton: (props) => (
                <CustomComposeButton {...props} />
              ),
              tabBarStyle:{display:'none'} 
            }}/>
          <Tab.Screen name="Fonts" component={FontsScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  fontIcon: {
    height: 24, 
    width: 24,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center'
  },
  fontIconSelected: {
    borderColor: 'black',
    backgroundColor: 'black'
  },
  fontIconUnselected: {
    borderColor: 'grey'
  },
  fontIconTextSelected: {
    fontWeight: "700",
    color: "#E2E8F6",
    marginTop: 1
  },
  fontIconTextUnselected: {
    fontWeight: "400",
    color: 'grey',
    marginTop: 1
  }
});

export default NavBar;