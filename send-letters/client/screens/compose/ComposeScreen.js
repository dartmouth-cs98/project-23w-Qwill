import { Text, View, StyleSheet } from 'react-native';
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react'
import { Button, Input, Image } from 'react-native-elements';
import ButtonPrimary from '../../components/ButtonPrimary';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { Ionicons } from '@expo/vector-icons';

function ComposeScreen({ route, navigation }) {
  const { recipientID, recipientUsername, themeID, fontID } = route.params;
  const [text, setText] = useState("");

  const composeHomeGoBack = () => {
    navigation.navigate('Home');
  };

  const handleNextPressed = () => {
    navigation.push('Preview', {
      recipientID: recipientID,
      recipientUsername: recipientUsername,
      themeID: themeID,
      fontID: fontID,
      text: text,
    });
  };

  return ( //todo amanda add fonts
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Make a Letter!</Text>
      <Input 
        placeholder="enter letter text"
        onChangeText={text => setText(text)}
      />
      <View style={{flexDirection: 'row'}}>
        <ButtonPrimary title={"Go back."} selected={true} onPress={() => composeStackGoBack(navigation, composeHomeGoBack)}/>
        <ButtonPrimary title={"Next!"} selected={true} onPress={() => handleNextPressed()}/>
      </View>
    </View>
  );
};

export default ComposeScreen;

const styles = StyleSheet.create({
  inputContainer: {
      width: 300,
  },
  button: {
      width: 200, 
      marginTop: 10,
  },
  container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      backgroundColor: 'white',
  },
});
