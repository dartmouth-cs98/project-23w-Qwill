import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import React from 'react';
import ThemePreview from '../../components/ThemePreview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { ComposeContext } from '../../context/ComposeStackContext';
import images from '../../assets/imageIndex';

const screenWidth = Dimensions.get('window').width;

const ChangeStickerScreen = ({navigation, route}) => {

  const [letterInfo, setLetterInfo] = useContext(ComposeContext);

  useEffect(() => {
    if (route.params) {
      const { recipientID, recipientUsername } = route.params;
      setLetterInfo({...letterInfo, recipientID: recipientID, recipientUsername: recipientUsername});
    }
  }, [route.params]);

  const handleNextPressed = (selectedTheme) => {
    // We'll change the letter info context for the whole compose stack only when we push next.
    setLetterInfo({...letterInfo, themeID: selectedTheme});
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
  const themesList = Object.keys(images.themes);

  return (
    <SafeAreaView style={{flexDirection: 'column', flex: 1, alignItems: 'center', marginTop: 20 }}>
      {/* <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15}}>
        <TouchableOpacity onPress={()=>composeStackGoBack(navigation, selectThemeGoBack)}>
          <Ionicons name={"arrow-back"} size={40}/>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row'}}>
        <Text style={styles.titleText}>Compose</Text>
      </View> */}
      <View style={styles.themeContainer}>
        <Text style={styles.selectTitleText}>Select a theme</Text>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContainer}
        >
            {themesList.map((theme) => {
            return (
              <ThemePreview key={theme} themeName={theme} imageSource={images.themes[theme]} onPress={() => handleNextPressed(theme)}/>
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
    // width: 500,
    // height: 585,
    // backgroundColor: "#ACC3FF",
    borderRadius: 20, 
    marginTop:20,
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
    shadowOffset: {width: -2, height: 4},
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