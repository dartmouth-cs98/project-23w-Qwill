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
        setLetterHistory(resp.data.letterHistory); //todo show tate and ask about backend
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLetterOpen = (letterText, letterID, letterStatus, senderID, senderUsername, themeID, fontID, stickers) => {
    navigation.navigate('LetterHistoryDetail', {
      letterText: letterText,
      letterID: letterID,
      letterStatus: letterStatus,
      senderID: senderID,
      senderUsername: senderUsername,
      themeID: themeID,
      fontID: fontID,
      stickers: stickers,
    });
  };

  const renderItem = (item) => {
    
    const alignDirection = (item.sender == userInfo.user._id) ? "flex-end" : "flex-start";

    return (
      <View style={{alignSelf: alignDirection, marginLeft: windowWidth*.1, marginRight: windowWidth*.1}}>
        <LetterHistoryPreview 
            letterStatus={item.status}
            letterFont={item.font}
            letterDate={item.createdAt}
            sender={item.senderInfo.name}
            // senderAddress={index}
            recipient={item.recipientInfo.name}
            // recipientAddress={index}
            onPress={() => {handleLetterOpen(item.text, item._id, item.status, item.sender, item.senderInfo.username, item.theme, item.font, item.stickers)}}
        ></LetterHistoryPreview>
      </View>
    );
  };

  const renderHistory = () => {
    if (letterHistory.length == 0) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.emptyHistoryText} allowFontScaling={false}>You have no letter history with this friend</Text>
        </View>
      )
    } else {
      return (
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.topText} allowFontScaling={false}>Received</Text>
            <Text style={styles.topText} allowFontScaling={false}>Sent</Text>
          </View>
          <View style={styles.verticalLine}></View>
            <FlatList
              data={letterHistory}
              renderItem={({item}) => renderItem(item)}
              keyExtractor={item => item._id}
            />
        </View>
      )
    }
  };

  return (
    <SafeAreaView style={{ flexDirection: 'column', flex: 1, marginTop: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{marginLeft: "5%"}}onPress={() => { navigation.goBack() }}>
          <Ionicons name="arrow-back" size={wp('10.6')} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={styles.friendCircle} title={item.username}>
            <Text style={styles.friendMidText} allowFontScaling={false}>{(item.name).replace(/["]/g, '')[0]}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.username} allowFontScaling={false}>{item.username}</Text>
      <View style={styles.line}></View>
      {renderHistory()}
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
    marginLeft: wp('-16%'),
    justifyContent: 'center',
  },
  friendMidText: {
    textAlign: "center",
    fontSize: hp('2.5%'),
    color: "#1E4693",
    opacity: 1,
    marginTop: hp('2.5%'),
    fontWeight: "600",
    fontSize: wp('5.6%'),
    bottom: wp('2.5%')
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
    textAlign: "center",
    fontSize: hp('1.75%')
  },
  verticalLine: {
    position: "absolute",
    top: hp('1%'),
    width: StyleSheet.hairlineWidth,
    height: hp('80%'),
    alignSelf: "center",
    backgroundColor: COLORS.blue400,
  },
  emptyHistoryText: {
    fontFamily: 'JosefinSansBold',
    width: wp('60%'),
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
  topText: {
    fontFamily: 'JosefinSans',
    fontSize: wp('3%'),
    marginHorizontal: wp('10%'),
    color: COLORS.blue600
  }
});