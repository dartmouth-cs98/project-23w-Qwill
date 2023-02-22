import React, {useState, useEffect, useContext} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/auth';
import axios from "axios";
import findIP from '../../helpers/findIP';
import { useRoute } from '@react-navigation/native';

// component imports
import ButtonPrimary from '../../components/ButtonPrimary';
import ButtonEmptyMailbox from '../../components/ButtonEmptyMailbox';
import { Snackbar } from 'react-native-paper';


// https://stackoverflow.com/questions/41754471/change-button-color-react-native 
// The react Button component renders the native button on each platform it uses. Because of this, 
// it does not respond to the style prop. It has its own set of props.


// calculate dimensions for the mailbox image
const dimensions = Dimensions.get('window');
const windowWidth = dimensions.width;
const imageHeight = dimensions.height * (.7);
const imageWidth = Math.round(imageHeight * .626);

function HomeScreen({ navigation}) {
  const [state, setState] = useContext(AuthContext);
  const userID = state.user._id;
  const [mail, setMail] = useState("");

  // Get whether a letter sent snack should be visible from the compose stack
  const [letterSentSnackIsVisible, setLetterSentSnackIsVisible] = useState(false);


  // fetch the mail from the server
  useEffect(() => {
    async function fetchMail() {
      try {
        const resp = await axios.post(findIP()+"/api/receiveLetters", { userID });
        if (resp.error) {
          console.log(error);
        } else if (!resp.data || !resp.data.receivedLetters) {
          console.log("Error: the response does not contain the expected fields");
        } else {
          setMail(resp.data.receivedLetters);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchMail();
  }, []);

  console.log(mail);

    return (
      <SafeAreaView style={{flexDirection: 'column', flex: 1, justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
        <View style={{ flexDirection:"row"}}>
            <ButtonPrimary selected={true} title={"Mailbox"}/>
            <ButtonPrimary 
              selected={false} 
              title={"Drafts"} 
              onPress={() => navigation.replace('Drafts')}/>
        </View>

        <View style={{flex: 1}}></View>

        <View style={{flex: 8, justifyContent: 'center', alignItems: 'center'}} >
          <ImageBackground
            source={require('../../assets/mailboxempty.png')}
            style={{
              flex: 1,
              height: imageHeight,
              width: imageWidth}}>
                {/* TODO: conditionally render this if the mailbox is empty*/}
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
          </ImageBackground>
        </View>

        <Snackbar
          //SnackBar visibility control
          visible={letterSentSnackIsVisible}
          onDismiss={() => {setLetterSentSnackIsVisible(false)}}
          duration={2000}
          style={styles.snackbar}
        >
          <Text style={styles.snackBarText}>Letter sent!</Text>
        </Snackbar>
      </SafeAreaView>
    );
  }

export default HomeScreen;

const styles = StyleSheet.create({
  emptyMailboxText: {
    width: 150,
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 20,
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    letterSpacing: 0.3,
    color: "#FFFFFF"
  },
  snackBarText: {
    color: "#fff",
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