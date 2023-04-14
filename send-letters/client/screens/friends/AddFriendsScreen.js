

import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useContext } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from 'react-native-elements'
import { AuthContext } from '../../context/auth';
//import styles from '../../styles/Profile.component.style.js';
import COLORS from '../../styles/colors';

const handleGoBack = () => {
  setLetterInfo({
    text: "",
    recipientID: 0,
    recipientUsername: "",
    themeID: "",
    fontID: ""
  });
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    navigation.navigate('Home');
  }
};

const AddFriendsScreen = ({ navigation }) => {
  const [state, setState] = useContext(AuthContext);
  const [matchingUsers, setMatchingUsers] = useState("");
  const [pendingRequests, setPendingRequests] = useState(""); //todo
  const [text, onChangeText] = React.useState("");

  const handleChangeText = async (text) => {
    const newText = text.toLowerCase();
    const senderID = state.user._id;
    
    if (hasRestrictedChar(text)) { setMatchingUsers([]); return; }
    
    try {
      const resp = await axios.post(findIP() + "/api/matchRecipient", { senderID, newText });
      if (!resp) {
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {
        console.error(error);
      } else if (!resp.data || !resp.data.matchingUsers) {
        console.error("Error: the response does not contain the expected fields");
      } else {
        setMatchingUsers(resp.data.matchingUsers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  function renderMatches() {
    if (matchingUsers.length == 0) {
      return <Text style={{ textAlign: 'center' }}>No users found</Text>
    }
    return (
      <View>
        <FlatList
          nestedScrollEnabled
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: "center" }}
          data={matchingUsers}
          numColumns={3}
          renderItem={({ item }) =>
            <View>
              <TouchableOpacity style={styles.friendCircle} onPress={() => handleNextPressed(item)} title={JSON.stringify(item.username)}>
                <Text style={styles.friendMidText}>{truncate(JSON.stringify(item.name)).replace(/["]/g, '')[0]}</Text>
              </TouchableOpacity>
              <Text style={{ textAlign: 'center', fontSize: 12 }}>
                {(truncate((JSON.stringify(item.username)).replace(/["]/g, ''), 10))}
              </Text>
            </View>
          }
          keyExtractor={item => item.username}
        />
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flexDirection: 'column', flex: 1, alignItems: 'left', marginTop: 20 }}>
      <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back"} size={40} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Add Friends</Text>
      </View>
      <View style={styles.inputContainer}>
        <Input
          placeholder="enter name or username"
          autoCompleteType="email"
          autoCapitalize="none"
          onChangeText={handleChangeText}
          inputContainerStyle={{ borderBottomWidth: 0, backgroundColor: 'white', height: 32, borderRadius: 5 }}
          leftIcon={{type: 'font-awesome', name: 'search', size: 15, marginLeft: 10}}
        />
        <Text style={styles.subtitleText}>Pending - </Text>
        <View style={styles.line}></View>
        <Text style={styles.subtitleText}>Suggestions</Text>
        <View style={styles.line}></View>
        <Text style={styles.subtitleText}>Share Your Qwill Link</Text>
        <View style={styles.line}></View>
        <Text style={styles.subtitleText}>Copy Qwill Link</Text>
      </View>
      {/* <View><Text style={styles.subtitleText}>Pending - </Text></View> */}
    </SafeAreaView>
  )
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
    flex: 1,
    width: 350,
    marginLeft: 45,
    marginTop: 10,
    justifyContent: 'center'
  },
  line: {
    marginTop: 15,
    marginBottom: 15,
    borderBottomColor: COLORS.blue400,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})
