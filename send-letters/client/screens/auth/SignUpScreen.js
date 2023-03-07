import { StyleSheet, View, KeyboardAvoidingView, Text, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useContext } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Input, Image } from 'react-native-elements';
import { Snackbar } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from '../../context/auth';
import findIP from '../../helpers/findIP';
import { validateEmail, hasWhiteSpace, hasRestrictedChar } from '../../helpers/stringValidation';
import Ionicons from '@expo/vector-icons/Ionicons';
import {COLORS} from '../../styles/colors';


const WINDOW_WIDTH = Dimensions.get('window').width;


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

    // check for restricted characters in a username
    if (hasRestrictedChar(username) == true) {
      setSnackMessage("Your username cannot contain a restricted character");
      setSnackIsVisible(true);
      return;
    }

    // connect to server and get response
    try {
      const resp = await axios.post(findIP()+"/api/signUp", { name, email, username, password });

      // alert if any errors detected on backend
      if (!resp) {
        console.log("error");
      } else if (resp.data.error) {
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
    } catch (err) {
      console.log(err);
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
          placeholder="Name"
          onChangeText={text => setName(text)}
          autoCorrect={false} 
        />
        <Input
          placeholder="Email"
          autofocus
          type="email"
          keyboardType="email-address"
          autoCompleteType="email"
          autoCapitalize="none"
          onChangeText={text => setEmail(text.toLowerCase())} 
        />
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
          onChangeText={text => setPassword(text)}
          onSubmitEditing={handleSignUpPressed}
        /> 
      </View>
    
      <View>
        <TouchableOpacity style={styles.btn} onPress={() => handleSignUpPressed()}>
          <Text style={[styles.buttonText, styles.selectedText]}>Start writing letters</Text>
          <Ionicons
            style={{color: "#FFFFFF"}}
            name={"arrow-forward-outline"}
            size={24}>
            </Ionicons>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.lineShort}></View>
          <Text style={styles.text}>or</Text>
          <View style={styles.lineShort}></View>
        </View>

        <TouchableOpacity onPress={() => handleSignInPressed()}>
          <Text style={styles.underLineText}>I already have an account</Text>
        </TouchableOpacity>
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
    btn: {
      backgroundColor: COLORS.blue700,
      marginTop: 15,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 16,
      paddingRight: 18,
      paddingBottom: 16,
      paddingLeft: 18,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      borderBottomRightRadius: 25,
      borderBottomLeftRadius: 25,
      marginRight: 0.15 * WINDOW_WIDTH,
      marginLeft: 0.15 * WINDOW_WIDTH,
    },
    buttonText: {
      flex: 1,
      height: 18,
      fontStyle: "normal",
      fontWeight: "500",
      fontSize: 18,
      lineHeight: 18,
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      letterSpacing: 0.3,
      color: COLORS.white,
    },
    lineShort: {
      width: 0.4 * WINDOW_WIDTH,
      height: 0,
      borderWidth: 1,
      borderColor: "#737B7D",
    },
    text: {
      fontSize: 16,
      fontWeight: "600", 
      color: '#737B7D',
    },
    underLineText: {
      fontSize: 17,
      textDecorationLine: 'underline',
      color: '#737B7D',
      fontWeight: '600',
      textAlign: 'center',
    },
    orContainer: {
      width: 0.9 * WINDOW_WIDTH,
      height: 60,
      flexDirection: "row",
      justifyContent: 'space-between', 
      alignItems: 'center',
      color: '#737B7D'
    },
});
