import React, { useState, useContext, useEffect } from 'react'
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Input } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';

import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import COLORS from '../../styles/colors';


export default function FriendHistoryScreen({ route, navigation }) {
    const { item } = route.params;
    const [userInfo, setUserInfo] = useContext(AuthContext);
    const [letterHistory, setLetterHistory] = useState("");
    const isFocused = useIsFocused();
  
    // fetch any pending friend requests from the server
    useEffect(() => {
      console.log(item);
    }, [isFocused]);



    return (
        <SafeAreaView style={{ flexDirection: 'column', flex: 1, alignItems: 'center', marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15 }}>
            <Text>Friend History</Text>
            <TouchableOpacity onPress={() => { navigation.goBack() }}>
              <Ionicons name="arrow-back" size={40} ></Ionicons>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
    )
};
