import { Text, View, StyleSheet } from 'react-native';
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react'
import { Button, Input, Image } from 'react-native-elements';
import ButtonPrimary from '../../components/ButtonPrimary';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { Ionicons } from '@expo/vector-icons';
import { ComposeContext } from '../../context/ComposeStackContext';

function ComposeScreen({ navigation, route }) {
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);
  const [text, setText] = useState(letterInfo.text);

  const composeHomeGoBack = () => {
    navigation.navigate('Home');
  };

  const handleNextPressed = () => {
    navigation.push('Preview');
  };

  return ( //todo amanda add fonts
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Make a Letter!</Text>
      <Input
        style={{fontFamily: letterInfo.fontID}} 
        defaultValue={text}
        onChangeText={text => setLetterInfo({...letterInfo, text: text})}
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
