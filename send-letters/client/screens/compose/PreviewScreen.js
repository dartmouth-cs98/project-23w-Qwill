import { Text, View, StyleSheet } from 'react-native';
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react'
import { Button, Input, Image } from 'react-native-elements';
import { Snackbar } from 'react-native-paper';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { AuthContext, AuthProvider } from '../../context/auth';
import SignInScreen from '../auth/SignInScreen';
import AsyncStorage from "@react-native-async-storage/async-storage";


function PreviewScreen({ route, navigation }) {

  const { recipientID, text } = route.params;
  const [state, setState] = useContext(AuthContext);

  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);

  const onDismissSnack = () => setSnackIsVisible(false);

  const handleSendPressed = async () => {
    const authentificated = state && state.token !== "" && state.user !== null;
    if (!authentificated) {
      setState({ token: "", user: null });
      await AsyncStorage.removeItem("auth-rn");
      navigation.replace(SignInScreen);
      return;
    }

    const senderID = state.user._id;    
    const resp = await axios.post(findIP()+"/api/compose", { senderID, recipientID, text });

    console.log("letter sent");

    // alert if any errors detected on backend (such as email or username already taken)
    if (resp.data.error) {
      setSnackMessage(resp.data.error);
      setSnackIsVisible(true);
      return;
    } else {
      // successful letter send
      alert("Letter sent!");
      navigation.replace('NavBar');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{JSON.stringify(route.params)}</Text>
      <Button containerStyle={styles.button} onPress={() => handleSendPressed()} title="Yes, send it!"/>
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
