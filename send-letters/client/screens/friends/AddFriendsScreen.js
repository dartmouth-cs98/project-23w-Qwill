import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from 'send-letters/client/screens/compose/Profile.component.style.js'

const AddFriendsScreen = ({navigation}) => {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Ionicons name={"arrow-back"} size={40}/>
      </TouchableOpacity>
      <Text>AddFriendsScreen</Text>
    </View>
  )
};

export default AddFriendsScreen;