import { AuthContext } from '../../context/AuthContext';
import { ComposeContext } from '../../context/ComposeStackContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Snackbar } from 'react-native-paper';
import { Image, Text, View, StyleSheet, Dimensions, Share } from 'react-native';
import axios from 'axios';
import ButtonPrimary from '../../components/ButtonPrimary';
import findIP from '../../helpers/findIP';
import LetterDetail from '../../components/LetterDetail';
import PreviewEditRow from '../../components/PreviewEditRow';
import React, { useState, useContext, useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function PreviewScreen({ navigation }) {
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);

  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);

  const handleSendPressed = () => {
    sendLetterBackend();
  };

  const sendLetterBackend = async () => {
    try {
      let backendData = letterInfo;
      backendData['status'] = "sent";
      resp = await axios.post(findIP() + "/api/updateLetterInfo", backendData);

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
          ...letterInfo,
          letterID: "",
          text: "",
          recipientID: "",
          themeID: "",
          recipientUsername: "",
          fontID: "",
          fontName: "",
          customFont: false,
          stickers: [],
          status: ""
        });
        navigation.replace('NavBar', 
          { screen: 'Home',
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
  
  // In letter detail, preserving an A4 paper aspect ratio (1.41 height to width)
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{marginTop: 30, marginBottom: 10}}>
        <LetterDetail 
          text={letterInfo.text} 
          themeID={letterInfo.themeID} 
          fontID={letterInfo.fontID} 
          stickers={letterInfo.stickers}
          width={.9*.8} 
          height={.64*.8}
          large={false}
        />
      </View>
      <View style={{flex: 2.5, justifyContent: 'center', alignItems: 'center'}}>
        <View style={[{flexDirection: 'column', justifyContent: 'space-between'}, styles.editContainer]}>
          <PreviewEditRow text={letterInfo.recipientUsername} category={"Recipient"}/>
          <PreviewEditRow text={letterInfo.themeID} category={"Theme"}/>
          <PreviewEditRow text={letterInfo.fontName} category={"Font"}/>
        </View>
      </View>
      <View style={{flex: .7, justifyContent: 'space-between'}}>
        <Text style={{fontFamily: "JosefinSansBold", fontSize: wp('5%')}} allowFontScaling={false}>Does this look good?</Text>
      </View>
      <View style={{flexDirection: 'row', marginBottom: wp('5%')}}>
        <ButtonPrimary
          textWidth={wp('26.8%')}
          title={"No, edit it."}
          selected={true}
          onPress={() => navigation.goBack()}
        />
        <ButtonPrimary
          textWidth={wp('30%')}
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
      width: wp('80%'),
  },
  button: {
      width: wp('53.33%'), 
      marginTop: hp('1.35%'),
  },
  container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: wp('2.67%'),
      backgroundColor: 'white',
  },
  editContainer: {
    width: wp('85%'),
    height: hp('40%'),
    backgroundColor: "#ACC3FF",
    borderRadius: wp('5.33%'), 
    marginTop: hp('2.7%'),
    marginBottom: hp('2.7%'),
    padding: wp('5.33%'),
    flex: 1,
  }
});