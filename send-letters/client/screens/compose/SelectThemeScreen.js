import { ComposeContext } from '../../context/ComposeStackContext';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, FlatList} from 'react-native';
import { useContext, useEffect } from 'react';
import images from '../../assets/imageIndex';
import React from 'react';
import styles from '../../styles/Profile.component.style';
import ThemePreview from '../../components/ThemePreview';

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
        ...letterInfo,
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

  const themesList = Object.keys(images.themes);

  return (
    <SafeAreaView style={styles.safeview}>
      <View style={[styles.header, styles.shadowLight]}></View>
      <View style={styles.backbutton}>
        <TouchableOpacity style={styles.backIcon} onPress={()=>composeStackGoBack(navigation, selectThemeGoBack)}>
          <Ionicons name={"arrow-back"} size={40}/>
        </TouchableOpacity>
        <Text style={styles.selectTitleText}>Select a theme</Text>
      </View>
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
    </SafeAreaView>
  );
};

export default SelectThemeScreen;
