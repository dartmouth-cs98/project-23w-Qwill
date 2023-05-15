// Imports
import { ComposeContext } from '../../context/ComposeStackContext';
import {
  Image,
  Text,
  View,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  LogBox,
  PanResponder
} from 'react-native';
import { Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import ButtonPrimary from '../../components/ButtonPrimary';
import images from '../../assets/imageIndex';
import React, { useState, useContext, useEffect } from 'react';
import styles from '../../styles/Profile.component.style';
import Toolbar from './Toolbar';
import ThreeButtonAlert from './ThreeButtonAlert';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

function ComposeScreen({ navigation, route }) {
  const [count, setCount] = useState(10);
  const [imageData, setImageData] = useState([]);
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [sticker, setSticker] = useState(null);
  // To move stickers
  const [selectedStickerIndex, setSelectedStickerIndex] = useState(null);
  const [initialStickerPosition, setInitialStickerPosition] = useState(null);

  // Dismiss snack message
  const onDismissSnack = () => setSnackIsVisible(false);

  // Prevents user from clicking the Next button once they have clicked it 
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);


  // A function that handles the sticker selection, updating state and fetching sticker details
  const stickerSelected = (sticker) => {
    // The function is only called if a sticker is selected and the total number of stickers is less than 10
    if (sticker != null && imageData.length < 10) {
      setCount(count - 1);

      const imageSource = images.stickers[sticker];
      const imageUri = Image.resolveAssetSource(imageSource).uri;
      Image.getSize(imageUri, (width, height) => {
        console.log(sticker, width, height);
        setImageData([
          ...imageData,
          {
            source: imageSource,
            x: 425 - width - width / 4,
            y: height / 4,
            initialX: 425 - width - width / 4,
            initialY: height / 4,
          },
        ]);
      });
      setSticker(null);
    }
  };


  // Enables moving of the sticker
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      if (selectedStickerIndex !== null) {
        const updatedImageData = [...imageData];
        updatedImageData[selectedStickerIndex] = {
          ...updatedImageData[selectedStickerIndex],
          x: initialStickerPosition.x + gestureState.dx,
          y: initialStickerPosition.y + gestureState.dy,
        };
        setImageData(updatedImageData);
      }
    },
    onPanResponderRelease: () => {
      if (selectedStickerIndex !== null) {
        setInitialStickerPosition(null);
        setSelectedStickerIndex(null);
      }
    },
  });

  const handleScreenTapped = (event) => {
    Keyboard.dismiss();
    const { locationX, locationY } = event.nativeEvent;
    console.log(locationX, locationY);
    if (sticker != null && imageData.length < 10) {
      console.log("clicked")
      const { locationX, locationY } = event.nativeEvent;
      console.log(locationX, locationY);
      setCount(count - 1);
      const imageSource = images.stickers[sticker];
      const imageUri = Image.resolveAssetSource(imageSource).uri;
      Image.getSize(imageUri, (width, height) => {
        setImageData([...imageData, { source: imageSource, x: locationX - (width / 2), y: locationY - (height / 2) }]);
      });
      setSticker(null);
    }
  };

  // We can ignore the non-serializable warnings as our child component ChangeStickerScreen
  // has no deep links nor state persistence, which must be handled.
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  // Don't need defaultText parameter if no text is routed in params; text only routed when a draft is loaded
  const defaultText = (route.params && route.params.text && route.params.text != "") ? route.params.text : undefined;
  const handleTextChange = (text) => {
    setLetterInfo({ ...letterInfo, text: text, status: "draft" });
    reqBody = letterInfo;
    reqBody["text"] = text;  // have to update text since context not yet updated
    reqBody["status"] = "draft";
    updateBackend(reqBody);
  };

  // Automatically saves to the backend as the user types.
  const updateBackend = async (reqBody) => {
    try {
      resp = null;
      if (letterInfo.letterID == "") { // The letter hasn't been made in DB (never saved as a draft); make new letter with status draft
        resp = await axios.post(findIP() + "/api/makeLetter", reqBody);
      } else { // The letter exists in DB as a draft; update new info
        resp = await axios.post(findIP() + "/api/updateLetterInfo", reqBody);
      }
      if (!resp) {  // Could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // Another backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else {
        setLetterInfo({ ...letterInfo, letterID: resp.data.letterID });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextPressed = () => { // Navigates to the next screen, Preview
    setNextButtonDisabled(true);
    setTimeout(() => {
      setNextButtonDisabled(false);
    }, 1000);
    navigation.push('Preview');
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flexDirection: "row", alignSelf: "center" }}>
        <View style={{ alignContent: "flex-start" }}>
          <ThreeButtonAlert navigation={navigation} ></ThreeButtonAlert>
        </View>
        <Toolbar navigation={navigation} passedStickerSelected={stickerSelected} />
      </View>
      <Text style={styles.subtitleText}>{imageData.length >= 10 ? 'No more stickers' : `Stickers left: ${count}`}</Text>
      <ImageBackground
        resizeMode={'cover'}
        style={{ flex: 1, width: '100%', height: '95%' }}
        source={images.themes[letterInfo.themeID]}>
        <View
          style={{ flex: 1 }}
        >
          <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
            <Input
              style={{
                fontFamily: letterInfo.fontID,
                marginTop: hp('2.16%'), // 20/926 = 0.0216
                fontSize: hp('2.38%'), // 22/926 = 0.0237
                height: hp('65.88%'), // 610/926 = 0.6588
                width: wp('90%'), // 90% of screen width
                marginLeft: wp('1.17%'), // 5/428 = 0.0117
                marginRight: wp('1.17%'), // 5/428 = 0.0117
              }}
              placeholder={"Start writing your letter!"}
              inputContainerStyle={{ borderBottomWidth: 0 }}
              onChangeText={(text) => {
                hasTyped = true;
                handleTextChange(text);
              }}
              multiline={true}
              defaultValue={defaultText}
              autoCapitalize="none"
            />
          </TouchableOpacity>
        </View>
        
        {imageData.map((data, index) => { // creates a separate Pan Responder for each image in the imageData array
          const stickerPanResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
              setSelectedStickerIndex(index);
              setInitialStickerPosition({ x: data.x, y: data.y });
            },
            onPanResponderMove: (event, gestureState) => {
              if (selectedStickerIndex === index) {
                const updatedImageData = [...imageData];
                updatedImageData[selectedStickerIndex] = {
                  ...updatedImageData[selectedStickerIndex],
                  x: initialStickerPosition.x + gestureState.dx,
                  y: initialStickerPosition.y + gestureState.dy,
                };
                setImageData(updatedImageData);
              }
            },
            onPanResponderRelease: () => {
              if (selectedStickerIndex === index) {
                setInitialStickerPosition(null);
                setSelectedStickerIndex(null);
              }
            },
          });

          return (
            <Image
              key={index}
              source={data.source}
              style={{ position: 'absolute', left: data.x, top: data.y }}
              {...stickerPanResponder.panHandlers}
            />
          );
        })}

      </ImageBackground>
      <KeyboardAvoidingView style={{ flexDirection: 'row' }}>
        <ButtonPrimary title={"Next!"} selected={true} disabled={nextButtonDisabled} onPress={handleNextPressed} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ComposeScreen;
