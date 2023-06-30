import { AuthContext } from '../../context/AuthContext';
import { Image, Text } from 'react-native-elements';
import { Snackbar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, KeyboardAvoidingView, Keyboard } from 'react-native'
import { TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import ButtonPrimary from '../../components/ButtonPrimary';
import findIP from '../../helpers/findIP';
import React, { useState, useContext } from 'react'

// You can get the navigation stack as a prop
// Later down in the code you can see the use of the function "navigation.navigate("name of screen")"
const SignInScreen = ({ navigation }) => {

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
      Keyboard.dismiss();
      setSnackMessage("All fields are required");
      setSnackIsVisible(true);
      return;
    }

    try {
      const resp = await axios.post(findIP() + "/api/signIn", { emailUsername, password });

      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        Keyboard.dismiss();
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        setSnackMessage(resp.data.error);
        Keyboard.dismiss();
        setSnackIsVisible(true);
      } else {
        setState(resp.data);
        await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data));
        navigation.navigate('NavBar');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignUpPressed = () => {
    navigation.replace('SignUp');
  };

  // KeyboardAvoidingView:
  // This component will automatically adjust its height, position, or bottom padding based on the 
  // keyboard height to remain visible while the virtual keyboard is displayed.
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <View style={{ width: "70%",  alignSelf: 'center' }}>
        <Image
          style={{
            height: undefined,
            width: '100%',
            aspectRatio: 1,
            resizeMode: "contain",
          }}
          source={require('../../assets/logo.png')}
        />
        <Text style={styles.text} allowFontScaling={false}> Send Letters.</Text>
      </View>
      <View style={styles.inputContainer}>
        {/* autofocus automatically focuses the app on this input */}
        <TextInput
          style={styles.inputField}
          placeholder="Email/Username"
          autoCorrect={false}
          // autoCompleteType="email"
          autoCapitalize="none"
          onChangeText={text => setEmailUsername(text.toLowerCase())}
          allowFontScaling={false}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          secureTextEntry={true}
          type="password"
          autoCompleteType="password"
          onChangeText={text => setPassword(text)}
          onSubmitEditing={handleSignInPressed}
          allowFontScaling={false}
        />
      </View>

      <View style={{marginTop: hp('3%')}}>
        <ButtonPrimary selected={true} onPress={() => handleSignInPressed()} title="Log in" />
        <ButtonPrimary selected={false} onPress={() => handleSignUpPressed()} type="outline" title="Sign up" marginTop={5} />
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
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
const styles = StyleSheet.create({
  inputField: {
    backgroundColor: '#E2E8F6',
    borderRadius: hp('3.2%'),
    padding: hp('2%'),
    margin: hp('0.8%'),
    fontSize: hp('2%')
  },
  inputContainer: {
    width: wp('70%')
  },
  text: {
    fontFamily: 'JosefinSans',
    fontSize: hp('3.5%'),
    textAlign: 'center',
    marginBottom: hp('1%'),
    marginTop: 0
  },
  button: {
    width: wp('40%'),
    marginTop: hp('2%'),
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: wp('4%'),
    backgroundColor: '#F0F4FF',
  },
  imageWithShadow: {
    width: wp('50%'),
    height: wp('50%'),
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: hp('0.1%') },
    shadowOpacity: 0.8,
    shadowRadius: wp('0.5%'),
  },
});