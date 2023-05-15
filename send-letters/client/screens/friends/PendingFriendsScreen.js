import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

const PendingFriendsScreen = ({navigation}) => {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Ionicons name={"arrow-back"} size={40}/>
      </TouchableOpacity>
      <Text>PendingFriendsScreen</Text>
    </View>
  )
};

export default PendingFriendsScreen;