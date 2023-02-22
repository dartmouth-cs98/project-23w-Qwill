import { Text, View, StyleSheet } from 'react-native';
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react'
import { Button, Input, Image } from 'react-native-elements';
import { Snackbar } from 'react-native-paper';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { AuthContext, AuthProvider } from '../../context/auth';
import SignInScreen from '../auth/SignInScreen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonPrimary from '../../components/ButtonPrimary';

function PreviewScreen({ route, navigation }) {

  const { recipientID, text } = route.params;
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
      // successful letter send
      // pass a param to let Home screen know it should display a "letter sent" snack
      navigation.replace('NavBar', {screen: "Home", letterSentSnackIsVisible: true});
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{JSON.stringify(route.params)}</Text>
      <View>
        <ButtonPrimary
          title={"No, back to editing."}
          selected={true}
          onPress={() => navigation.goBack()}
        />
        <ButtonPrimary
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
    </View>
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
});
