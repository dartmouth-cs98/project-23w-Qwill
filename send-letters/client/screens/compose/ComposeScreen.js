import { ComposeContext } from '../../context/ComposeStackContext';
import { Image, Text, View, ImageBackground, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import { LogBox, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import ButtonPrimary from '../../components/ButtonPrimary';
import findIP from '../../helpers/findIP';
import images from '../../assets/imageIndex';
import React, { useState, useContext } from 'react'
import styles from '../../styles/Profile.component.style';
import Toolbar from './Toolbar';
import ThreeButtonAlert from './ThreeButtonAlert';

function ComposeScreen({ navigation, route }) {
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);
  const [imageData, setImageData] = useState([]);
  const [sticker, setSticker] = useState(null);
  const [count, setCount] = useState(10);

  // Passed into child screen ChangeStickerScreen and called from there
  const stickerSelected = (sticker) => {
    if (sticker != null && imageData.length < 10) {
      setCount(count - 1);

      const imageSource = images.stickers[sticker];
      const imageUri = Image.resolveAssetSource(imageSource).uri;
      Image.getSize(imageUri, (width, height) => {
        console.log(sticker, width, height);
        setImageData([...imageData, { source: imageSource, x: 425 - (width) - (width / 4), y: (height / 4) }]);
      });
      setSticker(null);
    }
  }

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
    Keyboard.dismiss;
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

  const updateBackend = async (reqBody) => {
    try {
      resp = null;
      if (letterInfo.letterID == "") {
        // letter hasn't been made in DB (never saved as a draft); make new letter with status draft
        resp = await axios.post(findIP() + "/api/makeLetter", reqBody);
      } else {
        // letter exists in DB as a draft; update new info
        resp = await axios.post(findIP() + "/api/updateLetterInfo", reqBody);
      }
      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else {
        setLetterInfo({ ...letterInfo, letterID: resp.data.letterID });
      }
    } catch (err) {
      console.error(err);
    }


    const handleExitPressed = () => {
      navigation.replace('NavBar',
        {
          screen: 'Home',
          params: {
            screen: 'Mailbox',
            params: {
            }
          }
        }
      );
    }

    const handleNextPressed = () => {
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
          <TouchableWithoutFeedback onPress={handleScreenTapped} accessible={false}>
            <View style={{ flex: 1 }}>
              <Input
                style={{ fontFamily: letterInfo.fontID, marginTop: 20, fontSize: 22, height: 610, width: '90%', marginLeft: 5, marginRight: 5 }}
                placeholder={"Start writing your letter!"}
                inputContainerStyle={{ borderBottomWidth: 0 }}
                onChangeText={(text) => { hasTyped = true; handleTextChange(text); }}
                multiline={true}
                defaultValue={defaultText}
                autoCapitalize='none'
              />
            </View>
          </TouchableWithoutFeedback>
          {imageData.map((data, index) => (
            <Image
              key={index}
              source={data.source}
              style={{ position: 'absolute', left: data.x, top: data.y }}
            />
          ))}
        </ImageBackground>
        <KeyboardAvoidingView style={{ flexDirection: 'row' }}>
          <ButtonPrimary title={"Next!"} selected={true} onPress={() => navigation.push('Preview')} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
}
export default ComposeScreen;
