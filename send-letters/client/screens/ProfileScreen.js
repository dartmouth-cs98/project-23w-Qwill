import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Keyboard } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import ButtonBlue from '../components/ButtonBlue.components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

function ProfileScreen({navigation}) {

  const [state, setState] = useContext(AuthContext);

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bug, setBug] = useState('');

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [bugModalVisible, setBugModalVisible] = useState(false);

  const handleSignOutPressed = async () => {
    setState({ token: "", user: null });
    await AsyncStorage.removeItem("auth-rn");
    navigation.navigate('SignIn');
  };

  const handleChangeUsername = () => {
    return
  };

  const handleChangePassword = () => {
    return
  };

  const handleBugSubmit = () => {
    return
  };
  
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: "#F0F4FF"}}>
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
              />
              <ButtonBlue title={"Change Username"} style={{marginTop: wp("5%")}} onPress={handleChangeUsername}></ButtonBlue>
            </View>
          </View>
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
                placeholder="Type new password..."
                multiline={true}
                textAlignVertical='top'
                textAlign='left'
                blurOnSubmit={true}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={styles.infoInput}
                placeholder="Confirm Password..."
                multiline={true}
                textAlignVertical='top'
                textAlign='left'
                blurOnSubmit={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <ButtonBlue title={"Change Password"} style={{marginTop: wp("5%")}} onPress={handleChangePassword}></ButtonBlue>
            </View>
          </View>
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
              />
              <ButtonBlue title={"Report Bug"} style={{marginTop: wp("5%")}} onPress={handleBugSubmit}></ButtonBlue>
            </View>
          </View>
        </Modal>
        <View style={{alignItems: 'flex-end'}}>
          <TouchableOpacity style={styles.btn} onPress={() => handleSignOutPressed()} title="Sign Out"><Text>Log Out</Text></TouchableOpacity>
        </View>
        <View style={{alignItems: 'center'}}>
          <View style={styles.profilePhotoBack}></View>
          <Text style={{marginTop: hp('1.08%'), fontWeight: "bold", fontSize: hp('1.94%')}}>
            {state.user.username}
          </Text>
          <Text style={{marginTop: hp('1.08%'), fontWeight: "300", fontSize: hp('1.94%')}}>
            Joined Qwill in {state.user.createdAt.substring(0,4)}
          </Text>
          <View style={styles.lineLong}></View>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={styles.settingsText}>Settings</Text>
          </View>
        </View>
        <View style={{flex: 1, marginBottom: hp('27.03%')}}>
          <TouchableOpacity style={styles.settingContainer} onPress={() => setUsernameModalVisible(true)}>
            <Ionicons
            style={{marginLeft: wp('4.67%')}}
            name={"person-outline"}
            size={hp('2.59%')}>
            </Ionicons>
            <Text style={styles.text}>Change Username</Text>
            <Ionicons
            style={{marginRight: wp('4.67%')}}
            name={"chevron-forward-outline"}
            size={hp('2.59%')}>
            </Ionicons>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingContainer} onPress={() => setPasswordModalVisible(true)}>
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
          <TouchableOpacity style={styles.settingContainer} onPress={() => setBugModalVisible(true)}>
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
    marginTop: hp('1.08%')
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
  },
  settingContainer: {
    width: wp('80%'),
    height: hp('6.48%'),
    flexDirection: "row",
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderColor: "#black",
    borderWidth: wp('0.23%'),
    borderRadius: wp('2.3%'),
    marginVertical: hp('0.54%'),
    alignSelf: 'center'
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
});
