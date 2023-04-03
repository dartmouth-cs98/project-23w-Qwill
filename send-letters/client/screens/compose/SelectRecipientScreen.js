import { Text, View, StyleSheet, FlatList, ScrollView, TouchableOpacity, } from 'react-native';
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react'
import { Button, Input, Image } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/auth';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { ComposeContext } from '../../context/ComposeStackContext';
import { hasRestrictedChar } from '../../helpers/stringValidation';


function SelectRecipientScreen({navigation}) {
  const [recipientField, setRecipientField] = useState("");
  const [state, setState] = useContext(AuthContext);
  const [matchingUsers, setMatchingUsers] = useState("");
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);

    // This is callback for the composeStackGoBack default helper
  const handleGoBack = () => {
      setLetterInfo({
        text: "",
        recipientID: 0,
        recipientUsername: "",
        themeID: "",
        fontID: "" });
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Home');
      }
  };

  const handleChangeText = async (text) => {    
    const newText = text.toLowerCase();
    const senderID = state.user._id;  

    // no need to connect to server if text contains restricted characters
    if (hasRestrictedChar(text) == true) {
      setMatchingUsers([]);
      return;
    }

    try {
      const resp = await axios.post(findIP()+"/api/matchRecipient", { senderID, newText });
      
      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        console.error(error);
      } else if (!resp.data || !resp.data.matchingUsers) {
        console.error("Error: the response does not contain the expected fields");
      } else {
        setMatchingUsers(resp.data.matchingUsers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextPressed = (item) => {
    setLetterInfo({...letterInfo, recipientID: item._id, recipientUsername: item.username});
    navigation.push('SelectTheme');
  };

  // this function renders the users that match the text in the input component
  function renderMatches() {

    if (matchingUsers.length == 0) {
      return <Text style={{textAlign:'center'}}>No users found</Text>
    }
    
    // return matchingUsers.map((item, index) => 
    //   // <Button 
    //   //   key={index}
    //   //   containerStyle={styles.button} 
    //   //   onPress={() => handleNextPressed(item)} title={JSON.stringify(item.username)}
    //   // />
    //   <TouchableOpacity style={styles.friendCircle} keyExtractor={(item) => item.title}>
    //     <Text>{(JSON.stringify(item.username)).replace(/["]/g, '')}</Text>
    //   </TouchableOpacity>
    // );
    return (
      <View>
        <FlatList
          nestedScrollEnabled
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: "center"}}
          data={matchingUsers}
          numColumns={3}
          renderItem={({item}) => 
            <View>
              <TouchableOpacity style={styles.friendCircle} onPress={() => handleNextPressed(item)} title={JSON.stringify(item.username)}>
                <Text style={styles.friendMidText}>{(JSON.stringify(item.name)).replace(/["]/g, '')[0]}</Text>
              </TouchableOpacity>
              <Text style={{textAlign: 'center', fontSize: 12}}>{(JSON.stringify(item.username)).replace(/["]/g, '')}</Text>
            </View>
            }
          keyExtractor={item => item.username}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flexDirection: 'column', flex: 1, alignItems: 'center', marginTop: 20 }}>
      <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15}}>
          <TouchableOpacity onPress={()=>handleGoBack()}>
            <Ionicons name={"arrow-back"} size={40}/>
          </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row'}}>
        <Text style={styles.titleText}>Compose</Text>
      </View>
      <View style={[styles.recipientsContainer]}>
        <Text style={styles.selectTitleText}>Select a recipient</Text>
        <View style={styles.inputContainer}>
          <Input 
            placeholder="enter name or username"
            autoCompleteType="email"
            autoCapitalize="none"
            onChangeText={handleChangeText}
            inputContainerStyle={{borderBottomWidth:0, backgroundColor: 'white', height: 32, borderRadius: 5}}
            leftIcon={{ type: 'font-awesome', name: 'search', size: 15, marginLeft: 10}}
          />
        </View>
        {/* <ScrollView style={styles.scrollView}> */}
          <View>
            {renderMatches()}
          </View>
        {/* </ScrollView> */}
      </View>
    </SafeAreaView>
  );
};

export default SelectRecipientScreen;

const styles = StyleSheet.create({
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
    fontFamily: 'JosefinSansBold',
    fontSize: 50, 
    fontWeight: 'bold',
    flex: 1,
    textAlign: "center",
    // marginLeft: -10
  },
  recipientsContainer: {
    width: 350,
    height: 585,
    // backgroundColor: "#ACC3FF",
    borderRadius: 20, 
    marginTop:20,
    flex: 1,
  },
  friendCircle: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: "rgba(30,70,147,0.2)",
    // backgroundColor: "white",
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    // borderWidth: 1,
    // borderColor: 'black'
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }, 
  selectTitleText: {
    fontSize: 35,
    fontWeight: "400",
    justifyContent: "center",
    textAlign: 'center', 
    marginTop: 15, 
    // textDecorationLine: 'underline'
  },
  inputContainer: {
    width: 285,
    marginLeft: 30,
    marginTop: 10
  }, 
  friendMidText: {
    textAlign: "center",
    // textAlignVertical: "center",
    fontSize: 20, 
    color: "#1E4693", 
    opacity: 1,
    marginTop: 21,
    fontWeight: "600"
    // backgroundColor: "rgba(0,0,0,1)" 
  }
});
