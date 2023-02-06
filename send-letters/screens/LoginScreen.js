import { StyleSheet, Text, View, KeyboardAvoidingView, Keyboard } from 'react-native'
import React, {useState, useLayoutEffect, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import {Button, Input, Image} from 'react-native-elements';

// You can get the navigation stack as a prop
// Later down in the code you can see the use of the function "navigation.navigate("name of screen")"
const LoginScreen = ({navigation}) => {
  
  // TODO: To be filled in when auth is implemented
  const signIn = () => {

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
          placeholder='Email' 
          autofocus 
          type='email' />
        <Input 
          placeholder='Password' 
          secureTextEntry 
          type='password' 
          onSubmitEditing={signIn}/>
      </View>
    
      {/* when using native elements, target container style, not style*/}
      {/* TODO: we'll replace the navigate here with .replace() once we have an actual auth system built*/}
      <Button containerStyle={styles.button} onPress={() => navigation.navigate('NavBar')}  title="Log in"/>
      <Button containerStyle={styles.button} type="outline" title="Sign up"/>

      {/* this empty view is included to keep the keyboard from covering up the very bottom of the view */}
      <View style={{height: 100}}/>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen

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