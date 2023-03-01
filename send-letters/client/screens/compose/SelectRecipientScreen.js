import { Text, View, StyleSheet, FlatList, ScrollView, TouchableOpacity, } from 'react-native';
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react'
import { Button, Input, Image } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/auth';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { hasRestrictedChar } from '../../helpers/stringValidation';


function SelectRecipientScreen({route, navigation}) {
  const [recipientField, setRecipientField] = useState("");
  const [state, setState] = useContext(AuthContext);
  const [matchingUsers, setMatchingUsers] = useState("");

    // This is callback for the composeStackGoBack default helper
    const selectRecipientGoBack = () => {
      navigation.navigate('Home');
    };

  const handleChangeText = async (text) => {    
    const newText = text.toLowerCase();
    const senderID = state.user._id;  

    // no need to connect to server if text contains restricted characters
    if (hasRestrictedChar(text) == true) {
      setMatchingUsers([]);
      return;
    }

    const resp = await axios.post(findIP()+"/api/matchRecipient", { senderID, newText });
    if (resp.error) {
      console.log(error);
    } else if (!resp.data || !resp.data.matchingUsers) {
      console.log("Error: the response does not contain the expected fields");
    } else {
      setMatchingUsers(resp.data.matchingUsers);
    }
  };

  const handleNextPressed = (item) => {
    navigation.push('SelectTheme', {
      recipientID: item._id
    });
  };

  // this function renders the users that match the text in the input component
  function renderMatches() {

    if (matchingUsers.length == 0) {
      return <Text>No users found</Text>
    }
    
    return matchingUsers.map((item, index) => 
      <Button 
        key={index}
        containerStyle={styles.button} 
        onPress={() => handleNextPressed(item)} title={JSON.stringify(item.username)}
      />
    );
  };

  return (
    <SafeAreaView style={{flexDirection: 'column', flex: 1, alignItems: 'center', marginTop: 20 }}>
      <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15}}>
        <TouchableOpacity onPress={()=>composeStackGoBack(navigation, selectRecipientGoBack)}>
          <Ionicons name={"arrow-back"} size={40}/>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', marginLeft: 15, marginTop: 20}}>
        <Text style={styles.titleText}>Compose</Text>
      </View>
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
      </View>
    </SafeAreaView>
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
  titleText: {
    fontSize: 40, 
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: 20
  },
});
