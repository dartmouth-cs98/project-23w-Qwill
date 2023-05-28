import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ComposeContext } from '../../context/ComposeStackContext';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { useIsFocused } from '@react-navigation/native';
import LetterDetail from '../../components/LetterDetail';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../styles/colors';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Font from 'expo-font';

function DraftsScreen({ navigation }) {

  const [userInfo, setUserInfo] = useContext(AuthContext);
  const userID = userInfo.user._id;
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);
  const [drafts, setDrafts] = useState("");

  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);

  const isFocused = useIsFocused();
  
  // fetch the drafts from the server
  useEffect(() => {
    fetchDrafts();
  }, [isFocused]);

  async function fetchDrafts() {
    try {
      const resp = await axios.post(findIP() + "/api/fetchLetters", { userID, possibleLetterStatuses: ["draft"], userStatus: "sender" });

      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else if (!resp.data || !resp.data.receivedLetters) {
        console.error("Error: the response does not contain the expected fields");
      } else {
        for (letter of resp.data.receivedLetters) {
          if (letter.fontInfo && !Font.isLoaded(letter.fontInfo._id)) {
            await Font.loadAsync({ [letter.fontInfo._id]: letter.fontInfo.firebaseDownloadLink });
          }
        }
        setDrafts(resp.data.receivedLetters);
      }
    } catch (err) {
      console.error(err);
    }
  }


  const handleDraftPressed = (item) => {
    // clicking on draft button will update the current letter info
    setLetterInfo({
      senderID: userID,
      letterID: item._id,
      text: item.text,
      recipientID: item.recipient,
      recipientUsername: item.recipientInfo.username,
      themeID: item.theme,
      fontID: item.font,
      status: "draft",
      fontName: item.customFont ? item.fontInfo.name : item.font,
      customFont: item.customFont,
      stickers: item.stickers,
    });

  };
  useEffect(() => {
    if (letterInfo.letterID != "") {
      navigation.navigate('NavBar', {
        screen: 'Compose',
        params: {
          screen: 'ComposeHome',
          params: {
            text: letterInfo.text,
            fromDrafts: true
          }
        }
      });
    }
  }, [letterInfo]);

  const handleDeleteDraft = async (item) => {
    try {
      const resp = await axios.post(findIP() + "/api/deleteLetter", { letterID: item._id });

      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else if (!resp.data || !resp.data.ok) {
        console.error("Error: the response does not contain the expected fields");
      } else {
        fetchDrafts();
      }
    } catch (err) {
      console.error(err);
    }
  }


  // this function renders the user's drafts found in the DB
  function renderDrafts() {

    if (drafts && drafts.length == 0) {
      return (
        <View style={{flex: 2, padding: hp('12%'), justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.emptyDraftText}>
            You don't currently have any drafts.
          </Text>
        </View> 
      )
    }

    return (
      <FlatList
        nestedScrollEnabled
        contentContainerStyle={{}}
        data={drafts}
        numColumns={1}
        extraData={drafts}
        renderItem={({ item }) => (
          <View style={{ justifyContent: 'center', alignItems: 'center', width: wp("100%") }}>
            <TouchableOpacity style={styles.btn} onPress={() => handleDeleteDraft(item)}>
              <Ionicons style={styles.icon} name={'close-circle'} size={wp(6.5)} ></Ionicons>
              <View style={styles.xBackground}></View>
            </TouchableOpacity>
            <View style={{ marginVertical: 10 }}>
              <TouchableOpacity onPress={() => handleDraftPressed(item)}>
                <LetterDetail
                  text={item.text} // Update the text prop to directly pass the text value
                  themeID={item.theme}
                  fontID={item.font}
                  // width={wp('90%') * 0.8}
                  // height={hp('64%') * 0.8}
                  width={.9*.8}
                  height={.64*.8}
                  stickers={item.stickers}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item._id}
      />
    );

  };

  return (
    <SafeAreaView style={{flexDirection: 'column', flex: 1, justifyContent: 'space-between', alignItems: 'center', marginTop: 0, backgroundColor: "#F0F4FF"  }}>
        <View>
          {renderDrafts()}
        </View>
    </SafeAreaView>
  );
};

export default DraftsScreen;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    backgroundColor: "#BDCCF2",
    width: "100%",
    height: "28%"
  },
  shadowLight: {
    shadowColor: '#171717',
    shadowOffset: { height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  icon: {
    color: 'red',
    zIndex: 2,
  },
  btn: {
    zIndex: 1,
    position: 'absolute',
    top: wp(-.5),
    left: wp('90%') * .92,
  },
  xBackground: {
    backgroundColor: 'white',
    width: wp(3),
    height: wp(3),
    position: 'absolute',
    top: wp(2),
    left: wp(2),
  }, 
  emptyDraftText: {
    fontFamily: 'JosefinSansBold',
    width: wp('50%'),
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: wp('4.8%'),
    lineHeight: wp('5.6%'),
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    letterSpacing: wp('0.3%'),
    color: COLORS.black
  },
})