import { Text, View, StyleSheet } from 'react-native';
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react'
import { Button, Input, Image } from 'react-native-elements';
import PreviewScreen from './PreviewScreen';

function ComposeScreen({ route, navigation }) {

  const { recipientID } = route.params;
  const [text, setText] = useState("");

  const handleNextPressed = () => {
    navigation.push('Preview', {
      recipientID: recipientID,
      text: text,
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Make a Letter!</Text>
      <Input 
        placeholder="enter letter text"
        onChangeText={text => setText(text)}
      />
      <Button containerStyle={styles.button} onPress={() => handleNextPressed()} title="Next"/>
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
