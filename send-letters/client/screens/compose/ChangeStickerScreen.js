import { ComposeContext } from '../../context/ComposeStackContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, Text, View } from 'react-native';
import { useContext } from 'react';
import styles from '../../styles/Profile.component.style';
import images from '../../assets/imageIndex';
import React from 'react';
import ThemePreview from '../../components/ThemePreview';
import { widthPercentageToDP } from 'react-native-responsive-screen';

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
    <SafeAreaView style={styles.safeview}>
      <View style={styles.themeContainer}>
        <Text style={styles.selectTitleText}>Add a sticker</Text>
        <FlatList
          data={stickers}
          numColumns={2}
          keyExtractor={(item) => item}
          renderItem={({ item: sticker, index }) => (
            <View style={{ marginRight: index % 2 === 0 ? widthPercentageToDP('8%') : 0 }}>
              <ThemePreview
                key={sticker}
                stickerName={sticker}
                imageSource={images.stickers[sticker]}
                onPress={() => onStickerSelect(sticker)}
              />
            </View>
          )}
        />

      </View>
    </SafeAreaView>
  )
};

export default ChangeStickerScreen;