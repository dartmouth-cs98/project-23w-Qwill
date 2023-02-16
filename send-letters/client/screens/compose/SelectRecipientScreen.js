import { Text, View, StyleSheet } from 'react-native';
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react'
import { Button, Input, Image } from 'react-native-elements';


function SelectRecipientScreen({navigation}) {

  const [emailUsername, setEmailUsername] = useState("");

  // TODO: Check if recipient is valid email or username in the DB
  const handleNextPressed = () => {
    navigation.push('Compose', {
      recipientID: emailUsername
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Compose</Text>
      <View style={styles.inputContainer}>
        <Input 
          placeholder="enter recipient's email or username"
          autoCompleteType="email"
          autoCapitalize="none"
          onChangeText={text => setEmailUsername(text.toLowerCase())} 
        />
        <Button containerStyle={styles.button} onPress={() => handleNextPressed()} title="Next"/>
      </View>
    </View>
  );
};

export default SelectRecipientScreen;

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
