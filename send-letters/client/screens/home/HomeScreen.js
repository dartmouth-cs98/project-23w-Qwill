import React, { useState, useEffect, useContext} from 'react';
import { Text, View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import LetterCarousel from '../../components/LetterCarousel';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'react-native-elements';

// component imports
import ButtonPrimary from '../../components/ButtonPrimary';
import ButtonEmptyMailbox from '../../components/ButtonEmptyMailbox';
import { Snackbar } from 'react-native-paper';
import LetterForCarousel from '../../components/LetterForCarousel';
import { COLORS } from '../../styles/colors';

// https://stackoverflow.com/questions/41754471/change-button-color-react-native 
// The react Button component renders the native button on each platform it uses. Because of this, 
// it does not respond to the style prop. It has its own set of props.

// calculate dimensions for the mailbox image
const dimensions = Dimensions.get('window');
const windowWidth = dimensions.width;
const imageHeight = dimensions.height * (.7);
const imageWidth = Math.round(imageHeight * .626);

// widths for the slider carousel
const SLIDER_WIDTH = windowWidth;

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
        <View key={index}>
          <LetterForCarousel
            letterStatus={item.status}
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
        <View style={{ flexDirection:"row"}}>
          <ButtonPrimary selected={true} title={"Mailbox"}/>
          <ButtonPrimary 
              selected={false} 
              title={"Drafts"} 
              onPress={() => navigation.navigate('Drafts')}/>
        </View>

        <View style={{flex: 1}}></View>

        <View style={{flex: 8, justifyContent: 'center', alignItems: 'center', width: windowWidth}} >
          <ImageBackground
            source={require('../../assets/mailboxempty.png')}
            style={{
              flex: 1,
              alignContent: 'center',
              alignItems: 'center',
              height: imageHeight,
              width: imageWidth
            }}
          >
            { mail.length === 0 ? (
                <View>
                  <View style={{flex: 2, padding: '20%', justifyContent: 'center', alignItems: 'center'}}>
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
              ) : mail.length === 1 ? (
                <View style={{flex: 1, alignItems: 'center'}}>
                  <LetterForCarousel
                    letterStatus={mail[0].status}
                    sender={mail[0].senderInfo.name}
                    senderAddress={0}
                    recipient={userInfo.user.name}
                    recipientAddress={0}
                    onPress={() => {handleLetterOpen(mail[0].text, mail[0]._id, mail[0].status, mail[0].senderInfo._id, mail[0].senderInfo.username, mail[0].theme, mail[0].font)}}
                  />
                </View>
              ): (
              <>
                <View style={{flex: 0}}/>
                <View style={{flex: 8, alignItems: 'center', alignSelf: 'center', width: windowWidth}}>
                  <LetterCarousel 
                    data={mail}
                    renderItem={renderItem}/>
                </View>
              </>) 
            }
          </ImageBackground>
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
  emptyMailboxText: {
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
    color: COLORS.white
  },
  snackBarText: {
    color: COLORS.white,
    textAlign: 'center'
  },
  snackbar: {
    opacity: 0.7,
    alignSelf: 'center',
    width: windowWidth * .7,
    bottom: 10,
    fontSize: 30,
    borderRadius: 20,
  }
});
