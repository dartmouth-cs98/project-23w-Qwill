import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

function ProfileScreen({navigation}) {

  const [state, setState] = useContext(AuthContext);

  const handleSignOutPressed = async () => {
    setState({ token: "", user: null });
    await AsyncStorage.removeItem("auth-rn");
    navigation.navigate('SignIn');
  };
  
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: "#F0F4FF"}}>
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
          <TouchableOpacity style={styles.settingContainer}>
            <Ionicons
            style={{marginLeft: wp('4.67%')}}
            name={"settings-outline"}
            size={hp('2.59%')}>
            </Ionicons>
            <Text style={styles.text}>Your account</Text>
            <Ionicons
            style={{marginRight: wp('4.67%')}}
            name={"chevron-forward-outline"}
            size={hp('2.59%')}>
            </Ionicons>
          </TouchableOpacity>
          <View style={styles.lineShort}></View>
          <TouchableOpacity style={styles.settingContainer}>
            <Ionicons
            style={{marginLeft: wp('4.67%')}}
            name={"notifications-outline"}
            size={hp('2.59%')}>
            </Ionicons>
            <Text style={styles.text}>Notifications</Text>
            <Ionicons
            style={{marginRight: wp('4.67%')}}
            name={"chevron-forward-outline"}
            size={hp('2.59%')}>
            </Ionicons>
          </TouchableOpacity>
          <View style={styles.lineShort}></View>
          <TouchableOpacity style={styles.settingContainer}>
            <Ionicons
            style={{marginLeft: wp('4.67%')}}
            name={"eye-outline"}
            size={hp('2.59%')}>
            </Ionicons>
            <Text style={styles.text}>Display</Text>
            <Ionicons
            style={{marginRight: wp('4.67%')}}
            name={"chevron-forward-outline"}
            size={hp('2.59')}>
            </Ionicons>
          </TouchableOpacity>
          <View style={styles.lineShort}></View>
          <TouchableOpacity style={styles.settingContainer}>
            <Ionicons
            style={{marginLeft: wp('4.67%')}}
            name={"help-circle-outline"}
            size={hp('2.59')}>
            </Ionicons>
            <Text style={styles.text}>Help</Text>
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
    marginTop: hp('2.7%')
  },
  settingContainer: {
    width: wp('100%'),
    height: hp('6.48%'),
    flexDirection: "row",
    justifyContent: 'space-between', 
    alignItems: 'center'
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
});
