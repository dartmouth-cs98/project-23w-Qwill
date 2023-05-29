import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Keyboard } from 'react-native';
import { COLORS } from '../styles/colors';
import { Snackbar } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import ButtonBlue from '../components/ButtonBlue.components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { hasWhiteSpace, hasRestrictedChar } from '../helpers/stringValidation';
import axios from 'axios';
import findIP from '../helpers/findIP';


function ProfileScreen({navigation}) {

  const [userInfo, setUserInfo] = useContext(AuthContext);

  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bug, setBug] = useState('');

  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [bugModalVisible, setBugModalVisible] = useState(false);

  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);

  const handleSignOutPressed = async () => {
    setUserInfo({ token: "", user: null });
    await AsyncStorage.removeItem("auth-rn");
    navigation.navigate('SignIn');
  };

  const handleChangeName = async () => {
    if (userInfo.user.name == newName) {
      return;
    }

    try {
      resp = await axios.post(findIP() + "/api/changeName", {userID: userInfo.user._id, newName});
      if (!resp) {  // Could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // Another backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else {
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo, 
          user: {
            ...prevUserInfo.user,
            name: newName
          }
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleChangeUsername = async () => {
    if (userInfo.user.username == newUsername) {
      return;
    }

    // check username length
    if (newUsername.length > 30) {
      setSnackMessage("Username must be less than 30 characters");
      setSnackIsVisible(true);
      return;
    }

    // check for whitespace in a username
    if (hasWhiteSpace(newUsername) == true) {
      setSnackMessage("Your username cannot contain spaces");
      setSnackIsVisible(true);
      return;
    }

    // check for restricted characters in a username
    if (hasRestrictedChar(newUsername) == true) {
      setSnackMessage("Your username cannot contain a restricted character");
      setSnackIsVisible(true);
      return;
    }

    try {
      resp = await axios.post(findIP() + "/api/changeUsername", {userID: userInfo.user._id, newUsername});
      if (!resp) {  // Could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // Another backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else {
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo, 
          user: {
            ...prevUserInfo.user,
            username: newUsername
          }
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async () => {
    // check for all fields filled in
    if (oldPassword == "" || newPassword == "" || confirmPassword == "") {
      setSnackMessage("All fields are required");
      setSnackIsVisible(true);
      return;
    }

    // check that new password field matches confirm password field
    if (newPassword != confirmPassword) {
      setSnackMessage("Passwords must match");
      setSnackIsVisible(true);
      return;
    }

    try {
      resp = await axios.post(findIP() + "/api/changePassword", {userID: userInfo.user._id, oldPassword, newPassword});
      if (!resp) {  // Could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // Another backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else {
        setSnackMessage("Your password has been changed");
        setSnackIsVisible(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBugSubmit = async () => {
    // check for empty bugs
    if (bug.length < 8) {
      setSnackMessage("Bug reports must be longer than 8 characters");
      setSnackIsVisible(true);
      return;
    }

    try {
      resp = await axios.post(findIP() + "/api/reportBug", { bug });
      if (!resp) {  // Could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // Another backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else {
        setSnackMessage("Thank you for the report!");
        setSnackIsVisible(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const CustomSnackbar = () => {
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
      <Text style={styles.snackBarText}>{snackMessage}</Text>
    </Snackbar>
  }
  
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: "#F0F4FF"}}>
        <Modal animationType="slide" transparent={true} visible={nameModalVisible} onRequestClose={() => {setNameModalVisible(!nameModalVisible);}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setNameModalVisible(!nameModalVisible)}>
                <Ionicons style={styles.icon} name={'close-outline'} size={wp("10%")}></Ionicons>
              </TouchableOpacity>
              <Text style={styles.modalTitleText}>Change Name</Text>
              <TextInput
                style={styles.infoInput}
                placeholder="Type new name here..."
                multiline={true}
                textAlignVertical='top'
                textAlign='left'
                blurOnSubmit={true}
                value={newName}
                onChangeText={setNewName}
                autoCapitalize='none'
              />
              <ButtonBlue title={"Change name"} style={{marginTop: wp("5%")}} onPress={handleChangeName}/>
            </View>
          </View>
          <CustomSnackbar/>
        </Modal>

        <Modal animationType="slide" transparent={true} visible={usernameModalVisible} onRequestClose={() => {setUsernameModalVisible(!usernameModalVisible);}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setUsernameModalVisible(!usernameModalVisible)}>
                <Ionicons style={styles.icon} name={'close-outline'} size={wp("10%")}></Ionicons>
              </TouchableOpacity>
              <Text style={styles.modalTitleText}>Change Username</Text>
              <TextInput
                style={styles.infoInput}
                placeholder="Type new username here..."
                multiline={true}
                textAlignVertical='top'
                textAlign='left'
                blurOnSubmit={true}
                value={newUsername}
                onChangeText={setNewUsername}
                autoCapitalize='none'
              />
              <ButtonBlue title={"Change Username"} style={{marginTop: wp("5%")}} onPress={handleChangeUsername}/>
            </View>
          </View>
          <CustomSnackbar/>
        </Modal>

        <Modal animationType="slide" transparent={true} visible={passwordModalVisible} onRequestClose={() => {setPasswordModalVisible(!passwordModalVisible);}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setPasswordModalVisible(!passwordModalVisible)}>
                <Ionicons style={styles.icon} name={'close-outline'} size={wp("10%")}></Ionicons>
              </TouchableOpacity>
              <Text style={styles.modalTitleText}>Change Password</Text>
              <TextInput
                style={styles.infoInput}
                placeholder="Type current password..."
                multiline={true}
                textAlignVertical='top'
                textAlign='left'
                blurOnSubmit={true}
                value={oldPassword}
                onChangeText={setOldPassword}
                autoCapitalize='none'
              />
              <TextInput
                style={styles.infoInput}
                placeholder="Type new password..."
                multiline={true}
                textAlignVertical='top'
                textAlign='left'
                blurOnSubmit={true}
                value={newPassword}
                onChangeText={setNewPassword}
                autoCapitalize='none'
              />
              <TextInput
                style={styles.infoInput}
                placeholder="Confirm new password..."
                multiline={true}
                textAlignVertical='top'
                textAlign='left'
                blurOnSubmit={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize='none'
              />
              <ButtonBlue title={"Change Password"} style={{marginTop: wp("5%")}} onPress={handleChangePassword}/>
            </View>
          </View>
          <CustomSnackbar/>
        </Modal>

        <Modal animationType="slide" transparent={true} visible={bugModalVisible} onRequestClose={() => {setBugModalVisible(!bugModalVisible);}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setBugModalVisible(!bugModalVisible)}>
                <Ionicons style={styles.icon} name={'close-outline'} size={wp("10%")}></Ionicons>
              </TouchableOpacity>
              <Text style={styles.modalTitleText}>Report a Bug</Text>
              <TextInput
                style={styles.bugInput}
                placeholder="Type bug here..."
                multiline={true}
                textAlignVertical='top'
                textAlign='left'
                blurOnSubmit={true}
                value={bug}
                onChangeText={setBug}
                autoCapitalize='none'
              />
              <ButtonBlue title={"Report Bug"} style={{marginTop: wp("5%")}} onPress={handleBugSubmit}/>
            </View>
          </View>
          <CustomSnackbar/>
        </Modal>

        <View style={[styles.header, styles.shadowLight]}></View>
        <View style={{alignItems: 'flex-end'}}>
          <TouchableOpacity style={styles.btn} onPress={() => handleSignOutPressed()} title="Sign Out"><Text>Log Out</Text></TouchableOpacity>
        </View>
        <View style={{alignItems: 'center', marginBottom: hp("3%")}}>
          <View style={styles.profilePhotoBack}></View>
          <Text style={{marginTop: hp('1.08%'), fontWeight: "bold", fontSize: hp('1.94%')}}>
            {userInfo.user.username}
          </Text>
          <Text style={{marginTop: hp('1.08%'), fontWeight: "300", fontSize: hp('1.94%')}}>
            Joined Qwill in {userInfo.user.createdAt.substring(0,4)}
          </Text>
          {/* <View style={styles.lineLong}></View> */}
        </View>
        <View style={{flexDirection: 'row', marginBottom: hp("3%")}}>
          <Text style={styles.settingsText}>Settings</Text>
        </View>
        <View style={{flex: 1, marginBottom: hp('27.03%')}}>
          <TouchableOpacity style={styles.settingContainer} onPress={() => {setNameModalVisible(true); setSnackIsVisible(false);}}>
              <Ionicons
              style={{marginLeft: wp('4.67%')}}
              name={"person-outline"}
              size={hp('2.59%')}>
              </Ionicons>
              <Text style={styles.text}>Change Name</Text>
              <Ionicons
              style={{marginRight: wp('4.67%')}}
              name={"chevron-forward-outline"}
              size={hp('2.59%')}>
              </Ionicons>
            </TouchableOpacity>
          <TouchableOpacity style={styles.settingContainer} onPress={() => {setUsernameModalVisible(true); setSnackIsVisible(false);}}>
            <Ionicons
            style={{marginLeft: wp('4.67%')}}
            name={"person-circle-outline"}
            size={hp('2.59%')}>
            </Ionicons>
            <Text style={styles.text}>Change Username</Text>
            <Ionicons
            style={{marginRight: wp('4.67%')}}
            name={"chevron-forward-outline"}
            size={hp('2.59%')}>
            </Ionicons>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingContainer} onPress={() => {setPasswordModalVisible(true); setSnackIsVisible(false);}}>
            <Ionicons
            style={{marginLeft: wp('4.67%')}}
            name={"lock-closed-outline"}
            size={hp('2.59%')}>
            </Ionicons>
            <Text style={styles.text}>Change Password</Text>
            <Ionicons
            style={{marginRight: wp('4.67%')}}
            name={"chevron-forward-outline"}
            size={hp('2.59%')}>
            </Ionicons>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingContainer} onPress={() => {setBugModalVisible(true); setSnackIsVisible(false);}}>
            <Ionicons
            style={{marginLeft: wp('4.67%')}}
            name={"bug-outline"}
            size={hp('2.59%')}>
            </Ionicons>
            <Text style={styles.text}>Report a Bug</Text>
            <Ionicons
            style={{marginRight: wp('4.67%')}}
            name={"chevron-forward-outline"}
            size={hp('2.59')}>
            </Ionicons>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

export default ProfileScreen;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    backgroundColor: "#BDCCF2",
    width: wp("100%"),
    height: hp('34%')
  },
  shadowLight: {
    shadowColor: '#171717',
    shadowOffset: { height: hp(0.4) },
    shadowOpacity: 0.2,
    shadowRadius: hp(0.15),
  },
  btn: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: hp('1.3%'),
    paddingRight: wp('4.2%'),
    paddingBottom: hp('1.3%'),
    paddingLeft: wp('4.2%'),
    borderRadius: wp('2.3%'),
    borderWidth: wp('0.23%'),
    borderColor: "#737B7D",
    borderStyle: "solid",
    marginRight: wp('4.67%'),
    marginTop: hp('1.08%'),
    backgroundColor: "#E2E8F6",
  },
  btnText: {},
  profilePhotoBack: {
    // height: hp('12.96%'),
    width: wp('28.04%'),
    aspectRatio: 1,
    borderRadius: wp('14.02%'),
    backgroundColor: 'black',
  },
  lineLong: {
    width: wp('74.3%'),
    height: 0,
    borderWidth: wp('0.23%'),
    borderColor: "#737B7D",
    marginTop: hp('3.24%')
  },
  settingsText: {
    fontSize: wp('9.35%'), 
    fontWeight: '200',
    textAlign: 'right',
    marginLeft: wp('7%'),
    marginTop: hp('2.7%'),
    textDecorationLine: 'underline',
  },
  settingContainer: {
    width: wp('80%'),
    height: hp('6.48%'),
    flexDirection: "row",
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderColor: "#B9BCC3",
    borderWidth: wp('0.23%'),
    borderRadius: wp('2.3%'),
    marginVertical: hp('0.54%'),
    alignSelf: 'center',
    backgroundColor: "#E2E8F6",
  },
  text: {
    fontSize: wp('3.5%'),
    fontWeight: "300", 
    marginTop: hp('0.54%')
  },
  lineShort: {
    width: wp('75%'),
    height: 0,
    borderWidth: wp('0.23%'),
    borderColor: "#737B7D",
    marginLeft: wp('12.5%'),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22
  },
  modalView: {
    margin: wp('5%'),
    width: wp('90%'),
    backgroundColor: "#E2E8F6",
    borderRadius: wp('5%'),
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeButton: {
    position: 'absolute', 
    top: hp('3.5%'),
    left: wp('4%'),
    height: wp('10%'),
    width: wp('10%'),
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitleText: {
    fontSize: wp('6%'),
    fontWeight: "bold",
  },
  bugInput: {
    backgroundColor: 'white',
    height: wp('60%'),
    width: wp('80%'),  
    alignSelf: 'center',
    marginTop: wp('5%'),
    padding: wp('3%'),
    paddingTop: wp('3%'),
    borderRadius: wp('2%'),
    borderWidth: wp('0.15%'),
    borderColor: "grey",
  },
  infoInput: {
    backgroundColor: 'white',
    height: wp('10%'),
    width: wp('80%'),  
    alignSelf: 'center',
    marginTop: wp('5%'),
    padding: wp('3%'),
    paddingTop: wp('3%'),
    borderRadius: wp('2%'),
    borderWidth: wp('0.15%'),
    borderColor: "grey",
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
