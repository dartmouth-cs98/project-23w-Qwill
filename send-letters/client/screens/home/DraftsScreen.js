import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/auth';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { Snackbar } from 'react-native-paper';
import ButtonPrimary from '../../components/ButtonPrimary';
import { useIsFocused } from '@react-navigation/native';


const DraftsScreen = ({navigation}) => {
  const [userInfo, setUserInfo] = useContext(AuthContext);
  const userID = userInfo.user._id;
  const [drafts, setDrafts] = useState("");

  // For snackbar:
  // https://callstack.github.io/react-native-paper/snackbar.html
  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);

  const isFocused = useIsFocused();

  // fetch the drafts from the server
  useEffect(() => {
    async function fetchDrafts() {
      try {
        const resp = await axios.post(findIP()+"/api/getDrafts", { userID });
        
        if (!resp) {  // could not connect to backend
          console.log("ERROR: Could not establish server connection with axios");
          setSnackMessage("Could not establish connection to the server");
          setSnackIsVisible(true);
        } else if (resp.data.error) {  // backend error
          console.error(error);
        } else if (!resp.data || !resp.data.drafts) {
          console.error("Error: the response does not contain the expected fields");
        } else {
          setDrafts(resp.data.drafts);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchDrafts();
  }, [isFocused]);

  console.log(drafts);

  return (
    <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
      <View style={{ flexDirection:"row" }}>
        <ButtonPrimary 
        selected={false} 
        title={"Mailbox"} 
        onPress={() => navigation.replace('Mailbox')}/>
        <ButtonPrimary selected={true} title={"Drafts"} />
      </View>
      
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text>Feature coming soon!</Text>
      </View>
    </SafeAreaView>
  );
};

export default DraftsScreen;