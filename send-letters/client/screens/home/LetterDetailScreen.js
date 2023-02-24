import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import LetterDetail from '../../components/LetterDetail';
import { Ionicons } from '@expo/vector-icons';

import ButtonPrimary from '../../components/ButtonPrimary';
import { Button } from 'react-native-elements';

const LetterDetailScreen = ({route, navigation}) => {
  const {letterText, letterId, letterIsRead} = route.params;

  const handleBackPressed = () => {
    // Mark letter read

    navigation.goBack();
  };

  const handleReplyPressed = () => {
    
  }

  return (
    <View style={{flex: 1}}>
      <View style={{ flex: 1, flexDirection :'row', alignItems: 'flex-start'}}>
        <Ionicons name={"arrow-back"} size={40} onPress={handleBackPressed}/>
      </View>
      <View style={{ alignItems: 'center'}}>
        <LetterDetail text={letterText}/>
      </View>
      <View style={{flex: 3, flexDirection: 'row', alignItems: 'center'}}>
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