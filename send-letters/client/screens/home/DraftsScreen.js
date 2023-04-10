import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ComposeContext } from '../../context/ComposeStackContext';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { Snackbar } from 'react-native-paper';
import ButtonPrimary from '../../components/ButtonPrimary';
import { useIsFocused } from '@react-navigation/native';


function DraftsScreen({ navigation }) {
  const [userInfo, setUserInfo] = useContext(AuthContext);
  const userID = userInfo.user._id;
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);
  const [drafts, setDrafts] = useState("");

  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);

  const isFocused = useIsFocused();

  // fetch the drafts from the server
  useEffect(() => {
    async function fetchDrafts() {
      try {
        const resp = await axios.post(findIP()+"/api/fetchLetters", { userID, possibleLetterStatuses: ["draft"], userStatus: "sender" });
        
        if (!resp) {  // could not connect to backend
          console.log("ERROR: Could not establish server connection with axios");
          setSnackMessage("Could not establish connection to the server");
          setSnackIsVisible(true);
        } else if (resp.data.error) {  // backend error
          console.error(error);
        } else if (!resp.data || !resp.data.receivedLetters) {
          console.error("Error: the response does not contain the expected fields");
        } else {
          setDrafts(resp.data.receivedLetters);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchDrafts();
  }, [isFocused]);

  const handleDraftPressed = (item) => {
    // clicking on draft button will update the current letter info
    setLetterInfo({
      senderID: userID,
      letterID: item._id,
      text: item.text,
      recipientID: item.recipient,
      recipientUsername: item.recipientInfo.username,
      themeID: item.theme,
      fontID: item.font
    });
    navigation.navigate('NavBar', {
      screen: 'Compose',
      params: {
        screen: 'ComposeHome',
        params: {text: item.text}
      }
    });
  };

  // this function renders the user's drafts found in the DB
  function renderDrafts() {

    if (drafts.length == 0) {
      return <Text style={{textAlign:'center'}}>No drafts found</Text>
    }

    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <FlatList
          nestedScrollEnabled
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: "center"}}
          data={drafts}
          numColumns={1}
          renderItem={({item}) => 
            <View>
              <TouchableOpacity onPress={() => handleDraftPressed(item)} title={JSON.stringify(item)}>
                <Text>{(JSON.stringify(item))}</Text>
              </TouchableOpacity>
            </View>
            }
          keyExtractor={item => item._id}
        />
      </View>
    );
  };


  return (
    <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
      <View style={{ flexDirection:"row" }}>
        <ButtonPrimary 
        selected={false} 
        title={"Mailbox"} 
        onPress={() => navigation.replace('Mailbox')}/>
        <ButtonPrimary selected={true} title={"Drafts"} />
      </View>
      <View>
        {renderDrafts()}
      </View>
    </SafeAreaView>
  );
};

export default DraftsScreen;