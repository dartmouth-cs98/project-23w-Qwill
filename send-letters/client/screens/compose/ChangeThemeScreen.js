import { ComposeContext } from '../../context/ComposeStackContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, FlatList } from 'react-native';
import { useContext } from 'react';
import images from '../../assets/imageIndex';
import React from 'react';
import styles from '../../styles/Profile.component.style';
import ThemePreview from '../../components/ThemePreview';

const ChangeThemeScreen = ({ navigation, route }) => {

  const [letterInfo, setLetterInfo] = useContext(ComposeContext);

  const handleNextPressed = (selectedTheme) => {
    // We'll change the letter info context for the whole compose stack only when we push next.
    setLetterInfo({ ...letterInfo, themeID: selectedTheme });
    navigation.goBack();
  };

  // Get the list of themes from the images index under assets
  const themesList = Object.keys(images.themes_min);

  return (
    <SafeAreaView style={styles.safeview}>
      <View style={styles.themeContainer}>
        <Text style={styles.selectTitleText}>Change the theme</Text>
        <FlatList
        style={styles.scrollView}
        contentContainerStyle={{}}
        data={themesList}
        numColumns={2}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={{marginBottom: "6%"}}>
            <ThemePreview
              key={item}
              themeName={item}
              imageSource={images.themes[item]}
              onPress={() => handleNextPressed(item)}
            />
          </View>
        )}
      />
      </View>
    </SafeAreaView>
  )
};

export default ChangeThemeScreen;
