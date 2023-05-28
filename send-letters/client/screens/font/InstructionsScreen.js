import { Text, View, StyleSheet, TouchableOpacity, Dimensions, PixelRatio, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import COLORS from '../../styles/colors';
import ButtonBlue from '../../components/ButtonBlue.components';
import React, { useState, useContext, useEffect, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { AuthContext } from '../../context/AuthContext';
import { Snackbar } from 'react-native-paper';
import * as Font from 'expo-font';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const scale = windowWidth / 390; // Scale factor for font size on 390 width screen

// These are the text lines that show up sequentially while the font creation is loading.
const loadingTexts = ["Scanning your image for text...", 
                      "Converting characters to vector images...", 
                      "Creating font file...",
                      "Finishing up!"];

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const FontsScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [userInfo, setUserInfo] = useContext(AuthContext);

  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);
  const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);  // default set loading spinner to false
  const [fontIsSuccess, setFontIsSuccess] = useState(false);  // should we display a page directing user back to fonts?

  // Use this to cycle through text lines when waiting for font response from serevr
  const [loadingTextIndex, setLoadingTextIndex] = useState(0); 
  const intervalID = useRef(null);  // we'll set a ref for the interval id so we can clear and reset it when we need

  // Thanks to https://stackoverflow.com/questions/66406297/change-placeholder-text-every-two-seconds-in-react
  // and https://stackoverflow.com/questions/56914921/is-useref-hook-a-must-to-set-and-clear-intervals-in-react
  useEffect(() => {
    intervalID.current = () => {
      setLoadingTextIndex(prevIndex => {
        if(prevIndex === loadingTexts.length - 1){
          return prevIndex;
        } 
        return prevIndex + 1;
      })
    };
    setInterval(intervalID.current, 5000);
    
    //cleanup function in order clear the interval timer when the component unmounts
    return () => {
      clearInterval(intervalID.current); 
    }
  }, []);

  const clearLoadingTextInterval = () => {
    clearInterval(intervalID.current);
    setLoadingTextIndex(0);
  }

  const handlePickImagePressed = async () => {

    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      clearLoadingTextInterval();  // clear the interval so it starts back over at 0
      setSpinnerIsVisible(true);
      setImage(result.assets[0].uri);
      let base64image = result.assets[0].base64;

      // make server request
      try {
        const resp = await axios.post(findIP() + "/api/createCustomFont", { userID: userInfo.user._id, handwritingImage: base64image });
        setSpinnerIsVisible(false);

        if (!resp) {  // could not connect to backend
          console.log("ERROR: Could not establish server connection with axios or image is larger than 16mb");
          setSnackMessage("Could not establish connection to the server or image is larger than 16mb");
          setSnackIsVisible(true);
        } else if (resp.data.error) {  // backend error
          setSnackMessage(resp.data.error);
          setSnackIsVisible(true);
        } else if (resp.data.message) {
          // font creation successful
          if (resp.data.font) {
            // Take the user back to fonts page with snackbar success message
            setFontIsSuccess(true);
            // load the font
            const customFont = resp.data.font;
            if (!Font.isLoaded(customFont._id)) {
              await Font.loadAsync({ [customFont._id]: customFont.firebaseDownloadLink });
            }
          // font creation not successful
          } else {
            setSnackMessage(resp.data.message);
            setSnackIsVisible(true);
          }
        } else {
          console.error("Error: the response does not contain the expected fields");
          setSnackMessage("Something went wrong! Your font was not created.");
          setSnackIsVisible(true);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <SafeAreaView style={{ alignItems: 'center', flex: 1, backgroundColor: "#F0F4FF" }}>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons style={{ paddingLeft: windowWidth * .015 }} name={"arrow-back"} size={normalize(40)} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Create Custom Font</Text>
      </View>

      {/* conditional rendering of either a loading spinner, if a request has been made to the backend, or a choice between the instructions (if fontIsSuccess
        is false) or the font success page (if true)*/}
      { spinnerIsVisible ? (
        <View style={styles.loadingView}>
          <ActivityIndicator style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }]}} size="large" color="#7184b4"/>
          <Text style={styles.loadingText}>{loadingTexts[loadingTextIndex]}</Text>
        </View>
     ) : ( !fontIsSuccess ? (
      <>
        <View style={styles.line}></View>
        <Text style={styles.centeredText}>To produce your custom font, we need a sample of your handwriting!</Text>
        <Text style={styles.centeredText}>Follow the instructions below and we will handle the rest!</Text>
        <View style={styles.line}></View>
        <View style={styles.listContainer}>
          <Text ordered={true} style={styles.listItem}>
            1. On a plain white sheet of paper and a black pen, write out the alphabet in uppercase letters. Make sure there's enough space between the characters and that they are large enough.
          </Text>
          <Text ordered={true} style={styles.listItem}>
            2. On another line, write the alphabet in lowercase.
          </Text>
          <Text ordered={true} style={styles.listItem}>
            3. Either take a photo of your writing or scan the document and select from camera roll.
          </Text>
        </View>
        <View style={styles.line}></View>
        <Text style={styles.centeredText}>Your sample should look something like this:</Text>
        <Image
          style={{
            height: undefined,
            width: '80%',
            aspectRatio: 2,
            resizeMode: "contain",
          }}
          source={require('../../assets/exampleSample.png')}
        />
        <ButtonBlue style={[styles.btn, styles.shadow]} title="Select your handwriting sample!" onPress={handlePickImagePressed}></ButtonBlue>
      </> ) :
        (
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}> 
          <Ionicons name="checkmark-circle" size= {hp(20)} color="#BDCCF2"/>
          <Text style={styles.fontCongratsText}>Congratulations, your font has been created!</Text>
          <TouchableOpacity style={styles.showFontButton} onPress={() => navigation.goBack()}>
            <Text style={styles.showFontText}>
              Show me!
            </Text>
          </TouchableOpacity>
        </View>
        )
      )}
      
      <Snackbar
        style={styles.snackbar}
        //SnackBar visibility control
        visible={snackIsVisible}
        onDismiss={() => { setSnackIsVisible(false) }}
        // short dismiss duration
        duration={4000}
      >
        <Text style={styles.snackBarText}>{snackMessage}</Text>
      </Snackbar>
    </SafeAreaView>
  );
};

