import { StyleSheet, View, Image, Text } from 'react-native';
import HomeScreen from '../screens/home/HomeScreen';
import DraftsScreen from '../screens/home/DraftsScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const Tab = createMaterialTopTabNavigator();

const HomeTopTabs = () => {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#bdccf2',
        flexDirection: 'column',
        paddingTop: hp('5%'), 
      }}>
      <Image 
            style={{
              height: undefined, 
              width: '60%',
              aspectRatio: 4,
              alignSelf: 'center',
              resizeMode: "contain",
            }}
            source={require('../assets/logo.png')}
          />
      <Tab.Navigator
      initialRouteName={'Mailbox'}
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: hp('2.65%'),
          textTransform: 'none',
          fontWeight: 'bold',
          fontFamily: 'JosefinSansBold'
        },
        tabBarStyle: styles.shadowLight,
        tabBarActiveTintColor: '#46589C', // set the color of the active tab
        tabBarInactiveTintColor: '#7184B4', // set the color of the inactive tabs
        tabBarIndicatorStyle: { backgroundColor: '#46589C' },
      }}>
        <Tab.Screen name='Mailbox' component={HomeScreen} />
        <Tab.Screen name='Drafts' component={DraftsScreen} />
      </Tab.Navigator>
      </View>
    )
  };

export default HomeTopTabs;

const styles = StyleSheet.create({
  shadowLight: {
    shadowColor: '#171717',
    shadowOffset: {height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    backgroundColor: '#bdccf2'
  },
})