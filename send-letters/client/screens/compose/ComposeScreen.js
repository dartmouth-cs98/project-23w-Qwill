import { Text, StyleSheet, ImageBackground, KeyboardAvoidingView } from 'react-native';
import React, { useState, useContext } from 'react'
import { Input } from 'react-native-elements';
import { Snackbar } from 'react-native-paper';
import ButtonPrimary from '../../components/ButtonPrimary';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { ComposeContext } from '../../context/ComposeStackContext';
import images from '../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import findIP from '../../helpers/findIP';

function ComposeScreen({ navigation, route }) {
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);

  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);

  // function that updates the letter context and also saves the letter as a draft on the server
  const handleTextChange = async (text) => {
    setLetterInfo({...letterInfo, text: text});
    
    reqBody = letterInfo;
    reqBody["text"] = text;  // have to update text since context not yet updated
    reqBody["status"] = "draft";

    try {
      resp = null;
      if (letterInfo.letterID == "") {
        // letter hasn't been made in DB (never saved as a draft); make new letter with status draft
        resp = await axios.post(findIP()+"/api/makeLetter", reqBody);
      } else {
        // letter exists in DB as a draft; update new info
        resp = await axios.post(findIP()+"/api/updateLetterInfo", reqBody);
      }

      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else {
        setLetterInfo({...letterInfo, letterID: resp.data.letterID});
      }
    } catch (err) {
      console.error(err);
    }
  }

  const composeHomeGoBack = () => {
    navigation.navigate('Home');
  };

  const handleNextPressed = () => {    
    navigation.push('Preview');
  };

  return ( 
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.titleText}>Write your Letter!</Text>
      <ImageBackground 
        resizeMode={'cover'}
        style={{ flex: 1, width: '100%', height: '95%'}} 
        source={images.themes[letterInfo.themeID]}> 
          <Input
            style={{fontFamily: letterInfo.fontID, marginTop: 20, fontSize: 22}} 
            placeholder={"Start writing your letter!"}
            // defaultValue={letterInfo.text}
            inputContainerStyle={{borderBottomWidth:0}}
            onChangeText={text => handleTextChange(text)}
            multiline={true}
            autoCapitalize='none'
          />
      </ImageBackground>
      <KeyboardAvoidingView style={{flexDirection: 'row'}}>
      {/* <View style={{flexDirection: 'row'}}> */}
        <ButtonPrimary title={"Go back"} selected={true} onPress={() => composeStackGoBack(navigation, composeHomeGoBack)}/>
        <ButtonPrimary title={"Next!"} selected={true} onPress={() => handleNextPressed()}/>
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
