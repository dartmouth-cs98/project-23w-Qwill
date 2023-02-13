import { StyleSheet, Text, View, KeyboardAvoidingView, Keyboard } from 'react-native'
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Image } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from '../context/auth';


// You can get the navigation stack as a prop
// Later down in the code you can see the use of the function "navigation.navigate("name of screen")"
const SignInScreen = ({navigation}) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useContext(AuthContext);

  // TODO: To be filled in when auth is implemented
  const handleSignInPressed = async () => {
    if (email === "" || password === "") {
      return;
    }

    const resp = await axios.post("http://localhost:8000/api/signIn", { email, password });
    console.log(resp.data);

    // alert if any errors detected on backend (such as email already taken)
    if (resp.data.error) {
      alert(resp.data.error);
      return;
    } else {
      setState(resp.data);
      await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data));
      alert("Sign In Successful");
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
      <Image 
        style={styles.imageWithShadow}
        source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Envelope-letter-icon.png"
        }}
      />
      <View style={styles.inputContainer}>
        {/* autofocus automatically focuses the app on this input */}
        <Input 
          placeholder="Email"
          // autofocus
          type="email"
          keyboardType="email-address"
          autoCompleteType="email"
          autoCapitalize="none"
          onChangeText={text => setEmail(text.toLowerCase())} />
        <Input 
          placeholder="Password"
          secureTextEntry={true}
          type="password"
          autoCompleteType="password"
          onChangeText={text => setPassword(text)} />
          {/* onSubmitEditing={signInPressed}/> */}
      </View>
    
      {/* when using native elements, target container style, not style*/}
      {/* TODO: we'll replace the navigate here with .replace() once we have an actual auth system built*/}
      <Button containerStyle={styles.button} onPress={() => handleSignInPressed()} title="Log in"/>
      <Button containerStyle={styles.button} onPress={() => handleSignUpPressed()} type="outline" title="Sign up"/>

      {/* this empty view is included to keep the keyboard from covering up the very bottom of the view */}
      <View style={{height: 100}}/>
    </KeyboardAvoidingView>
  );
}

export default SignInScreen

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
