import { Text, View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import React, { useState, useContext, useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from 'react-native-elements'
import { AuthContext } from '../../context/AuthContext';
//import styles from '../../styles/Profile.component.style.js';
import COLORS from '../../styles/colors';
import { hasRestrictedChar, truncate } from '../../helpers/stringValidation';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import AddFriendButton from '../../components/AddFriendButton';
import PendingFriendButton from '../../components/PendingFriendButton';


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
      const resp = await axios.post(findIP()+"/api/getIncomingFriendReqs", { userID });
      
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
      const resp = await axios.post(findIP()+"/api/matchUsers", 
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
      const resp = await axios.post(findIP()+"/api/acceptFriendRequest", { friendReqID: item._id });

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
      const resp = await axios.post(findIP()+"/api/deleteFriendRequest", { friendReqID: item._id });

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
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: "center"}}
          data={pendingFriends}
          extraData={extraData}
          numColumns={1}
          renderItem={
            ({item, index}) => <PendingFriendButton 
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
        resp = await axios.post(findIP()+"/api/sendFriendRequest", { senderID: userID, recipientID: item._id });
        msg = "Request Sent!"
      } else {
        resp = await axios.post(findIP()+"/api/deleteFriendRequest", { friendReqID: item.friend._id });
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
      return <Text style={{ textAlign: 'center' }}>No users found</Text>
    }
    return (
      <View style={styles.suggestionsContainer}>
        <FlatList
          nestedScrollEnabled
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: "center"}}
          data={matchingUsers}
          extraData={extraData}
          numColumns={1}
          renderItem={
            ({item, index}) => <AddFriendButton 
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
    <SafeAreaView style={{ flexDirection: 'column', flex: 1, alignItems: 'left', marginTop: 20 }}>
      <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back"} size={40} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Add Friends</Text>
      </View>
      <View style={styles.inputContainer}>
        <Input
          placeholder="enter name or username"
          autoCapitalize="none"
          onChangeText={handleChangeText}
          inputContainerStyle={{ borderBottomWidth: 0, backgroundColor: 'white', height: 32, borderRadius: 5 }}
          leftIcon={{type: 'font-awesome', name: 'search', size: 15, marginLeft: 10}}
        />
        <Text style={styles.subtitleText}>Pending - {pendingFriends.length}</Text>
        { 
          pendingFriends.length == 0 ? (
            <View style={{flex: 2, padding: '0%', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.noMatchingUsers}>
                You don't have any incoming friend requests.
              </Text>
            </View> 
          ) : (  // at least one pending friend request
            <View style={{flex: 1, alignItems: 'center'}}>
              {renderPendingFriends()}
            </View>
          )
        }
        <View style={styles.line}></View>
        <Text style={styles.subtitleText}>Suggestions</Text>
        <View styles={{flex: 1}}>
          {renderAddFriends()}
        </View> 
        <View style={styles.line}></View>
        <Text style={styles.subtitleText}>Share Your Qwill Link</Text>
        <View style={styles.line}></View>
        <Text style={styles.subtitleText}>Copy Qwill Link</Text>
      </View>
    </SafeAreaView>
  );
};

export default AddFriendsScreen;

const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'JosefinSansBold',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: 30,
    marginTop: 5
  },
  subtitleText: {
    fontFamily: 'JosefinSans',
    fontSize: 20,
    textAlign: 'left',
    flex: 1,
    marginTop: 5,
    marginBottom: 5
  },
  inputContainer: {
    flexDirection: 'column', 
    flex: 15,
    width: 350,
    marginLeft: 45,
    marginTop: 10,
    justifyContent: 'center'
  },
  suggestionsContainer: {
    width: "100%",
  },
  line: {
    marginTop: 15,
    marginBottom: 15,
    borderBottomColor: COLORS.blue400,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  noMatchingUsers: {
    fontFamily: 'JosefinSansBold',
    width: 150,
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 20,
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    letterSpacing: 0.3,
    color: COLORS.black
  },
})
