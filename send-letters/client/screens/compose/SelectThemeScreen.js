import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import React from 'react';
import ButtonPrimary from '../../components/ButtonPrimary';
import { SafeAreaView } from 'react-native-safe-area-context';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import {ComposeContext} from '../../context/ComposeStackContext';

const SelectThemeScreen = ({navigation, route}) => {

  const [letterInfo, setLetterInfo] = useContext(ComposeContext);
  const [themeID, setThemeID] = useState(letterInfo.themeID);

  useEffect(() => {
    if (route.params) {
      const {recipientID, recipientUsername} = route.params;
      console.log("recipientID", recipientID);
      setLetterInfo({...letterInfo, recipientID: recipientID, recipientUsername: recipientUsername});
    }
  }, [route.params]);

  const handleNextPressed = () => {
    // We'll change the letter info context for the whole compose stack only when we push next.
    setLetterInfo({...letterInfo, themeID: themeID});
    navigation.push('SelectFont');
  };

  const selectThemeGoBack = () => {
    navigation.replace('NavBar', {
        screen: 'Compose', 
        params: {
            screen: 'SelectRecipient'
        }
    });
  };

  return (
    <SafeAreaView style={{marginTop: 20}}>
      <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15}}>
        <TouchableOpacity onPress={()=>composeStackGoBack(navigation, selectThemeGoBack)}>
          <Ionicons name={"arrow-back"} size={40}/>
        </TouchableOpacity>
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