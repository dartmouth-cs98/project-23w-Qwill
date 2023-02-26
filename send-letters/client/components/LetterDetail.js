import { StyleSheet, Text, View, Dimensions, ScrollView, ImageBackground } from 'react-native';
import React from 'react';
import images from '../assets/imageIndex';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const LetterDetail = props => {
  const {text, fontID, themeID} = props;

  return (
      <View style={styles.letter}>
        <ImageBackground 
          resizeMode={'cover'}
          style={{ flex: 1, width: '100%', height: '100%'}} 
          source={themeID === 0 ? null : images.themes[themeID]}> 
        <ScrollView style={{width:'100%', height:'100%'}}>
          <View style={{padding: 20}}>
            <Text>{text}</Text> 
          </View>
        </ScrollView>
        </ImageBackground>
      </View>
  )
};

export default LetterDetail;

const styles = StyleSheet.create({
  letter: {
    backgroundColor: "#fdfef1",
    width: screenWidth * .9,
    height: screenHeight * .65,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
}
});