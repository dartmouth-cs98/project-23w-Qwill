import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { AuthContext } from '../context/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const WINDOW_WIDTH = Dimensions.get('window').width;

function ProfileScreen({navigation}) {

  const [state, setState] = useContext(AuthContext);

  const handleSignOutPressed = async () => {
    setState({ token: "", user: null });
    await AsyncStorage.removeItem("auth-rn");
    navigation.replace('SignIn');
  };
  
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: "#F0F4FF"}}>
        <View style={{alignItems: 'flex-end'}}>
          <TouchableOpacity style={styles.btn} onPress={() => handleSignOutPressed()} title="Sign Out"><Text>Log Out</Text></TouchableOpacity>
        </View>
        <View style={{alignItems: 'center'}}>
          <View style={styles.profilePhotoBack}></View>
          <Text style={{marginTop: 10, fontWeight: "bold", fontSize: 18}}>Username123</Text>
          <Text style={{marginTop: 10, fontWeight: "300", fontSize: 18}}>Joined Qwill in 2019</Text>
          <View style={styles.lineLong}></View>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={styles.settingsText}>Settings</Text>
          </View>
        </View>
        <View style={{flex: 1, marginBottom: 250}}>
          <TouchableOpacity style={styles.settingContainer}>
            <Ionicons
            style={{marginLeft: 20}}
            name={"settings-outline"}
            size={24}>
            </Ionicons>
            <Text style={styles.text}>Your account</Text>
            <Ionicons
            style={{marginRight: 20}}
            name={"chevron-forward-outline"}
            size={24}>
            </Ionicons>
          </TouchableOpacity>
          <View style={styles.lineShort}></View>
          <TouchableOpacity style={styles.settingContainer}>
            <Ionicons
            style={{marginLeft: 20}}
            name={"notifications-outline"}
            size={24}>
            </Ionicons>
            <Text style={styles.text}>Notifications</Text>
            <Ionicons
            style={{marginRight: 20}}
            name={"chevron-forward-outline"}
            size={24}>
            </Ionicons>
          </TouchableOpacity>
          <View style={styles.lineShort}></View>
          <TouchableOpacity style={styles.settingContainer}>
            <Ionicons
            style={{marginLeft: 20}}
            name={"eye-outline"}
            size={24}>
            </Ionicons>
            <Text style={styles.text}>Display</Text>
            <Ionicons
            style={{marginRight: 20}}
            name={"chevron-forward-outline"}
            size={24}>
            </Ionicons>
          </TouchableOpacity>
          <View style={styles.lineShort}></View>
          <TouchableOpacity style={styles.settingContainer}>
            <Ionicons
            style={{marginLeft: 20}}
            name={"help-circle-outline"}
            size={24}>
            </Ionicons>
            <Text style={styles.text}>Help</Text>
            <Ionicons
            style={{marginRight: 20}}
            name={"chevron-forward-outline"}
            size={24}>
            </Ionicons>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

export default ProfileScreen;

const styles = StyleSheet.create({
  btn: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    paddingRight: 18,
    paddingBottom: 12,
    paddingLeft: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#737B7D",
    borderStyle: "solid",
    marginRight: 20,
    marginTop: 10
  },
  btnText: {},
  profilePhotoBack: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: 'black',
  },
  lineLong: {
    width: 318,
    height: 0,
    borderWidth: 1,
    borderColor: "#737B7D",
    marginTop: 30
  },
  settingsText: {
    fontSize: 40, 
    fontWeight: '200',
    textAlign: 'right',
    marginLeft: 30,
    marginTop: 25
  },
  settingContainer: {
    width: WINDOW_WIDTH,
    height: 60,
    flexDirection: "row",
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  text: {
    fontSize: 15,
    fontWeight: "300", 
    marginTop: 5
  },
  lineShort: {
    width: 290,
    height: 0,
    borderWidth: 1,
    borderColor: "#737B7D",
    marginLeft: 68,
  },
});