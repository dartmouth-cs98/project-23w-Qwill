import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import LetterDetail from '../../components/LetterDetail';
import { Ionicons } from '@expo/vector-icons';

import ButtonPrimary from '../../components/ButtonPrimary';
import { Button } from 'react-native-elements';

const LetterDetailScreen = ({route, navigation}) => {
  // use senderID to know who to reply to
  const {letterText, letterId, letterIsRead, senderId} = route.params;

  const handleBackPressed = () => {
    // TODO: Mark letter read

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
          recipientID: senderId
        }
      }
    });
  }

  // TODO
  // Mark letter as archived so it no longer shows up in mailbox
  const handleArchivePressed = () => {

  }

  return (
    <View style={{flex: 1}}>
      <View style={{ flex: 1, flexDirection :'row', alignItems: 'flex-start'}}>
        <Ionicons name={"arrow-back"} size={40} onPress={handleBackPressed}/>
      </View>
      <View style={{ alignItems: 'center'}}>
        <LetterDetail text={letterText}/>
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