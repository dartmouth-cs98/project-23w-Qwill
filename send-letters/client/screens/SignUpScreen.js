import { StyleSheet, Text, View, KeyboardAvoidingView, Keyboard } from 'react-native'
import React, {useState, useLayoutEffect, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import {Button, Input, Image} from 'react-native-elements';
import SnackBar from 'react-native-snackbar-component';
import axios from 'axios';

// You can get the navigation stack as a prop
// Later down in the code you can see the use of the function "navigation.navigate("name of screen")"
const SignUpScreen = ({navigation}) => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  // TODO: To be filled in when auth is implemented
  const handleSignUpPressed = async () => {
    if (name === "" || email === "" || password === "") {
      setSnackMessage("All fields are required.");
      setSnackIsVisible(true);
      return;
    }
    const resp = await axios
      .post("http://localhost:8000/api/signUp", { name, email, password });

    if (resp.data.error) {
      setSnackMessage(resp.data.error);
      setSnackIsVisible(true);
    } else {
      alert("Account creation successful! Welcome to Qwill.");
      navigation.replace("NavBar");
    }
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
          onChangeText={text => setEmail(text)} />
        <Input 
          placeholder="Password"
          secureTextEntry={true}
          type="password"
          autoCompleteType="password"
          onChangeText={text => setPassword(text)} />
          {/* onSubmitEditing={signUpPressed}/> */}
      </View>
    
      {/* when using native elements, target container style, not style*/}
      {/* TODO: we'll replace the navigate here with .replace() once we have an actual auth system built*/}
      <Button containerStyle={styles.button} onPress={() => handleSignUpPressed()} title="Log in"/>
      <Button containerStyle={styles.button} onPress={() => handleSignUpPressed()} type="outline" title="Sign up"/>

      <SnackBar
          visible={snackIsVisible}
          //SnackBar visibility control
          textMessage={snackMessage}
          //Text on SnackBar
          actionHandler={() => {
            setSnackIsVisible(false);
          }}
          actionText="OK"
          //action Text to print on SnackBar
        />

      {/* this empty view is included to keep the keyboard from covering up the very bottom of the view */}
      <View style={{height: 100}}/>
    </KeyboardAvoidingView>
  );
}

export default SignUpScreen

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
