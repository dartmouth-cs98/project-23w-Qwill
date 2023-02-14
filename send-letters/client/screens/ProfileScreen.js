import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { AuthContext } from '../context/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";


function ProfileScreen({navigation}) {

  const [state, setState] = useContext(AuthContext);

  const handleSignOutPressed = async () => {
    setState({ token: "", user: null });
    await AsyncStorage.removeItem("auth-rn");
    navigation.replace('SignIn');
  };
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile</Text>
        <Button containerStyle={styles.button} onPress={() => handleSignOutPressed()} title="Sign Out"/>
      </View>
    );
  };

export default ProfileScreen;

const styles = StyleSheet.create({
  button: {
      width: 200,
      marginTop: 10,
  },
});