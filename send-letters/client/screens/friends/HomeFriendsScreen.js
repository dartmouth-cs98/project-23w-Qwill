import React, { useState, useContext } from 'react'
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';

import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { hasRestrictedChar } from '../../helpers/stringValidation';
import COLORS from '../../styles/colors';
import ButtonBlue from '../../components/ButtonBlue.components';
import {truncate} from '../../helpers/stringValidation';

export default function HomeFriendsScreen({ navigation }) {
  const [userInfo, setUserInfo] = useContext(AuthContext);
  const [matchingUsers, setMatchingUsers] = useState("");
  const [text, onChangeText] = useState("");

  const handleChangeText = async (text) => {
    const textToMatch = text.toLowerCase();
    const senderID = userInfo.user._id;
    if (hasRestrictedChar(text)) { setMatchingUsers([]); return; }
    try {
      const resp = await axios.post(findIP() + "/api/matchUsers", { senderID, textToMatch, friends: true });
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
      return
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
                <Text style={styles.friendMidText}>{(JSON.stringify(item.name)).replace(/["]/g, '')[0]}</Text>
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
    <SafeAreaView style={{ flexDirection: 'column', flex: 1, alignItems: 'center', marginTop: 20 }}>
      <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15 }}>
        <Text style={styles.titleText}>Friends</Text>
        <TouchableOpacity style={styles.btn} onPress={() => { navigation.navigate("AddFriendsScreen") }}>
          <Ionicons name="person-add-outline" size={40} ></Ionicons>
        </TouchableOpacity>
      </View>
      <View style={[styles.recipientsContainer]}>
        <View style={styles.inputContainer}>
          <Input
            placeholder=" enter name or username"
            autoCompleteType="email"
            autoCapitalize="none"
            onChangeText={handleChangeText}
            inputContainerStyle={{ borderBottomWidth: 0, backgroundColor: 'white', height: 32, borderRadius: 5 }}
            leftIcon={{ type: 'font-awesome', name: 'search', size: 15, marginLeft: 10 }}
          />
        </View>
        <View>
          {renderMatches()}
        </View>
        <View style={styles.line}/>
        <ButtonBlue marginTop={20} title="Don’t see your bud? Add friend here!" ></ButtonBlue>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchIcon: {
    padding: 10,
  },
  input: { borderBottomWidth: 0, backgroundColor: 'white', height: 32, borderRadius: 5 },
  titleText: {
    fontFamily: 'JosefinSansBold',
    fontSize: 45,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: 20,
    marginTop: 5
  },
  btn: {
    width: "18%",
    // alignItems: 'left',
    // justifyContent: 'left',
  },
  // container: {
  //   height: 94,
  //   width: 312,
  //   backgroundColor: "#97ACE2",
  //   borderRadius: 20,
  //   marginBottom: 15
  // },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  profilePicture: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: "#000000",
    position: "absolute",
    left: 18,
    top: 11
  },
  username: {
    fontSize: 11,
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
    marginTop: 20,
    flex: 1,
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
    // borderWidth: 1,
    // borderColor: 'black'
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  selectTitleText: {
    fontSize: 35,
    fontWeight: "400",
    justifyContent: "center",
    textAlign: 'center',
    marginTop: 15,
    // textDecorationLine: 'underline'
  },
  inputContainer: {
    width: 350,
    marginLeft: 5,
    marginTop: 10
  },
  friendMidText: {
    textAlign: "center",
    // textAlignVertical: "center",
    fontSize: 20,
    color: "#1E4693",
    opacity: 1,
    marginTop: 21,
    fontWeight: "600"
    // backgroundColor: "rgba(0,0,0,1)" 
  },
  line: {
    marginTop: 10,
    borderBottomColor: COLORS.blue400,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});