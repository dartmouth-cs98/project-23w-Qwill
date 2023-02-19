import { Text, View, StyleSheet, FlatList, ScrollView, } from 'react-native';
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react'
import { Button, Input, Image } from 'react-native-elements';
import { AuthContext, AuthProvider } from '../../context/auth';
import axios from 'axios';
import findIP from '../../helpers/findIP';


function SelectRecipientScreen({navigation}) {

  const [recipientField, setRecipientField] = useState("");
  const [state, setState] = useContext(AuthContext);
  const [matchingUsers, setMatchingUsers] = useState("");

  const handleChangeText = async (text) => {    
    const newText = text.toLowerCase();
    const senderID = state.user._id;  

    const resp = await axios.post(findIP()+"/api/matchRecipient", { senderID, newText });
    if (resp.error) {
      console.log(error);
    } else if (!resp.data.matchingUsers) {
      console.log("An error occured");
    } else {
      setMatchingUsers(resp.data.matchingUsers);
    }
  };

  // TODO: Check if recipient is valid email or username in the DB
  const handleNextPressed = (item) => {
    navigation.push('ComposeHome', {
      recipientID: item._id
    });
  };

  // this function renders the users that match the text in the input component
  function renderMatches() {
    // console.log(matchingUsers);
    if (matchingUsers.length == 0) {
      return <Text>No users found</Text>
    }
    return matchingUsers.map((item, index) => 
      <Button 
        key={index}
        containerStyle={styles.button} 
        onPress={() => handleNextPressed(item)} title={JSON.stringify(item.username)}
      />);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Compose</Text>
      <View style={styles.inputContainer}>
        <Input 
          placeholder="enter recipient's name or username"
          autoCompleteType="email"
          autoCapitalize="none"
          onChangeText={handleChangeText}
        />
          <ScrollView style={styles.scrollView}>
            {renderMatches()}
          </ScrollView>
        {/* <Button containerStyle={styles.button} onPress={() => handleNextPressed()} title="Next"/> */}
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
  scrollView: {
    height: 200,
  },
});
