import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ComposeContext } from '../../context/ComposeStackContext';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { Snackbar } from 'react-native-paper';
import ButtonPrimary from '../../components/ButtonPrimary';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'react-native-elements';
import LetterDetail from '../../components/LetterDetail';
import Ionicons from '@expo/vector-icons/Ionicons';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Font from 'expo-font';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

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
    
    async function fetchDrafts() {
      try {
        const resp = await axios.post(findIP()+"/api/fetchLetters", { userID, possibleLetterStatuses: ["draft"], userStatus: "sender" });
        
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
    fetchDrafts();
  }, [isFocused]);

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
      customFont: item.customFont,
      stickers: item.stickers
    });
    navigation.navigate('NavBar', {
      screen: 'Compose',
      params: {
        screen: 'ComposeHome',
        params: {
          text: item.text,
          fromDrafts: true
        }
      }
    });
  };

  // this function renders the user's drafts found in the DB
  function renderDrafts() {
    
    if (drafts && drafts.length == 0) {
      return <Text style={{textAlign:'center'}}>No drafts found</Text>
    }
    return (
        <FlatList
          nestedScrollEnabled
          contentContainerStyle={{}}
          data={drafts}
          numColumns={1}
          renderItem={({item}) => 
          <View style={{justifyContent: 'center', alignItems: 'center', width: wp("100%")}}>
            <TouchableOpacity style={styles.btn}>
              <Ionicons style={styles.icon} name={'close-circle'} size={wp(6.5)}></Ionicons>
              <View style={styles.xBackground}></View>
            </TouchableOpacity>
            <View style={{marginVertical: 10}}>
              <LetterDetail 
                text={item.text} 
                themeID={item.theme} 
                fontID={item.font} 
                width={wp('90%')*.8} 
                height={hp('64%')*.8}
                touchable={true}
                onPress={() => handleDraftPressed(item)}
              />
            </View>
          </View>
            }
          keyExtractor={item => item._id}
        />
    );
  };

  return (
    <SafeAreaView style={{flexDirection: 'column', flex: 1, justifyContent: 'space-between', alignItems: 'center', marginTop: 0 }}>
      <View style={[styles.header, styles.shadowLight]}></View>
      <Image 
          style={{
            height: undefined, 
            width: '60%',
            aspectRatio: 4,
            resizeMode: "contain",
            marginBottom: 15
          }}
          source={require('../../assets/logo.png')}
        />
      <View style={{ flexDirection:"row", marginBottom: 30}}>
        <ButtonPrimary selected={false} title={"Mailbox"} onPress={() => navigation.navigate('Mailbox')}/>
        <ButtonPrimary 
            selected={true} 
            title={"Drafts"} 
            onPress={() => navigation.navigate('Drafts')}/>
      </View>
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
    shadowOffset: {height: 4 },
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
    left: wp('90%')*.92,
  }, 
  xBackground: {
    backgroundColor: 'white',
    width: wp(3),
    height: wp(3),
    position: 'absolute',
    top: wp(2),
    left: wp(2),
  }
})