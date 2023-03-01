import { Text, View, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Image } from 'react-native-elements';
import { Snackbar } from 'react-native-paper';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { AuthContext, AuthProvider } from '../../context/auth';
import SignInScreen from '../auth/SignInScreen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonPrimary from '../../components/ButtonPrimary';
import LetterDetail from '../../components/LetterDetail';
import { Feather } from '@expo/vector-icons';
import PreviewEditRow from '../../components/PreviewEditRow';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function PreviewScreen({ route, navigation }) {

  const { recipientID, recipientUsername, themeID, fontID, text } = route.params;
  const [state, setState] = useContext(AuthContext);

  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);

  const onDismissSnack = () => setSnackIsVisible(false);

  const handleSendPressed = async () => {
    const senderID = state.user._id;    
    const resp = await axios.post(findIP()+"/api/sendLetter", { senderID, recipientID, text });

    console.log(resp)

    // alert if any errors detected on backend (such as email or username already taken)
    if (resp.data.error) {
      setSnackMessage(resp.data.error);
      setSnackIsVisible(true);
      return;
    } else {
      // successful letter send will be sent as a param, to toggle snackbar on home page
      navigation.replace('NavBar', 
          { screen: "Home",
            params: {
              screen: 'Mailbox', 
              params: {
                letterSentSnackIsVisible: true
              }
          }
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{flex: 4, alignItems: 'center', marginTop: 30}}>
        <LetterDetail text={text} themeID={themeID} fontID={fontID} width={screenWidth * .6} height={screenHeight * .43}/>
      </View>
      <View style={[{flex: 4, flexDirection: 'column', justifyContent: 'space-between'}, styles.editContainer]}>
        <PreviewEditRow text={recipientUsername} category={"Recipient"}/>
        <PreviewEditRow text={themeID} category={"Theme"}/>
        <PreviewEditRow text={fontID} category={"Font"}/>
      </View>
      <View style={{flex: 1}}>
        <Text style={{fontFamily: "JosefinSans", fontSize: 20}}>Does this look good?</Text>
      </View>
      <View style={{flexDirection: 'row', marginBottom: 15}}>
        <ButtonPrimary
          textWidth={115}
          title={"No, edit it."}
          selected={true}
          onPress={() => navigation.goBack()}
        />
        <ButtonPrimary
          textWidth={115}
          title={"Yes, send it!"}
          selected={true}
          onPress={() => handleSendPressed()}
        />
      </View>
      <Snackbar
          //SnackBar visibility control
          visible={snackIsVisible}
          onDismiss={onDismissSnack}
          action={{
            label: 'OK',
            onPress: () => {
              onDismissSnack();
            },
          }}
        >
          {snackMessage}
        </Snackbar>
    </SafeAreaView>
  );
};

export default PreviewScreen;

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
  editContainer: {
    width: screenWidth * .85,
    height: screenHeight * .4,
    backgroundColor: "#ACC3FF",
    borderRadius: 20, 
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    flex: 1,
  }
});
