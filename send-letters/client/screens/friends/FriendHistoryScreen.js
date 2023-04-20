import React, { useState, useContext, useEffect } from 'react'
import { Text, View, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
    updateLetterHistory();
  }, [isFocused]);

  const updateLetterHistory = async () => {
    try {
      const resp = await axios.post(findIP()+"/api/fetchLetterHistory", { userID: userInfo.user._id, friendID: item._id });

      if (!resp) {
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else if (!resp.data || !resp.data.letterHistory) {
        console.error("Error: the response does not contain the expected fields");
      } else {
        setLetterHistory(resp.data.letterHistory);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderItem = (item) => {
    
    const alignDirection = (item.sender == userInfo.user._id) ? "right" : "left";

    return (
      <Text 
        style={{fontFamily: item.font, textAlign: alignDirection, width: 150}}
      >
        {item.text + "\n\n\n\n"}
      </Text>
    );
  }

  return (
    <SafeAreaView style={{ flexDirection: 'column', flex: 1, alignItems: 'center', marginTop: 20 }}>
      <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15 }}>
        <Text>Friend History</Text>
        <TouchableOpacity onPress={() => { navigation.goBack() }}>
          <Ionicons name="arrow-back" size={40} ></Ionicons>
        </TouchableOpacity>
      </View>
      <FlatList
        data={letterHistory}
        renderItem={({item}) => renderItem(item)}
        keyExtractor={item => item._id}
      />
    </SafeAreaView>
  )
};
