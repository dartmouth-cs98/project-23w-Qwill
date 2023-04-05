import { Text, View, StyleSheet, Dimensions, Share } from 'react-native';
import React, { useState, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Snackbar } from 'react-native-paper';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { AuthContext } from '../../context/auth';
import ButtonPrimary from '../../components/ButtonPrimary';
import LetterDetail from '../../components/LetterDetail';
import PreviewEditRow from '../../components/PreviewEditRow';
import { ComposeContext } from '../../context/ComposeStackContext';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function PreviewScreen({ navigation }) {

  const [userInfo, setUserInfo] = useContext(AuthContext);
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);

  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);

  const onDismissSnack = () => setSnackIsVisible(false);

  const handleSendPressed = async () => {
    try {
      resp = null;
      if (letterInfo.letterID == "") {
        // letter hasn't been made in DB (never saved as a draft); make new letter with status sent
        reqBody = letterInfo;
        reqBody['status'] = "sent"
        resp = await axios.post(findIP()+"/api/makeLetter", reqBody);
      } else {
        // letter exists in DB as a draft; update status to sent
        resp = await axios.post(findIP()+"/api/updateLetterStatus", {letterID: letterInfo.letterID, newStatus: "sent"});
      }

      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else {
        // successful letter send will be sent as a param, to toggle snackbar on home page
        // Reset our letter context
        setLetterInfo({
          letterID: "",
          text: "",
          recipientID: "",
          themeID: "",
          fontID: ""
        });
        navigation.replace('NavBar', 
          { screen: "Home",
            params: {
              screen: 'Mailbox', 
              params: {
                letterSentSnackIsVisible: true
              }
            }
          }
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSharePressed = async () => {
    try {
      const result = await Share.share({
        message:
          'This is Qwill',
      });
      // if (result.action === Share.sharedAction) {
      //   if (result.activityType) {
      //     // shared with activity type of result.activityType
      //   } else {
      //     // shared
      //   }
      // } else if (result.action === Share.dismissedAction) {
      //   // dismissed
      // }
    } catch (err) {
      setSnackMessage(err);
      setSnackIsVisible(true);
    }
  };
  
  // In letter detail, preserving an A4 paper aspect ratio (1.41 height to width)
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{marginTop: 30, marginBottom: 10}}>
        <LetterDetail 
          text={letterInfo.text} 
          themeID={letterInfo.themeID} 
          fontID={letterInfo.fontID} 
          width={screenWidth * .65} 
          height={screenHeight * .46}/>
      </View>
      <View style={{flex: 2.5, justifyContent: 'center', alignItems: 'center'}}>
        <View style={[{flexDirection: 'column', justifyContent: 'space-between'}, styles.editContainer]}>
          <PreviewEditRow text={letterInfo.recipientUsername} category={"Recipient"}/>
          <PreviewEditRow text={letterInfo.themeID === "" ? "None" : letterInfo.themeID} category={"Theme"}/>
          <PreviewEditRow text={letterInfo.fontID === "" ? "Default": letterInfo.fontID} category={"Font"}/>
        </View>
      </View>
      <View style={{flex: .7, justifyContent: 'space-between'}}>
        <Text style={{fontFamily: "JosefinSansBold", fontSize: 20}}>Does this look good?</Text>
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
      <ButtonPrimary
          textWidth={115}
          title={"share it!!!"}
          selected={true}
          onPress={() => handleSharePressed()}
        />
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
