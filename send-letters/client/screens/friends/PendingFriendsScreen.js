import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

const PendingFriendsScreen = ({navigation}) => {
  return (
    <View>
      <Ionicons name={"arrow-back"} onPress={()=>navigation.goBack()}/>
      <Text>PendingFriendsScreen</Text>
    </View>
  )
};

export default PendingFriendsScreen;

const styles = StyleSheet.create({});