import { AuthContext } from '../../context/AuthContext';
import { COLORS } from '../../styles/colors';
import { Snackbar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, KeyboardAvoidingView, Text, TouchableOpacity, Dimensions, ScrollView, Keyboard } from 'react-native';
import { TextInput } from 'react-native';
import { validateEmail, hasWhiteSpace, hasRestrictedChar } from '../../helpers/stringValidation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import findIP from '../../helpers/findIP';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useContext } from 'react'

const WINDOW_WIDTH = Dimensions.get('window').width;

// You can get the navigation stack as a prop
// Later down in the code you can see the use of the function "navigation.navigate("name of screen")"
const SignUpScreen = ({navigation}) => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useContext(AuthContext);
  const [isSigningUp, setIsSigningUp] = useState(false); 


  // For snackbar:
  // https://callstack.github.io/react-native-paper/snackbar.html
  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);

  const handleSignUpPressed = async () => {
    console.log("pressed");
    if (!isSigningUp) {
      console.log("made it inside");
      setIsSigningUp(true); 
      try {
        await sendSignUpBackend();
      } catch (error) {
        console.error(error);
      } finally {
        setIsSigningUp(false);
      }
    }
  }

  const sendSignUpBackend = async () => {
    // check for empty fields
    if (name === "" || email === "" || password === "" || username === "") {
      setSnackMessage("All fields are required");
      setSnackIsVisible(true);
      return;
    }

    // check name length
    if (name.length > 30) {
      setSnackMessage("Name must be less than 30 characters long");
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

    // check username length
    if (username.length < 6) {
      setSnackMessage("Username must be more than 6 characters long");
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
      
      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
        return;
      } else {
        setUserInfo(resp.data);
        await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data));
        // successful sign up
        alert("Sign Up Successful. Welcome to Qwill");
        navigation.navigate('NavBar');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignInPressed = () => {
    navigation.replace('SignIn');
  };
  

  return (
    <KeyboardAvoidingView
         behavior="padding"
         style={styles.container}
    >
      <ScrollView style={{flexGrow:1}}>
        <StatusBar style="light"/>
        <View style={{alignContent: 'center'}}>
          <Text style={styles.signUpHeader} allowFontScaling={false}>
            Sign Up
          </Text>
        </View>

        <View style={styles.inputContainer}>
          {/* autofocus automatically focuses the app on this input */}
          <TextInput
            style={styles.inputField}
            placeholder="Name"
            onChangeText={text => setName(text)}
            autoCorrect={false}
            allowFontScaling={false}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Email"
            autofocus
            type="email"
            keyboardType="email-address"
            autoCompleteType="email"
            autoCapitalize="none"
            onChangeText={text => setEmail(text.toLowerCase())}
            allowFontScaling={false}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Username"
            autoCapitalize="none"
            onChangeText={text => setUsername(text)}
            autoCorrect={false}
            allowFontScaling={false}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Password"
            secureTextEntry={true}
            type="password"
            autoCompleteType="password"
            onChangeText={text => setPassword(text)}
            onSubmitEditing={() => Keyboard.dismiss()}
            allowFontScaling={false}
          />
        </View>

        <View>
          <TouchableOpacity style={styles.btn} onPress={() => handleSignUpPressed()}>
            <Text style={[styles.buttonText, styles.selectedText]} allowFontScaling={false}>Start writing letters</Text>
            <Ionicons
              style={{color: "#FFFFFF"}}
              name={"arrow-forward-outline"}
              size={24}>
              </Ionicons>
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <View style={styles.lineShort}/>
            <Text style={styles.text} allowFontScaling={false}>or</Text>
            <View style={styles.lineShort}/>
          </View>

          <TouchableOpacity onPress={() => handleSignInPressed()}>
            <Text style={styles.underLineText} allowFontScaling={false}>I already have an account</Text>
          </TouchableOpacity>
        </View>
          {/* this empty view is included to keep the keyboard from covering up the very bottom of the view */}
        <View style={{height: hp('10.8')}}/>
      </ScrollView>

      <Snackbar
        style={styles.snackbar}
        //SnackBar visibility control
        visible={snackIsVisible}
        onDismiss={() => onDismissSnack}
        action={{
          label: 'OK',
          onPress: () => {
            setSnackIsVisible(false);
          },
        }}
      >
        <Text style={styles.snackBarText} allowFontScaling={false}>{snackMessage}</Text>
      </Snackbar>

    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;


const styles = StyleSheet.create({
    signUpHeader: {
      fontSize: wp('18%'),
      fontFamily: 'JosefinSansBold',
      marginBottom: hp('4%'), 
      marginTop: hp('10%'),
      marginLeft: hp('5.5%'),
    },
    inputField: {
      backgroundColor: '#E2E8F6',
      borderRadius: hp('3.2%'),
      padding: hp('2%'),
      margin: hp('0.8%'),
      fontSize: hp('2%')

    },
    inputContainer: {
        width: wp('73%'),
        marginLeft: hp('4.5%'),
    },
    button: {
        width: wp('60%'),
        marginTop: hp('1.35%'),
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: wp('2.67%'),
        backgroundColor: '#F0F4FF',
    },
    signupContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: wp('2.67%'),
        backgroundColor: '#F0F4FF',
        //margin: hp('0.8%'),
        //borderRadius: hp('3.2%'),
    },
    imageWithShadow: {
        width: wp('53.33%'), 
        height: wp('53.33%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp('0.13%') },
        shadowOpacity: 0.8,
        shadowRadius: hp('0.27%'),  
    },
    btn: {
      backgroundColor: COLORS.blue700,
      marginTop: hp('2.03%'),
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      paddingTop: wp('3%'),
      paddingRight: wp('3%'),
      paddingBottom: wp('3%'),
      paddingLeft: wp('3%'),
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      borderBottomRightRadius: 25,
      borderBottomLeftRadius: 25,
      marginRight: 0.15 * WINDOW_WIDTH,
      marginLeft: 0.15 * WINDOW_WIDTH,
    },
    buttonText: {
      flex: 1,
      height: wp('4.5%'),
      fontStyle: "normal",
      fontWeight: "500",
      fontFamily: 'JosefinSans',
      fontSize: wp('4.5%'),
      lineHeight: wp('4.5%'),
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      letterSpacing: 0.3,
      color: COLORS.white,
    },
    lineShort: {
      width: wp('37.5%'),
      height: 0,
      borderWidth: hp('0.04%'),
      borderColor: "#737B7D",
    },
    text: {
      fontSize: hp('2.16%'),
      fontWeight: "600", 
      color: '#737B7D',
    },
    underLineText: {
      fontSize: wp('4.5%'),
      fontFamily: 'JosefinSansBold',
      textDecorationLine: 'underline',
      color: '#737B7D',
      fontWeight: '600',
      textAlign: 'center',
    },
    orContainer: {
      width: wp('90%'),
      height: hp('10%'),
      flexDirection: "row",
      justifyContent: 'space-between', 
      alignItems: 'center',
      color: '#737B7D'
    },
    snackBarText: {
      color: COLORS.white,
      textAlign: 'center'
    },
    snackbar: {
      opacity: 0.7,
      alignSelf: 'center',
      width: wp('70%'),
      bottom: hp('1.3%'),
      fontSize: wp('4%'),
      borderRadius: wp('4%'),
    }
});