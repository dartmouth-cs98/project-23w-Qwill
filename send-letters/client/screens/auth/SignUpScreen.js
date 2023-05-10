
import { AuthContext } from '../../context/AuthContext';
import { COLORS } from '../../styles/colors';
import { Input, Image } from 'react-native-elements';
import { Snackbar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, KeyboardAvoidingView, Text, TouchableOpacity, Dimensions } from 'react-native'
import { validateEmail, hasWhiteSpace, hasRestrictedChar } from '../../helpers/stringValidation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import findIP from '../../helpers/findIP';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useContext } from 'react'

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
      
      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
        return;
      } else {
        setState(resp.data);
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
  
  // KeyboardAvoidingView:
  // This component will automatically adjust its height, position, or bottom padding based on the 
  // keyboard height to remain visible while the virtual keyboard is displayed.
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light"/>
      <View style={{width: wp('60%')}}>
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
      <View style={{height: heightPercentageToDP('10.8')}}/>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;


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
      paddingTop: hp('2.16%'),
      paddingRight: wp('4.8%'),
      paddingBottom: hp('2.16%'),
      paddingLeft: wp('4.8%'),
      borderTopLeftRadius: wp('6.67%'),
      borderTopRightRadius: wp('6.67%'),
      borderBottomRightRadius: wp('6.67%'),
      borderBottomLeftRadius: wp('6.67%'),
      marginRight: wp('4%'),
      marginLeft: wp('4%'),
    },
    buttonText: {
      flex: 1,
      height: hp('2.43%'),
      fontStyle: "normal",
      fontWeight: "500",
      fontSize: hp('2.43%'),
      lineHeight: hp('2.43%'),
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      letterSpacing: 0.3,
      color: COLORS.white,
    },
    lineShort: {
      width: wp('10.67%'),
      height: 0,
      borderWidth: wp('0.03%'),
      borderColor: "#737B7D",
    },
    text: {
      fontSize: hp('2.16%'),
      fontWeight: "600", 
      color: '#737B7D',
    },
    underLineText: {
      fontSize: hp('2.3%'),
      textDecorationLine: 'underline',
      color: '#737B7D',
      fontWeight: '600',
      textAlign: 'center',
    },
    orContainer: {
      width: wp('24%'),
      height: hp('8.11%'),
      flexDirection: "row",
      justifyContent: 'space-between', 
      alignItems: 'center',
      color: '#737B7D'
    },
});
