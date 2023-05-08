import { ComposeContext } from '../../context/ComposeStackContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, FlatList } from 'react-native';
import fontData from '../../assets/fontData';
import FontPreview from '../../components/FontPreview';
import React, { useContext } from 'react';
import styles from '../../styles/Profile.component.style';

const ChangeFontScreen = ({ navigation }) => {

  const [letterInfo, setLetterInfo] = useContext(ComposeContext);

  const handleNextPressed = (selectedFont) => {
    setLetterInfo({ ...letterInfo, fontID: selectedFont, fontName: selectedFont });
    navigation.goBack(null);
  };
  
  return (
    <SafeAreaView style={styles.safeview}>
      <View style={styles.defaultFontsContainer}>
        <View style={{ flexDirection: "row" }}>
          <FlatList
            ListHeaderComponent={<Text style={styles.selectTitleText}> Select a font </Text>}
            contentContainerStyle={{ justifyContent: 'center' }}
            data={fontData}
            numColumns={3}
            renderItem={({ item }) =>
              <View style={{ marginLeft: 5, marginRight: 5 }}>
                <FontPreview style={item.style} title={item.title} onPress={() => handleNextPressed(item.title)}></FontPreview>
              </View>}
            keyExtractor={(item) => item.title}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangeFontScreen;