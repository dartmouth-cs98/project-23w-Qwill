import { ComposeContext } from '../../context/ComposeStackContext';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useContext} from 'react';
import images from '../../assets/imageIndex';
import React from 'react';
import ThemePreview from '../../components/ThemePreview';

const screenWidth = Dimensions.get('window').width;

const ChangeStickerScreen = ({ navigation, props, route }) => {
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);
  const { passedFunction } = route.params;

  onStickerSelect = (stickerid) => {
    passedFunction(stickerid);
    navigation.goBack(null);
  };

  // Get the list of themes from the images index under assets
  const stickers = Object.keys(images.stickers);

  return (
    <SafeAreaView style={{ flexDirection: 'column', flex: 1, alignItems: 'center', marginTop: 20 }}>
      <View style={styles.themeContainer}>
        <Text style={styles.selectTitleText}>Select a sticker</Text>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContainer}
        >
          {stickers.map((sticker) => {
            return (
              <ThemePreview key={sticker} stickerName={sticker} imageSource={images.stickers[sticker]} onPress={() => onStickerSelect(sticker)} />
            );
          })}
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
  },
  selectTitleText: {
    fontSize: 35,
    fontWeight: "400",
    justifyContent: "center",
    textAlign: 'center',
    marginTop: 15
  },
  scrollViewContainer: {
    alignItems: "center"
  }
});