export default FontsScreen;

const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'JosefinSansBold',
    fontSize: wp('6%'),
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: wp('3%'),
    marginTop: hp('1.2%')
  },
  line: {
    marginTop: hp('1.2%'),
    marginBottom: hp('1.2%'),
    borderBottomColor: COLORS.blue400,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "90%",
    alignSelf: 'center'
  },
  camera: {
    flex: 1,
  },
  text: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: 'white',
  },
  listContainer: {
    width: wp('80%'),
  },
  listItem: {
    fontSize: hp('1.8%'),
    fontWeight: 'bold',
    marginVertical: hp('0.8%'),
    fontFamily: 'JosefinSans',
  },
  centeredText: {
    fontFamily: 'JosefinSansBold',
    fontSize: wp('4%'),
    textAlign: 'center',
    paddingHorizontal: wp('3.8%'),
    marginTop: hp('1.2%'),
    marginBottom: hp('1.2%')
  },
  btn: {
    width: wp('80%'),
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  snackBarText: {
    color: COLORS.white,
    textAlign: 'center'
  },
  snackbar: {
    opacity: 0.7,
    alignSelf: 'center',
    width: wp('85%'),
    bottom: hp('0.8%'),
    fontSize: wp('8%'),
    borderRadius: 20,
  },
  loadingView: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: hp('4'),
    fontSize: hp('2.2%'),
    fontFamily: 'JosefinSans'
  },
  fontCongratsText: {
    fontSize: hp('3%'),
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'JosefinSans'
  },
  showFontButton: {
    marginTop: hp(5),
    borderRadius: 20,
    width: wp('32'),
    backgroundColor: "#7184b4"
  },
  showFontText: {
    textAlign: 'center',
    fontSize: wp(5),
    fontFamily: 'JosefinSans',
    color: 'white',
    padding: hp(1.5)
  }
});