import { AuthContext } from '../../context/AuthContext';
import { hasRestrictedChar } from '../../helpers/stringValidation';
import { Input } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Dimensions, PixelRatio } from 'react-native';
import { truncate } from '../../helpers/stringValidation';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import ButtonBlue from '../../components/ButtonBlue.components';
import COLORS from '../../styles/colors';
import findIP from '../../helpers/findIP';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useContext, useEffect } from 'react'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const scale = windowWidth / 390; // Scale factor for font size on 390 width screen

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export default function HomeFriendsScreen({ navigation }) {
  const [userInfo, setUserInfo] = useContext(AuthContext);
  const [matchingUsers, setMatchingUsers] = useState("");

  const [text, onChangeText] = useState("");
  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const isFocused = useIsFocused();

  // fetch any pending friend requests from the server
  useEffect(() => {
    handleChangeText("");
  }, [isFocused]);

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
                <Text style={styles.friendMidText}>{item.name.replace(/["]/g, '')[0]}</Text>
              </TouchableOpacity>
              <Text style={{ textAlign: 'center', fontSize: 12 }}>
                {truncate(item.username.replace(/["]/g, ''), 10)}
              </Text>
            </View>
          }
          keyExtractor={item => item.username}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      <View style={[styles.header, styles.shadowLight]}></View>
      <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: windowHeight *.02 }}>
        <Text style={styles.titleText}>Friends</Text>
        <TouchableOpacity style={styles.btn} onPress={() => { navigation.navigate("AddFriendsScreen") }}>
          <Ionicons name="person-add-outline" size={normalize(40)} ></Ionicons>
        </TouchableOpacity>
      </View>
        <View style={styles.recipientsContainer}>
          <View style={styles.inputContainer}>
            <Input
              placeholder=" enter name or username"
              autoCompleteType="email"
              autoCapitalize="none"
              onChangeText={handleChangeText}
              inputContainerStyle={{ borderBottomWidth: 0, backgroundColor: 'white', height: normalize(32), width: normalize(330), borderRadius: 5 }}
              leftIcon={{ type: 'font-awesome', name: 'search', size: normalize(15), marginLeft: normalize(10) }}
            />
          </View>
        <View>
          {renderMatches()}
        </View>
        <View style={styles.line}/>
        <ButtonBlue marginTop={20} title="Don’t see your bud? Add friend here!" onPress={() => navigation.navigate("AddFriendsScreen")}></ButtonBlue>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    backgroundColor: "#BDCCF2",
    width: "100%",
    height: "25%"
  },
  shadowLight: {
    shadowColor: '#171717',
    shadowOffset: {height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  searchIcon: {
    padding: 10,
  },
  input: { borderBottomWidth: 0, backgroundColor: 'white', height: 32, borderRadius: 5 },
  titleText: {
    fontFamily: 'JosefinSansBold',
    fontSize: normalize(50),
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: windowWidth *.04,
    marginTop: windowHeight *.008
  },
  btn: {
    width: "18%",
  },
  profilePicture: {
    height: normalize(56),
    width: normalize(56),
    borderRadius: 28,
    backgroundColor: "#000000",
    position: "absolute",
    left: 18,
    top: 11
  },
  username: {
    fontSize: normalize(11),
    position: "absolute",
    top: 72,
    left: 18
  },
  letterContainer: {
    position: "absolute",
    left: 100,
    top: 0
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: 'white',
  },
  scrollView: {
    height: 200,
  },
  recipientsContainer: {
    width: 350,
    height: 585,
    borderRadius: 20,
    marginTop: 10,
    flex: 1,
    alignContent: "center"
  },
  friendCircle: {
    height: 70,
    width: 70,
    borderRadius: 50,
    backgroundColor: COLORS.profilebackground,
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
  },
  selectTitleText: {
    fontSize: 35,
    fontWeight: "400",
    justifyContent: "center",
    textAlign: 'center',
    marginTop: 15,
  },
  inputContainer: {
    marginLeft: 5,
  },
  friendMidText: {
    textAlign: "center",
    
    fontSize: 20,
    color: "#1E4693",
    opacity: 1,
    marginTop: 21,
    fontWeight: "600"
  },
  line: {
    marginTop: 10,
    borderBottomColor: COLORS.blue400,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});