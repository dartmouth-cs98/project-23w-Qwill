import { AuthContext } from '../../context/AuthContext';
import { hasRestrictedChar } from '../../helpers/stringValidation';
import { Input } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Dimensions, PixelRatio } from 'react-native';
import { truncate } from '../../helpers/stringValidation';
import { useIsFocused } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import ButtonBlue from '../../components/ButtonBlue.components';
import COLORS from '../../styles/colors';
import findIP from '../../helpers/findIP';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useContext, useEffect } from 'react'

const scale = wp('100%') / 390; // Scale factor for font size on 390 width screen

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export default function HomeFriendsScreen({ navigation }) {
  const [userInfo, setUserInfo] = useContext(AuthContext);
  const [matchingUsers, setMatchingUsers] = useState("");
  const [pendingFriends, setPendingFriends] = useState("");

  const [text, onChangeText] = useState("");
  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const isFocused = useIsFocused();

  const userID = userInfo.user._id;

  // fetch any pending friend requests from the server
  useEffect(() => {
    handleChangeText("");
    loadPendingFriends();
  }, [isFocused]);

  const loadPendingFriends = async () => {
    try {
      const resp = await axios.post(findIP() + "/api/getIncomingFriendReqs", { userID });

      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        console.error(error);
      } else if (!resp.data || !resp.data.incomingFriendReqs) {
        console.error("Error: the response does not contain the expected fields");
      } else {
        setPendingFriends(resp.data.incomingFriendReqs);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleChangeText = async (text) => {
    const textToMatch = text.toLowerCase();
    const senderID = userInfo.user._id;

    if (hasRestrictedChar(text)) { setMatchingUsers([]); return; }

    try {
      const resp = await axios.post(findIP()+"/api/matchUsers", { senderID, textToMatch, friends: true, returnSelf: true });
      if (!resp) {
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else if (!resp.data || !resp.data.matchingUsers) {
        console.error("Error: the response does not contain the expected fields");
      } else {
        setMatchingUsers(resp.data.matchingUsers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFriendPressed = async (item, index) => {
    try {
      navigation.navigate('FriendHistoryScreen', { item: item });
    } catch (err) {
      console.error(err);
    }
  };

  function renderMatches() {
    if (matchingUsers.length == 0) {
      return
    }
    return (
      <View>
        <FlatList
          nestedScrollEnabled
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: "center" }}
          data={matchingUsers}
          numColumns={3}
          renderItem={({ item, index }) =>
            <View>
              <TouchableOpacity style={styles.friendCircle} onPress={() => handleFriendPressed(item, index)} title={item.username}>
                <Text style={styles.friendMidText} allowFontScaling={false}>{item.name.replace(/["]/g, '')[0]}</Text>
              </TouchableOpacity>
              <Text style={{ textAlign: 'center', fontSize: wp("3%") }} allowFontScaling={false}>
                {truncate(item.username.replace(/["]/g, ''), 10)}
              </Text>
            </View>
          }
          keyExtractor={item => item.username}
        />
      </View>
    );
  };

  const renderPendingIcon = () => {
    if (pendingFriends.length != 0) {
      return (
        <View style={styles.pendingIcon}>
          <Text style={styles.pendingText} allowFontScaling={false}>{pendingFriends.length}</Text>
        </View>
      );
    }
  }

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      <View style={[styles.header, styles.shadowLight]}></View>
      <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: hp('100%') *.02 }}>
        <Text style={styles.titleText} allowFontScaling={false}>Friends</Text>
        <TouchableOpacity style={styles.btn} onPress={() => { navigation.navigate("AddFriendsScreen") }}>
          {renderPendingIcon()}
          <Ionicons name="person-add-outline" size={wp("10%")} ></Ionicons>
        </TouchableOpacity>
      </View>
        <View style={styles.recipientsContainer}>
          <View style={styles.inputContainer }>
            <Input
              placeholder=" enter name or username"
              autoCompleteType="email"
              autoCapitalize="none"
              onChangeText={handleChangeText}
              inputStyle={{ fontSize: wp("4%") }}
              inputContainerStyle={{ borderBottomWidth: 0, backgroundColor: 'white', height: hp('4%'), borderRadius: 5}}
              leftIcon={{ type: 'font-awesome', name: 'search', size: hp('2.5%'), marginLeft: hp('1.7%')}}
              allowFontScaling={false}
            />
          </View>
        <View>
          {renderMatches()}
        </View>
        <View style={styles.line}/>
        <ButtonBlue marginTop={20} fontSize={wp('3.5%')} title="Don’t see your friend? Add new friends here!" onPress={() => navigation.navigate("AddFriendsScreen")}/>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  header: {
    position: "absolute",
    backgroundColor: "#BDCCF2",
    width: "100%",
    height: hp('21%')
  },
  shadowLight: {
    shadowColor: '#171717',
    shadowOffset: {height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  searchIcon: {
    padding: wp('2%'),
  },
  input: { 
    borderBottomWidth: 0,
    backgroundColor: 'white',
    height: hp('2.5%'), borderRadius: 5 
  },
  titleText: {
    fontFamily: 'JosefinSansBold',
    fontSize: normalize(50),
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: wp('4%'),
    marginTop: hp('0.8%')
  },
  btn: {
    width: wp('18%'),
  },
  profilePicture: {
    height: normalize(56),
    width: normalize(56),
    borderRadius: 28,
    backgroundColor: "#000000",
    position: "absolute",
    left: wp('4.62%'),
    top: hp('1.1%')
  },
  username: {
    fontSize: normalize(11),
    position: "absolute",
    top: hp('7.2%'),
    left: wp('4.62%')
  },
  letterContainer: {
    position: "absolute",
    left: wp('25.64%'),
    top: 0
  },
  button: {
    width: wp('51.28%'),
    marginTop: hp('1.25%'),
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: 'white',
  },
  scrollView: {
    height: hp('20%'),
  },
  recipientsContainer: {
    width: wp('89.74%'),
    height: hp('63.46%'),
    borderRadius: 20,
    marginTop: hp('1.25%'),
    flex: 1,
    alignContent: "center"
  },
  friendCircle: {
    height: wp('18%'),
    width: wp('18%'),
    borderRadius: wp('18%'),
    backgroundColor: COLORS.profilebackground,
    marginTop: hp('1.92%'),
    marginLeft: wp('3.85%'),
    marginRight: wp('3.85%'),
    marginBottom: hp('0.64%'),
    justifyContent: "center",
    
  },
  selectTitleText: {
    fontSize: normalize(35),
    fontWeight: "400",
    justifyContent: "center",
    textAlign: 'center',
    marginTop: hp('1.25%'),
  },
  inputContainer: {
    marginLeft: wp('1.28%'),
    justifyContent: 'center', 
    alignItems: "center"
  },
  friendMidText: {
    textAlign: "center",
    fontSize: normalize(20),
    color: "#1E4693",
    opacity: 1,
    fontWeight: "600"
  },
  line: {
    marginTop: hp('1.25%'),
    borderBottomColor: COLORS.blue400,
    borderBottomColor: COLORS.blue400,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pendingIcon: {
    position: "absolute",
    width: wp('4%'),
    aspectRatio: 1,
    backgroundColor: "#FF0000",
    borderRadius: wp('4%'),
    zIndex: 1,
    justifyContent: "center",
    left: wp('7%'),
    top: hp('-0.4%')
  },
  pendingText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: wp('3.5%'),
    fontWeight: "bold",
  }
});