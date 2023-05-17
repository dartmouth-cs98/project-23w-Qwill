import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, ScrollView, Dimensions, PixelRatio } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Font from 'expo-font';
import axios from 'axios';
import COLORS from '../../styles/colors';
import findIP from '../../helpers/findIP';
import Ionicons from '@expo/vector-icons/Ionicons';
import LetterHistoryPreview from '../../components/LetterHistoryPreview';
import React, { useState, useContext, useEffect } from 'react';

const windowWidth = Dimensions.get('window').width;
const scale = windowWidth / 390; // Scale factor for font size on 390 width screen

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};


export default function FriendHistoryScreen({ route, navigation }) {
  const { item } = route.params;
  const [userInfo, setUserInfo] = useContext(AuthContext);
  const [letterHistory, setLetterHistory] = useState("");
  const isFocused = useIsFocused();
  
  // fetch any pending friend requests from the server
  useEffect(() => {
    updateLetterHistory();
  }, [isFocused]);

  const updateLetterHistory = async () => {
    try {
      const resp = await axios.post(findIP()+"/api/fetchLetterHistory", { userID: userInfo.user._id, friendID: item._id });
      console.log(resp.data);
      if (!resp) {
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else if (!resp.data || !resp.data.letterHistory) {
        console.error("Error: the response does not contain the expected fields");
      } else {
        for (letter of resp.data.letterHistory) {
          if (letter.fontInfo && !Font.isLoaded(letter.fontInfo._id)) {
            await Font.loadAsync({ [letter.fontInfo._id]: letter.fontInfo.firebaseDownloadLink });
          }
        }
        setLetterHistory(resp.data.letterHistory);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLetterOpen = (letterText, letterID, letterStatus, senderID, senderUsername, themeID, fontID) => {
    navigation.navigate('LetterHistoryDetail', {
      letterText: letterText,
      letterID: letterID,
      letterStatus: letterStatus,
      senderID: senderID,
      senderUsername: senderUsername,
      themeID: themeID,
      fontID: fontID
    });
  };

  const renderItem = (item) => {
    
    const alignDirection = (item.sender == userInfo.user._id) ? "flex-end" : "flex-start";

    return (
      <View style={{alignSelf: alignDirection, marginLeft: windowWidth*.1, marginRight: windowWidth*.1}}>
        {/* <LetterHistoryPreview item={item} onPress={handleLetterOpen(item.text, item._id, item.status, item.senderInfo._id, item.senderInfo.username, item.theme, item.font)}></LetterHistoryPreview> */}
        <LetterHistoryPreview 
            letterStatus={item.status}
            letterFont={item.font}
            letterDate={item.createdAt}
            sender={item.senderInfo.name}
            // senderAddress={index}
            recipient={item.recipientInfo.name}
            // recipientAddress={index}
            onPress={() => {handleLetterOpen(item.text, item._id, item.status, item.senderInfo._id, item.senderInfo.username, item.theme, item.font)}}
        ></LetterHistoryPreview>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flexDirection: 'column', flex: 1, marginTop: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{marginLeft: "5%"}}onPress={() => { navigation.goBack() }}>
          <Ionicons name="arrow-back" size={40} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={styles.friendCircle} title={item.username}>
            <Text style={styles.friendMidText}>{(item.name).replace(/["]/g, '')[0]}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.username}>{item.username}</Text>
      <View style={styles.line}></View>
      <View style={styles.verticalLine}></View>
      {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ height: '100%', width: 1, backgroundColor: 'black' }} />
        <View style={{ height: '100%', width: 10, backgroundColor: 'black' }} />
      </View> */}
      <View style={{flex: 1}}>
        <FlatList
          data={letterHistory}
          renderItem={({item}) => renderItem(item)}
          keyExtractor={item => item._id}
        />
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  friendCircle: {
    width: wp('18%'),
    aspectRatio: 1,
    borderRadius: wp('100%'),
    backgroundColor: "rgba(30,70,147,0.2)",
    alignContent: "center", 
    marginLeft: wp('-18%')
  },
  friendMidText: {
    textAlign: "center",
    fontSize: hp('2.5%'),
    color: "#1E4693",
    opacity: 1,
    marginTop: hp('10%'),
    fontWeight: "600",
  },
  line: {
    marginTop: hp('1.5%'),
    marginBottom: hp('1.5%'),
    borderBottomColor: COLORS.blue400,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
    width: wp('90%'),
    alignSelf: 'center'
  },
  username: {
    marginVertical: hp('1.5%'),
    fontFamily: 'JosefinSansBold',
    fontStyle: "normal",
    textAlign: "center"
  },
  verticalLine: {
    position: "absolute",
    top: hp('20%'),
    width: StyleSheet.hairlineWidth,
    height: hp('80%'),
    alignSelf: "center",
    backgroundColor: COLORS.blue400,
  }
});