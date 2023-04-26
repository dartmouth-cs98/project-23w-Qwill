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
import styles from '../../styles/Profile.component.style';

const screenWidth = Dimensions.get('window').width;

const SelectThemeScreen = ({navigation, route}) => {

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
    navigation.push('SelectFont');
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
    <SafeAreaView style={{flex: 1, marginTop: 20 }}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={styles.backIcon} onPress={()=>composeStackGoBack(navigation, selectThemeGoBack)}>
          <Ionicons name={"arrow-back"} size={40}/>
        </TouchableOpacity>
        <Text style={styles.selectTitleText}>Select a theme</Text>
      </View>
      <View style={styles.themeContainer}>
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

export default SelectThemeScreen;
