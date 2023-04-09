import React, { useState, useContext } from 'react'
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/auth';

import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { hasRestrictedChar } from '../../helpers/stringValidation';
import COLORS from '../../styles/colors';
import ButtonBlue from '../../components/ButtonBlue.components';

function truncate(str, n) {
  return (str.length > n) ? str.slice(0, n - 1) + '...' : str; 
  // based on https://stackoverflow.com/questions/1199352/smart-way-to-truncate-long-strings
};

function HomeFriendsScreen({ navigation }) {
  const [state, setState] = useContext(AuthContext);
  const [matchingUsers, setMatchingUsers] = useState("");
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
    <SafeAreaView style={{ flexDirection: 'column', flex: 1, alignItems: 'center', marginTop: 20 }}>
      <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15 }}>
        <Text style={styles.titleText}>Friends</Text>
        <TouchableOpacity style={styles.btn} onPress={() => { navigation.navigate("AddFriendsScreen") }}>
          <Ionicons name="person-add-outline" size={40} ></Ionicons>
        </TouchableOpacity>
      </View>
      <View style={[styles.recipientsContainer]}>
        <View style={styles.inputContainer}>
          {/* <FaBeer />
          <Icon style={styles.searchIcon} name="ios-search" size={20} color="#000" /> */}
          <Input 
            placeholder=" enter name or username"
            autoCompleteType="email"
            autoCapitalize="none"
            onChangeText={handleChangeText}
            inputContainerStyle={{borderBottomWidth:0, backgroundColor: 'white', height: 32, borderRadius: 5}}
            leftIcon={{ type: 'font-awesome', name: 'search', size: 15, marginLeft: 10}}
          />
          
        </View>
        <View>
          {renderMatches()}
        </View>
        <View style={styles.line}></View>
        <ButtonBlue marginTop={20} title="Don’t see your bud? Add friend here!" ></ButtonBlue>
      </View>
    </SafeAreaView>
  );
}
export default HomeFriendsScreen;

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
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    height: 94,
    width: 312,
    backgroundColor: "#97ACE2",
    borderRadius: 20,
    marginBottom: 15
  },
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
    borderRadius: 35,
    backgroundColor: "rgba(30,70,147,0.2)",
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
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
    width: 110,
    height: 0,
    borderWidth: 1,
    borderColor: COLORS.black20,
    marginTop: 10,
    marginBottom: 10
  },
});