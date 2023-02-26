import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import ButtonPrimary from '../../components/ButtonPrimary';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';

const SelectFontScreen = ({navigation, route}) => {
  const {recipientID, themeID} = route.params;
  // Default font ID set to 0
  const [fontID, setFontID] = useState(0);

  const handleNextPressed = () => {
        navigation.push('ComposeHome', {
            recipientID: recipientID,
            themeID: themeID, 
            fontID: fontID
        });
  };

  const selectFontGoBack = () => {
    navigation.navigate('SelectRecipient');
  }

  return (
    <SafeAreaView style={{marginTop: 20}}>
      <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15}}>
        <Ionicons name={"arrow-back"} size={40} onPress={()=>composeStackGoBack(navigation, selectFontGoBack)}/>
      </View>
      <Text>SelectFontScreen</Text>
      <ButtonPrimary 
        title={"Next"} 
        selected={true}
        onPress={handleNextPressed}/>
    </SafeAreaView>
  );
};

export default SelectFontScreen;

const styles = StyleSheet.create({});