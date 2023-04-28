import React from 'react';
import { StyleSheet, Text, Dimensions, View } from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler'
import { Image } from 'react-native-elements';

const screenWidth = Dimensions.get('window').width;


const StickerPreview = props => {
  return (
    <TouchableOpacity
      style={styles.containerTheme}
      onPress={props.onPress}
    >
      <View style={{flexDirection: 'row'}}>
        <Image 
          style={styles.theme}
          source={props.imageSource}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.themeNameText}>{props.stickerName}</Text>
        </View>
        
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerTheme: {
    width: screenWidth*.9,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#E2E8F6',
    borderRadius: 20,
    marginTop: 10
  },
  theme: {
    height: undefined, 
    width: screenWidth*.45,
    aspectRatio: 1,
    resizeMode: "contain"
  },
  titleContainer: {
    height: 180,
    width: screenWidth*.5,
  },
  themeNameText: {
    fontSize: 30, 
    fontFamily: 'JosefinSansBold',
    fontWeight: 'bold',
    flex: 1,
    marginTop: 75
  }
});
export default StickerPreview;