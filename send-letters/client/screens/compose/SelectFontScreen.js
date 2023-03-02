import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import ButtonPrimary from '../../components/ButtonPrimary';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { ComposeContext } from '../../context/ComposeStackContext';

const SelectFontScreen = ({navigation}) => {

  const [letterInfo, setLetterInfo] = useContext(ComposeContext);

   // Default font ID set to 0
   const [fontID, setFontID] = useState(letterInfo.fontID);

  const handleNextPressed = () => {
      setLetterInfo({...letterInfo, fontID: fontID});
      navigation.push('ComposeHome');
  };

  const selectFontGoBack = () => {
    navigation.navigate('SelectTheme');
  }

  return (
    <SafeAreaView style={{marginTop: 20}}>
      <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15}}>
        <TouchableOpacity onPress={()=>composeStackGoBack(navigation, selectFontGoBack)}>
          <Ionicons name={"arrow-back"} size={40}/>
        </TouchableOpacity>
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