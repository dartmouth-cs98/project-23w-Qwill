import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import LetterDetail from '../../components/LetterDetail';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import ButtonPrimary from '../../components/ButtonPrimary';

const LetterDetailScreen = ({route, navigation}) => {
  // use senderID to know who to reply to
  const {letterText, letterID, letterStatus, senderID, senderUsername, themeID, fontID} = route.params;
  
  // For snackbar:
  // https://callstack.github.io/react-native-paper/snackbar.html
  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);

  const handleBackPressed = () => {
    navigation.goBack();
  };

  // If we press reply on this page, we'll be taken to the compose letter screen with the recipient ID
  // as param. This way, the user doesn't have to fill in the recipient when they hit reply. 
  const handleReplyPressed = () => {
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

      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
        return;
      } else {
        navigation.goBack();
      }
    } catch (err) {
      console.error(err);
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