import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LetterDetail from '../../components/LetterDetail';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import ButtonPrimary from '../../components/ButtonPrimary';
import { Snackbar } from 'react-native-paper';
import { Button } from 'react-native-elements';

const LetterDetailScreen = ({route, navigation}) => {
  // use senderID to know who to reply to
  const {letterText, letterID, letterIsRead, senderID, senderUsername, themeID, fontID} = route.params;
  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);

  const onDismissSnack = () => setSnackIsVisible(false);

  const handleBackPressed = async () => {
    try {
      const resp = await axios.post(findIP()+"/api/updateLetterStatus", {letterID, newStatus: "read"});

      // alert if any errors detected on backend
      if (resp.data.error) {
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
        return;
      } else {
        navigation.goBack(); 
      }
    } catch (err) {
      console.log(err);
    }
  };

  // If we press reply on this page, we'll be taken to the compose letter screen with the recipient ID
  // as param. This way, the user doesn't have to fill in the recipient when they hit reply. 
  const handleReplyPressed = () => {
    console.log("reply pressed, sender id", senderID);
    navigation.replace('NavBar', {
      screen: 'Compose',
      params: {
        screen: 'SelectTheme',
        params: {
          recipientID: senderID,
          recipientUsername: senderUsername
        }
      }
    });
  }

  const handleArchivePressed = async () => {
    try {
      const resp = await axios.post(findIP()+"/api/updateLetterStatus", {letterID, newStatus: "archive"});

      // alert if any errors detected on backend
      if (resp.data.error) {
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
        return;
      } else {
        navigation.goBack();
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View style={{flex: 1}}>
      <View style={{ flex: 1, flexDirection :'row', alignItems: 'flex-start'}}>
        <TouchableOpacity onPress={handleBackPressed}>
          <Ionicons name={"arrow-back"} size={40}/>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center'}}>
        <LetterDetail text={letterText} themeID={themeID} fontID={fontID}/>
      </View>
      <View style={{flex: 3, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
          <ButtonPrimary 
            selected={true} 
            title={"Archive"}
            onPress={handleArchivePressed}/>
          <ButtonPrimary 
            selected={true} 
            title={"Reply"}
            onPress={handleReplyPressed}/>
      </View>
    </View>
  )
};

export default LetterDetailScreen;

const styles = StyleSheet.create({});