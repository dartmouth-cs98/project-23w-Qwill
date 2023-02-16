import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

const AddFriendsScreen = ({navigation}) => {
  return (
    <View>
      <Ionicons name={"arrow-back"} onPress={()=>navigation.goBack()}/>
      <Text>AddFriendsScreen</Text>
    </View>
  )
};

export default AddFriendsScreen;

const styles = StyleSheet.create({});