import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { AuthContext } from '../context/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from 'react-native-safe-area-context';


function ProfileScreen({navigation}) {

  const [state, setState] = useContext(AuthContext);

  const handleSignOutPressed = async () => {
    setState({ token: "", user: null });
    await AsyncStorage.removeItem("auth-rn");
    navigation.replace('SignIn');
  };
  
    return (
      <SafeAreaView style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: "#F0F4FF"}}>
        <Text>Profile</Text>
        <Button containerStyle={styles.button} onPress={() => handleSignOutPressed()} title="Sign Out"/>
      </SafeAreaView>
    );
  };

export default ProfileScreen;

const styles = StyleSheet.create({
  button: {
      width: 200,
      marginTop: 10,
  },
});