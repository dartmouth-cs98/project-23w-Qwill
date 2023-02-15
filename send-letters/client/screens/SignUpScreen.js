import { StyleSheet, Text, View, KeyboardAvoidingView, Keyboard } from 'react-native'
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Image } from 'react-native-elements';
import { Snackbar } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from '../context/auth';
import findIP from '../helpers/findIP';
import { validateEmail, hasWhiteSpace } from '../helpers/stringValidation';


// You can get the navigation stack as a prop
// Later down in the code you can see the use of the function "navigation.navigate("name of screen")"
const SignUpScreen = ({navigation}) => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useContext(AuthContext);

  // For snackbar:
  // https://callstack.github.io/react-native-paper/snackbar.html
  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);

  const onDismissSnack = () => setSnackIsVisible(false);


  // TODO: handle navigation for successful sign up
  const handleSignUpPressed = async () => {
    // check for empty fields
    if (name === "" || email === "" || password === "" || username === "") {
      setSnackMessage("All fields are required");
      setSnackIsVisible(true);
      return;
    }

    // check password length
    if (password.length < 6) {
      setSnackMessage("Password must be at least 6 characters long");
      setSnackIsVisible(true);
      return;
    }
    if (password.length > 30) {
      setSnackMessage("Password must be less than 30 characters long");
      setSnackIsVisible(true);
      return;
    }

    // check for a valid email address
    if (validateEmail(email) == false) {
      setSnackMessage("You must enter a valid email address");
      setSnackIsVisible(true);
      return;
    }

    // check username length
    if (username.length > 30) {
      setSnackMessage("Username must be less than 30 characters long");
      setSnackIsVisible(true);
      return;
    }

    // check for whitespace in a username
    if (hasWhiteSpace(username) == true) {
      setSnackMessage("Your username cannot contain spaces");
      setSnackIsVisible(true);
      return;
    }

    // connect to server and get response
    const resp = await axios.post(findIP()+"/api/signUp", { name, email, username, password });
    console.log(resp.data);

    // alert if any errors detected on backend (such as email or username already taken)
    if (resp.data.error) {
      setSnackMessage(resp.data.error);
      setSnackIsVisible(true);
      return;
    } else {
      setState(resp.data);
      await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data));
      // successful sign up
      alert("Sign Up Successful. Welcome to Qwill");
      navigation.replace('NavBar');
    }
  }


  const handleSignInPressed = () => {
    navigation.replace('SignIn');
  }
  
  // KeyboardAvoidingView:
  // This component will automatically adjust its height, position, or bottom padding based on the 
  // keyboard height to remain visible while the virtual keyboard is displayed.
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light"/>
      <Image 
        style={styles.imageWithShadow}
        source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Envelope-letter-icon.png"
        }}
      />
      <View style={styles.inputContainer}>
        {/* autofocus automatically focuses the app on this input */}
        <Input 
          placeholder="Name"
          onChangeText={text => setName(text)}
          autoCorrect={false} />
        <Input 
          placeholder="Email"
          autofocus
          type="email"
          keyboardType="email-address"
          autoCompleteType="email"
          autoCapitalize="none"
          onChangeText={text => setEmail(text.toLowerCase())} />
        <Input 
          placeholder="Username"
          autoCapitalize="none"
          onChangeText={text => setUsername(text)}
          autoCorrect={false} />
        <Input 
          placeholder="Password"
          secureTextEntry={true}
          type="password"
          autoCompleteType="password"
          onChangeText={text => setPassword(text)} />
          {/* onSubmitEditing={signUpPressed}/> */}
      </View>
    
      {/* when using native elements, target container style, not style*/}
      <Button containerStyle={styles.button} onPress={() => handleSignUpPressed()} type="outline" title="Sign up"/>
      <Button containerStyle={styles.button} onPress={() => handleSignInPressed()} title="I already have an account"/>

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
}

export default SignUpScreen;

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
