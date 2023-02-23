import { StyleSheet, Text, View, KeyboardAvoidingView, Keyboard, Dimensions } from 'react-native'
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Image } from 'react-native-elements';
import { Snackbar } from 'react-native-paper';
import ButtonPrimary from '../../components/ButtonPrimary';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from '../../context/auth';

// You can get the navigation stack as a prop
// Later down in the code you can see the use of the function "navigation.navigate("name of screen")"
const SignInScreen = ({navigation}) => {

  const [emailUsername, setEmailUsername] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useContext(AuthContext);

  // For snackbar:
  // https://callstack.github.io/react-native-paper/snackbar.html
  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);

  const onDismissSnack = () => setSnackIsVisible(false);

  const handleSignInPressed = async () => {

    if (emailUsername === "" || password === "") {
      setSnackMessage("All fields are required");
      setSnackIsVisible(true);
      return;
    }

    const resp = await axios.post(findIP()+"/api/signIn", { emailUsername, password });

    if (!resp) {
      console.log("error");
    }
    console.log(resp.data);

    // alert if any errors detected on backend (such as email or username already taken)
    if (resp.data.error) {
      setSnackMessage(resp.data.error);
      setSnackIsVisible(true);
      return;
    } else {
      setState(resp.data);
      await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data));
      navigation.replace('NavBar');
    }
  }

  const handleSignUpPressed = () => {
    navigation.replace('SignUp')
  }


  
  // KeyboardAvoidingView:
  // This component will automatically adjust its height, position, or bottom padding based on the 
  // keyboard height to remain visible while the virtual keyboard is displayed.
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light"/>
      <View style={{width: "60%"}}>
        <Image 
          style={{
            height: undefined, 
            width: '100%',
            aspectRatio: 1,
            resizeMode: "contain"}}
          source={require('../../assets/logo.png')}
        />
      </View>
      <View style={styles.inputContainer}>
        {/* autofocus automatically focuses the app on this input */}
        <Input 
          placeholder="Email/Username"
          // autofocus
          autoCompleteType="email"
          autoCapitalize="none"
          onChangeText={text => setEmailUsername(text.toLowerCase())} 
        />
        <Input 
          placeholder="Password"
          secureTextEntry={true}
          type="password"
          autoCompleteType="password"
          onChangeText={text => setPassword(text)} 
          onSubmitEditing={handleSignInPressed}
        />
      </View>
      
      <View>
        <ButtonPrimary selected={true} onPress={() => handleSignInPressed()} title="Log in"/>
        <ButtonPrimary selected={false} onPress={() => handleSignUpPressed()} type="outline" title="Sign up"/>
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

      {/* this empty view is included to keep the keyboard from covering up the very bottom of the view */}
      <View style={{height: 100}}/>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;

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
    imageWithShadow: {
        width: 200, 
        height: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
    },
});
