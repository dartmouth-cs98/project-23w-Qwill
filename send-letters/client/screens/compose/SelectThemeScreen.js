import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import React from 'react';
import ButtonPrimary from '../../components/ButtonPrimary';
import { SafeAreaView } from 'react-native-safe-area-context';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

const SelectThemeScreen = ({navigation, route}) => {
  const { recipientID } = route.params;

  // Default theme set to string none
  const [themeID, setThemeID] = useState("none");

  const handleNextPressed = () => {
    navigation.push('SelectFont', {
        recipientID: recipientID,
        themeID: themeID
    });
  };

  const selectThemeGoBack = () => {
    navigation.replace('NavBar', {
        screen: 'Compose', 
        params: {
            screen: 'SelectRecipient',
            params: {
                recipientID: recipientID
            }
        }
    });
  };

  return (
    <SafeAreaView style={{marginTop: 20}}>
      <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15}}>
        <Ionicons name={"arrow-back"} size={40} onPress={()=>composeStackGoBack(navigation, selectThemeGoBack)}/>
      </View>
      <Text>SelectThemeScreen</Text>
      <ButtonPrimary 
        title={"Next"}
        selected={true} 
        onPress={handleNextPressed}/>
    </SafeAreaView>
  )
};

export default SelectThemeScreen;

const styles = StyleSheet.create({});