const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import { AuthContext } from '../../context/AuthContext';
import { hasRestrictedChar } from '../../helpers/stringValidation';
import { Input } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TouchableOpacity, FlatList, StyleSheet, Dimensions, PixelRatio, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AddFriendButton from '../../components/AddFriendButton';
import axios from 'axios';
import COLORS from '../../styles/colors';
import findIP from '../../helpers/findIP';
import Ionicons from '@expo/vector-icons/Ionicons';
import PendingFriendButton from '../../components/PendingFriendButton';
import React, { useState, useContext, useEffect } from 'react'

const scale = windowWidth / 390; // Scale factor for font size on 390 width screen

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};


const AddFriendsScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useContext(AuthContext);
  const userID = userInfo.user._id;
  const [pendingFriends, setPendingFriends] = useState("");
  const [matchingUsers, setMatchingUsers] = useState("");
  const [text, setText] = useState("");
  const isFocused = useIsFocused();

  const [extraData, setExtraData] = React.useState(new Date());

  // snackbar
  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);

  // fetch any pending friend requests from the server
  useEffect(() => {
    loadPendingFriends();
    // handleChangeText("");
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

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };


  const handleChangeText = async (text) => {
    const textToMatch = text.toLowerCase();
    setText(textToMatch);

    if (hasRestrictedChar(text)) { setMatchingUsers([]); return; }

    try {
      const resp = await axios.post(findIP() + "/api/matchUsers",
        { senderID: userID, textToMatch, nonFriends: true, pendingFriends: true, hideIncoming: true }
      );

      if (!resp) {
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {
        console.error(resp.data.error);
      } else if (!resp.data || !resp.data.matchingUsers) {
        console.error("Error: the response does not contain the expected fields");
      } else {
        setMatchingUsers(resp.data.matchingUsers);
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleAcceptFriendPressed = async (item, index) => {
    try {
      const resp = await axios.post(findIP() + "/api/acceptFriendRequest", { friendReqID: item._id });

      if (!resp) {
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {
        console.error(resp.data.error);
      } else {
        loadPendingFriends();
        setSnackMessage("Friend request approved!");
        setSnackIsVisible(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineFriendPressed = async (item, index) => {
    try {
      const resp = await axios.post(findIP() + "/api/deleteFriendRequest", { friendReqID: item._id });

      if (!resp) {
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {
        console.error(resp.data.error);
      } else {
        loadPendingFriends();
        setSnackMessage("Friend request declined!");
        setSnackIsVisible(true);
      }
    } catch (err) {
      console.error(err);
    }
  };


  function renderPendingFriends() {
    if (pendingFriends.length == 0) {
      return <Text style={{ textAlign: 'center' }}>No pending requests found</Text>
    }
    return (
      <View style={styles.suggestionsContainer}>
        <FlatList
          nestedScrollEnabled
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: "center" }}
          data={pendingFriends}
          extraData={extraData}
          numColumns={1}
          renderItem={
            ({ item, index }) => <PendingFriendButton
              userInfo={item}
              onAcceptPressed={() => handleAcceptFriendPressed(item, index)}
              onDeclinePressed={() => handleDeclineFriendPressed(item, index)}
            />
          }
          keyExtractor={item => item._id}
        />
      </View>
    );
  };


  const handleAddFriendPressed = async (item, index) => {
    try {
      let resp = false;
      let msg;

      if (item.friendStatus == "non-friends") {
        resp = await axios.post(findIP() + "/api/sendFriendRequest", { senderID: userID, recipientID: item._id });
        msg = "Request Sent!"
      } else {
        resp = await axios.post(findIP() + "/api/deleteFriendRequest", { friendReqID: item.friend._id });
        msg = "Request unsent"
      }

      if (!resp) {
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {
        console.error(resp.data.error);
      } else {
        handleChangeText(text); //TODO: figure out if there is a way to use extradata to update component faster / without server call
        setSnackMessage(msg);
        setSnackIsVisible(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  function renderAddFriends() {
    if (matchingUsers.length == 0) {
      return <Text style={{ textAlign: 'center', fontSize: wp('3.6%') }}>No users found</Text>
    }
    return (
      <View style={styles.suggestionsContainer}>
        <FlatList
          nestedScrollEnabled
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: "center" }}
          data={matchingUsers}
          extraData={extraData}
          numColumns={1}
          renderItem={
            ({ item, index }) => <AddFriendButton
              userInfo={item}
              onPress={() => handleAddFriendPressed(item, index)}
            />
          }
          keyExtractor={item => item._id}
        />
      </View>
    );
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.header, styles.shadowLight]}></View>
      <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: windowHeight * .02 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons style={{ paddingLeft: wp('3%') }} name={"arrow-back"} size={normalize(40)} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Add Friends</Text>
      </View>
      <View style={{ alignItems: 'center', marginBottom: windowHeight * .07 }}>
        <View style={styles.inputContainer}>
          <Input
            placeholder=" enter name or username"
            autoCapitalize="none"
            onChangeText={handleChangeText}
            inputStyle={{ fontSize: wp("4%") }}
            inputContainerStyle={{ borderBottomWidth: 0, backgroundColor: 'white', height: hp('4%'), borderRadius: 5 }}
            leftIcon={{ type: 'font-awesome', name: 'search', size: hp('2.5%'), marginLeft: hp('1.7%') }}
          />
        </View>
      </View>

      <View style={{ flex: 2, marginTop: hp("2%") }}>
        <Text style={styles.subtitleText}>Suggestions</Text>
        <View styles={{ flex: 2 }}>
          {renderAddFriends()}
        </View>
        <View style={styles.line}></View>

        {
          pendingFriends.length === 0 ? (
            <View>
              <Text style={styles.subtitleText}> No Pending Friend Requests </Text>
              <Text style={{textAlign: 'center', fontSize: wp('3%')}}> Search and add some friends! </Text>
            </View>
          ) : pendingFriends.length === 1 ? (
            // render when only one pending friend
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.subtitleText}>{pendingFriends.length} One Pending Friend Request </Text>
              {renderPendingFriends()}
            </View>

          ) : (
            // render when more than one pending friend
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.subtitleText}>{pendingFriends.length} Pending Friend Requests </Text>
              {renderPendingFriends()}
            </View>


          )
        }

      </View>

    </SafeAreaView>
  );
};

export default AddFriendsScreen;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    backgroundColor: "#BDCCF2",
    width: "100%",
    height: hp('21%')
  },
  shadowLight: {
    shadowColor: '#171717',
    shadowOffset: { height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  titleText: {
    fontFamily: 'JosefinSansBold',
    fontSize: wp('10%'),
    fontWeight: 'bold',
    flex: 1,
    marginTop: hp('1%'),
    marginLeft: wp('3%'),
  },
  subtitleText: {
    fontFamily: 'JosefinSans',
    fontSize: wp("5%"),
    textAlign: 'left',
    marginVertical: hp('1%'),

    marginLeft: wp('4%')
  },
  inputContainer: {
    width: wp('90%'),
    height: hp('78%'),
    borderRadius: hp('2%'),
    marginTop: hp('2%'),
    flex: 1,
  },
  suggestionsContainer: {
    width: "100%",
  },
  line: {
    marginTop: hp('1.5%'),
    marginBottom: hp('1.5%'),
    borderBottomColor: COLORS.blue400,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "90%",
    alignSelf: 'center'
  },
  noMatchingUsers: {
    fontFamily: 'JosefinSans',
    width: wp('80%'),
    fontStyle: "normal",
    fontWeight: "200",
    fontSize: hp('2.5%'),
    lineHeight: hp('2.5%'),
    display: "flex",
    textAlign: "center",
    letterSpacing: 0.3,
    color: COLORS.black
  },
  icon: {
    display: "flex",
    alignItems: "center",
    color: COLORS.black,
    marginLeft: wp('2%')
  }
});