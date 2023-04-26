import { ComposeContext } from '../../context/ComposeStackContext';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import images from '../../assets/imageIndex';
import React from 'react';
import ThemePreview from '../../components/ThemePreview';

const screenWidth = Dimensions.get('window').width;

const ChangeStickerScreen = ({ navigation, props, route }) => {
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);
  const { selectedStickerId, callbackId } = route.params;

  function getCallbackFunction(callbackId) {
    switch (callbackId) {
      case handleStickerSelectedId:
        return handleStickerSelected;
      default:
        return null;
    }
  }

  const { onStickerSelected } = route.params;

  function selectSticker(sticker) {
    // call the onStickerSelected function passed from the parent with the selected sticker ID and sticker object
    route.params.onStickerSelected(sticker.id, sticker);
  }  
  

  useEffect(() => {
    if (route.params) {
      const { recipientID, recipientUsername } = route.params;
      setLetterInfo({ ...letterInfo, recipientID: recipientID, recipientUsername: recipientUsername });
    }
  }, [route.params]);

  const handleNextPressed = (selectedTheme) => {
    // We'll change the letter info context for the whole compose stack only when we push next.
    setLetterInfo({ ...letterInfo, themeID: selectedTheme });
    navigation.goBack(null);
  };

  const selectThemeGoBack = () => {
    if (route.params) {
      setLetterInfo({
        letterID: "",
        text: "",
        recipientID: "",
        recipientUsername: "",
        themeID: "",
        fontID: ""
      });
    }
    // navigation.replace('NavBar', {
    //     screen: 'Compose', 
    //     params: {
    //         screen: 'SelectRecipient'
    //     }
    // });
    navigation.goBack();
  };

  // Get the list of themes from the images index under assets
  const stickers = Object.keys(images.stickers);

  return (
    <SafeAreaView style={{ flexDirection: 'column', flex: 1, alignItems: 'center', marginTop: 20 }}>
      <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15 }}>
        <TouchableOpacity onPress={() => composeStackGoBack(navigation, selectThemeGoBack)}>
          <Ionicons name={"arrow-back"} size={40} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.titleText}>Compose</Text>
      </View>
      <View style={styles.themeContainer}>
        <Text style={styles.selectTitleText}>Select a sticker</Text>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContainer}
        >
          {/* {stickers.map(sticker => (
            <TouchableOpacity key={sticker.id} onPress={() => selectSticker(sticker.id)}>
              <Image source={{ uri: sticker.image }} style={styles.sticker} />
            </TouchableOpacity>
          ))} */}
          {stickers.map((sticker) => {
            return (
              <ThemePreview key={sticker} stickerName={sticker} imageSource={images.stickers[sticker]} onPress={() => selectSticker(sticker)} />
            );
          })}
          {/* <ThemePreview themeName="Stars" imageSource={} onPress={handleNextPressed}></ThemePreview> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
};

export default ChangeStickerScreen;

const styles = StyleSheet.create({
  themeContainer: {
    borderRadius: 20,
    marginTop: 20,
    flex: 1,
    alignItems: 'center'
  },
  titleText: {
    fontSize: 50,
    fontFamily: 'JosefinSansBold',
    fontWeight: 'bold',
    flex: 1,
    textAlign: "center",
    // marginLeft: -60
  },
  selectTitleText: {
    fontSize: 35,
    fontWeight: "400",
    justifyContent: "center",
    textAlign: 'center',
    marginTop: 15
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  scrollView: {
    width: screenWidth
  },
  scrollViewContainer: {
    alignItems: "center"
  }
});