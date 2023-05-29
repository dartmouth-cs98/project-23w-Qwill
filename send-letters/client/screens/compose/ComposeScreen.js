// Imports
import { ComposeContext } from '../../context/ComposeStackContext';
import {
  Image,
  Text,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableOpacity,
  LogBox,
  PanResponder,
  Keyboard,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import ButtonPrimary from '../../components/ButtonPrimary';
import images from '../../assets/imageIndex';
import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import styles from '../../styles/Profile.component.style';
import Toolbar from './Toolbar';
import ThreeButtonAlert from './ThreeButtonAlert';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import { throttle } from 'lodash';
import { useIsFocused } from '@react-navigation/native';

function ComposeScreen({ navigation, route }) {
  const [inputText, setInputText] = useState("");
  const [count, setCount] = useState(10);
  
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);
  const [imageData, setImageData] = useState(letterInfo.stickers);
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  // To move stickers
  const [selectedStickerIndex, setSelectedStickerIndex] = useState(null);
  const [initialStickerPosition, setInitialStickerPosition] = useState(null);
  const [movingSticker, setMovingSticker] = useState(false);
  const [bgWidth, setBgWidth] = useState(0);
  const [bgHeight, setBgHeight] = useState(0);
  // Prevents user from clicking the Next button once they have clicked it 
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
  const isFocused = useIsFocused();
  const [keyboard, setKeyboard] = useState(false);
  // Don't need defaultText parameter if no text is routed in params; text only routed when a draft is loaded
  const defaultText = (route.params && route.params.text && route.params.text != "") ? route.params.text : undefined;
  const [stickerID, setStickerId] = useState(0);

  const [maxHeightReached, setMaxHeightReached] = useState(false);
  const [previousTextLength, setPreviousTextLength] = useState(0);
  const MAX_INPUT_HEIGHT = hp('63%');

  // Dismiss snack message
  const onDismissSnack = () => setSnackIsVisible(false);

  // A function that handles the sticker selection, updating state and fetching sticker details
  const stickerSelected = async(sticker) => {
    // The function is only called if a sticker is selected and the total number of stickers is less than 10
    if (sticker != null && imageData.length < 10) {
      setCount(count - 1);

      const imageSource = images.stickers[sticker];
      const imageUri = Image.resolveAssetSource(imageSource).uri;
      var w;
      var h;
      Image.getSize(imageUri, (width, height) => {
        // console.log(sticker, width, height);

        w = width;
        h = height;
        setImageData([
          ...imageData,
          {
            id: stickerID,
            source: imageSource,
            x: bgWidth - width - width / 4,
            y: height / 4,
            initialX: bgWidth - width - width / 4,
            initialY: height / 4,
            width: width,
            height: height,
            screenWidth: bgWidth,
            screenHeight: bgHeight,
          },
        ]);

        // console.log("updated stickers 0");
        setLetterInfo((prevLetterInfo) => ({
          ...prevLetterInfo,
          stickers: [
            ...prevLetterInfo.stickers,
            {
              id: stickerID,
              source: imageSource,
              x: bgWidth - width - width / 4,
              y: height / 4,
              initialX: bgWidth - width - width / 4,
              initialY: height / 4,
              width: width,
              height: height,
              screenWidth: bgWidth,
              screenHeight: bgHeight,
            },
          ]
        }));
      });
      setStickerId(stickerID+1);
    }
  };

  // We can ignore the non-serializable warnings as our child component ChangeStickerScreen
  // has no deep links nor state persistence, which must be handled.
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);


  // create a letter when the screen loads in if it does not already exist
  useEffect(() => {
    const makeLetter = async () => {
      if (letterInfo.letterID === "") {
        try {
          resp = await axios.post(findIP() + "/api/makeLetter", letterInfo);
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
      }
    };
    makeLetter();
  }, []);


  // Automatically saves to the backend as the user types.
  const updateBackend = async () => {
    try {
      resp = await axios.post(findIP() + "/api/updateLetterInfo", letterInfo);
      if (!resp) {  // Could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // Another backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleTextChange = (text) => {
    setNextButtonDisabled(true);
    throttledUpdate(text);
    setInputText(text);
  };

  const throttledUpdate = useCallback(throttle((newText) => {
    setLetterInfo((prevLetterInfo) => ({ ...prevLetterInfo, text: newText }));
  }, 750), []); // called to every 750ms

  useEffect(() => {
    if (!isFocused) {
      throttledUpdate.cancel();
    }
  }, [isFocused, throttledUpdate]);


  // update the database with the current details of the letter
  useEffect(() => {
    if (letterInfo.status == "draft" && letterInfo.letterID != "") {
      updateBackend();
      setNextButtonDisabled(false);
    }
  }, [letterInfo]);


  // this is only called when the screen is navigated to
  useFocusEffect(
    useCallback(() => {
      if (letterInfo.status == "") {
        setLetterInfo({ ...letterInfo, status: "draft" });
      }
    }, [letterInfo])
  );

  const handleNextPressed = () => { // Navigates to the next screen, Preview    
    setNextButtonDisabled(true);
    setTimeout(() => {
      setNextButtonDisabled(false);
    }, 1000);
    
    navigation.push('Preview');
  };

  const renderTopBar = () => {
    if (keyboard) {
      return (
        <View style={{ flexDirection: "row", alignSelf: "center" }}>   
          <Toolbar navigation={navigation} passedStickerSelected={stickerSelected}/>
          <View style={{ alignContent: "flex-end" }}>
            <TouchableOpacity style={internalStyles.doneOutline} onPress={() => Keyboard.dismiss()}>
              <Text style={internalStyles.doneBtn}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <View style={{ alignContent: "flex-start" }}>
            <ThreeButtonAlert navigation={navigation}/>
          </View>
          <Toolbar navigation={navigation} passedStickerSelected={stickerSelected}/>
        </View>
      )
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {renderTopBar()}
      <Text style={styles.normalText}>{imageData.length >= 10 ? 'No more stickers!' : ``}</Text>
      {/* <ConditionalScrollView condition={keyboard}> */}
      <ScrollView style={{width: wp('100%')}} scrollEnabled={keyboard} >
        <ImageBackground
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              setBgWidth(width);
              setBgHeight(height);
            }}
            resizeMode={'cover'}
            style={{ flex: 1, width: '100%', height: '100%' }}
            source={images.themes[letterInfo.themeID]}>
            <Input
              style={{
                fontFamily: letterInfo.fontID,
                marginTop: hp('2.16%'),
                fontSize: wp('5%'),
                height: hp('65.88%'),
                width: wp('90%'),
                marginLeft: wp('1.17%'),
                marginRight: wp('1.17%'),
              }}
              placeholder={"Start writing your letter!"}
              inputContainerStyle={{ borderBottomWidth: 0 }}
              onChangeText={(newText) => {
                if (!maxHeightReached || newText.length <= inputText.length) {
                  // setInputText(newText);
                  handleTextChange(newText);
                }
              }}
              multiline={true}
              defaultValue={defaultText}
              autoCapitalize="none"
              onFocus={() => setKeyboard(true)}
              onBlur={() => setKeyboard(false)}
              onContentSizeChange={(event) => {
                if (event.nativeEvent.contentSize.height > MAX_INPUT_HEIGHT) {
                  setMaxHeightReached(true);
                } else {
                  setMaxHeightReached(false);
                }
              }}
              value={inputText}
            />
          {imageData.map((data, index) => { // creates a separate Pan Responder for each image in the imageData array
            const stickerPanResponder = PanResponder.create({
              onMoveShouldSetPanResponder: () => true,
              onPanResponderGrant: (e, gestureState) => {
                setSelectedStickerIndex(index);
                setInitialStickerPosition({ x: gestureState.x0, y: gestureState.y0 });
              },
              onPanResponderMove: (event, gestureState) => {

                if (selectedStickerIndex === index) {
                  const dx = gestureState.moveX - initialStickerPosition.x;
                  const dy = gestureState.moveY - initialStickerPosition.y;
                  const updatedImageData = [...imageData];
                  updatedImageData[selectedStickerIndex] = {
                    ...updatedImageData[selectedStickerIndex],
                    // do not delete! 
                    // old sticker movement
                    // x: updatedImageData[selectedStickerIndex].initialX + dx,
                    // y: updatedImageData[selectedStickerIndex].initialY + dy,
                    x: Math.max(0, Math.min(bgWidth - updatedImageData[selectedStickerIndex].width, updatedImageData[selectedStickerIndex].initialX + dx)),
                    y: Math.max(0, Math.min(bgHeight - updatedImageData[selectedStickerIndex].height, updatedImageData[selectedStickerIndex].initialY + dy)),
                  };
                  setImageData(updatedImageData);
                }
              },
              onPanResponderRelease: (event, gestureState) => {
                if (selectedStickerIndex === index) {
                  const updatedImageData = [...imageData];
                  updatedImageData[selectedStickerIndex] = {
                    ...updatedImageData[selectedStickerIndex],
                    initialX: updatedImageData[selectedStickerIndex].x,
                    initialY: updatedImageData[selectedStickerIndex].y,
                  };
                  setImageData(updatedImageData);
                  setInitialStickerPosition(null);
                  setSelectedStickerIndex(null);
                  setLetterInfo((prevLetterInfo) => ({
                    ...prevLetterInfo,
                    stickers: updatedImageData
                  }));
                

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
        {keyboard
        ? <View style={{height: hp('30%'), width: wp('100%')}}></View>
        : <></>
        }
      </ScrollView>
      {/* </ConditionalScrollView> */}

      <KeyboardAvoidingView style={{ flexDirection: 'row' }}>
        <ButtonPrimary title={"Next!"} selected={true} disabled={nextButtonDisabled} onPress={handleNextPressed} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ComposeScreen;

const internalStyles = StyleSheet.create({
  doneBtn: {
    fontSize: wp("5%"),
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  doneOutline: {
    justifyContent: 'center', 
    height: wp("13%"), 
  }

});
