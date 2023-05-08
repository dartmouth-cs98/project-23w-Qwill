import { ComposeContext } from '../../context/ComposeStackContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, ScrollView, Dimensions } from 'react-native';
import { useContext, useEffect } from 'react';
import images from '../../assets/imageIndex';
import React from 'react';
import styles from '../../styles/Profile.component.style';
import ThemePreview from '../../components/ThemePreview';

const screenWidth = Dimensions.get('window').width;

const ChangeThemeScreen = ({ navigation, route }) => {

  const [letterInfo, setLetterInfo] = useContext(ComposeContext);

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
        fontID: "",
        fontName: "",
        customFont: false,
        stickers: []
      });
    }
    navigation.goBack();
  };

  // Get the list of themes from the images index under assets
  const themesList = Object.keys(images.themes);

  return (
    <SafeAreaView style={styles.safeview}>
      <View style={styles.themeContainer}>
        <Text style={styles.selectTitleText}>Select a theme</Text>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContainer}
        >
          {themesList.map((theme) => {
            return (
              <ThemePreview key={theme} themeName={theme} imageSource={images.themes[theme]} onPress={() => handleNextPressed(theme)} />
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
};

export default ChangeThemeScreen;
