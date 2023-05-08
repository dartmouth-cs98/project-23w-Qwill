import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, ImageBackground, Dimensions, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import LetterCarousel from '../../components/LetterCarousel';
import { useIsFocused } from '@react-navigation/native';
import { FlatList } from 'react-native';
import * as Font from 'expo-font';

// component imports
import ButtonPrimary from '../../components/ButtonPrimary';
import ButtonEmptyMailbox from '../../components/ButtonEmptyMailbox';
import { Snackbar } from 'react-native-paper';
import LetterForCarousel from '../../components/LetterForCarousel';
import { COLORS } from '../../styles/colors';

// https://stackoverflow.com/questions/41754471/change-button-color-react-native 
// The react Button component renders the native button on each platform it uses. Because of this, 
// it does not respond to the style prop. It has its own set of props.


function HomeScreen({ navigation, route}) {
  const [userInfo, setUserInfo] = useContext(AuthContext);
  const userID = userInfo.user._id;
  const [mail, setMail] = useState("");

  // For snackbar:
  // https://callstack.github.io/react-native-paper/snackbar.html
  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);

  const isFocused = useIsFocused();

  const [letterSentSnackIsVisible, setLetterSentSnackIsVisible] = useState(false);

  // we'll change the state of the letter snack visibility if something changes in the route params
  useEffect(() => {
    if (route.params) {
      const params = route.params;
      setLetterSentSnackIsVisible(params.letterSentSnackIsVisible);
    }
  }, [route.params]);

  const handleLetterOpen = async (letterText, letterID, letterStatus, senderID, senderUsername, themeID, fontID) => {
    navigation.navigate('LetterDetail', {
      letterText: letterText,
      letterID: letterID,
      letterStatus: letterStatus,
      senderID: senderID,
      senderUsername: senderUsername,
      themeID: themeID,
      fontID: fontID
    });

    try {
      const resp = await axios.post(findIP()+"/api/updateLetterStatus", {letterID, newStatus: "read"});
      
      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
      setSnackMessage("Could not establish connection to the server");
      setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // This func is passed as a param to the letter carousel to render each itme 
  const renderItem = ({item, index}) => {
    return (
        <View key={index}
              style={{shadowOpacity: .1, 
                      shadowColor: "#000000",
                      marginBottom: -hp('20%')}}>
          <LetterForCarousel
            letterStatus={item.status}
            letterFont={item.font}
            letterDate={item.createdAt}
            sender={item.senderInfo.name}
            senderAddress={index}
            recipient={userInfo.user.name}
            recipientAddress={index}
            onPress={() => {handleLetterOpen(item.text, item._id, item.status, item.senderInfo._id, item.senderInfo.username, item.theme, item.font)}}
          />
        </View>
    );
  };

  // fetch the mail from the server
  useEffect(() => {
    async function fetchMail() {
      try {
        const resp = await axios.post(findIP()+"/api/fetchLetters", { userID, possibleLetterStatuses: ["sent", "read"], userStatus: "recipient" });
        console.log(resp.data)
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
          setMail(resp.data.receivedLetters);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchMail();
  }, [isFocused]);

    return (
      <SafeAreaView style={{flexDirection: 'column', flex: 1, justifyContent: 'space-between', alignItems: 'center', marginTop: 0 }}>

        <View style={{flex: 8, justifyContent: 'center', alignItems: 'center', width: wp('100%'), marginBottom: 0}} >
         
            { mail.length === 0 ? (
               <ImageBackground
               source={require('../../assets/mailbox1.png')}
               imageStyle={{position: 'absolute', bottom: '-50%', left: 0, resizeMode: 'contain' }}
               style={{
                 flex: 1
               }}
             >
                <View>
                  <View style={{flex: 2, padding: '25%', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.emptyMailboxText}>
                      You don't have any letters in your mailbox.
                    </Text>
                  </View> 
                  <View style={{flex: 3.5, alignItems: 'center'}}>
                    <ButtonEmptyMailbox
                      selected={false}
                      title={"Send a letter"}
                      onPress={() => {navigation.navigate('Compose')}}
                    />
                  </View>
                </View>
                </ImageBackground>
              ) : (
              <>
                <View style={{flex: 0}}/>
                <View style={{flex: 8, alignItems: 'center', alignSelf: 'center', width: wp('100%'), marginBottom: '-10%'}}>
                  <FlatList
                    contentContainerStyle={{marginBottom: 0}}
                    data={mail}
                    CellRendererComponent={this.renderItem}
                    renderItem={renderItem}
                    bounces={false}
                    ListFooterComponent={
                    <Image 
                      resizeMode="contain" 
                      style={{
                        width: wp('100%'),
                        marginTop: hp('10%'),
                        marginBottom: -hp('15%')
                      }} 
                      source={require('../../assets/mailbox2.png')}>
                    </Image>}
                    ListFooterComponentStyle={{width: wp('100%')}}/>
                </View>
              </>) 
            }
          
        </View>
        <Snackbar
          style={styles.snackbar}
          //SnackBar visibility control
          visible={letterSentSnackIsVisible}
          onDismiss={() => {setLetterSentSnackIsVisible(false)}}
          // short dismiss duration
          duration={2000}
          >
            <Text style={styles.snackBarText}>Letter sent!</Text>
        </Snackbar>
      </SafeAreaView>
    );
  }

export default HomeScreen;

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
  emptyMailboxText: {
    fontFamily: 'JosefinSansBold',
    width: wp('50%'),
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
  snackBarText: {
    color: COLORS.white,
    textAlign: 'center'
  },
  snackbar: {
    opacity: 0.7,
    alignSelf: 'center',
    width: wp('70%'),
    bottom: 10,
    fontSize: 30,
    borderRadius: 20,
  }
});
