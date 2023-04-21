import { Snackbar } from 'react-native-paper';
import { Text, View, StyleSheet, Dimensions, ImageBackground, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react'
import { Button, Input, Image } from 'react-native-elements';
import ButtonPrimary from '../../components/ButtonPrimary';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { ComposeContext } from '../../context/ComposeStackContext';
import images from '../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction } from 'react-native-paper';
import { ChangeRecipientScreen } from './ChangeRecipientScreen';
import ComposeToolbar from './ComposeToolbar';
import ButtonBlue from '../../components/ButtonBlue.components';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import COLORS from '../../styles/colors';

function ComposeScreen({ navigation, route }) {
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);

  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);

  // don't need defaultText parameter if no text is routed in params; text only routed when a draft is loaded
  const defaultText = (route.params && route.params.text && route.params.text != "") ? route.params.text : undefined;

  // function that updates the letter context and also saves the letter as a draft on the server
  const handleTextChange = (text) => {
    setLetterInfo({ ...letterInfo, text: text, status: "draft" });

    reqBody = letterInfo;
    reqBody["text"] = text;  // have to update text since context not yet updated
    reqBody["status"] = "draft";
    updateBackend(reqBody);
  };

  const updateBackend = async (reqBody) => {
    try {
      resp = null;
      if (letterInfo.letterID == "") {
        // letter hasn't been made in DB (never saved as a draft); make new letter with status draft
        resp = await axios.post(findIP() + "/api/makeLetter", reqBody);
      } else {
        // letter exists in DB as a draft; update new info
        resp = await axios.post(findIP() + "/api/updateLetterInfo", reqBody);
      }

      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else {
        setLetterInfo({ ...letterInfo, letterID: resp.data.letterID });
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleGoBackPressed = () => {
    // have to reset letterInfo if coming from drafts since previous screen (draftsScreen) is part of home stack
    // also have to replace compose navigation with select recipient screen and go back one additional time 
    //    so that compose stack is reset when clicking on compose icon from navBar
    if (route.params && route.params.fromDrafts && route.params.fromDrafts) {
      setLetterInfo({
        ...letterInfo,
        letterID: "",
        text: "",
        recipientID: "",
        themeID: "",
        recipientUsername: "",
        fontID: ""
      });
      navigation.replace("SelectRecipient");
      composeStackGoBack(navigation, composeHomeGoBack);
    }
    composeStackGoBack(navigation, composeHomeGoBack);
  };

  const composeHomeGoBack = () => {
    navigation.navigate('Home');
  };

  const handleNextPressed = () => {
    navigation.push('Preview');
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        {/* Button Icons based on https://docs.expo.dev/guides/icons/ 
            Find more icons here: https://icons.expo.fyi/*/}
        <FontAwesome.Button name="user" backgroundColor={COLORS.blue400}></FontAwesome.Button>
        <FontAwesome.Button name="font" backgroundColor={COLORS.blue400}></FontAwesome.Button>
        <FontAwesome.Button name="star" backgroundColor={COLORS.blue400}></FontAwesome.Button>
        <FontAwesome.Button name="smile-o" backgroundColor={COLORS.blue400}></FontAwesome.Button>
      </View>
      <Text style={styles.titleText}>Write your Letter!</Text>
      <ImageBackground
        resizeMode={'cover'}
        style={{ flex: 1, width: '100%', height: '95%' }}
        source={images.themes[letterInfo.themeID]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            <Input
              style={{ fontFamily: letterInfo.fontID, marginTop: 20, fontSize: 22 }}
              placeholder={"Start writing your letter!"}
              inputContainerStyle={{ borderBottomWidth: 0 }}
              onChangeText={(text) => { hasTyped = true; handleTextChange(text); }}
              multiline={true}
              defaultValue={defaultText}
              autoCapitalize='none'
            />
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
      <KeyboardAvoidingView style={{ flexDirection: 'row' }}>
        {/* <View style={{flexDirection: 'row'}}> */}
        <ButtonPrimary title={"Go back"} selected={true} onPress={() => handleGoBackPressed()} />
        <ButtonPrimary title={"Next!"} selected={true} onPress={() => handleNextPressed()} />
        {/* </View> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ComposeScreen;

const styles = StyleSheet.create({
  inputContainer: {

  },
  button: {
    width: 200,
    marginTop: 10,
  },
  titleText: {
    fontSize: 20,
    fontFamily: 'JosefinSansBold',
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom: 10
  },

});
