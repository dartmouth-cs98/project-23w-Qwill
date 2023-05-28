import { StyleSheet, Text, View, Dimensions, ScrollView, ImageBackground, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import images from '../assets/imageIndex';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const LetterDetail = props => {
  const { text, fontID, themeID, width, height, stickers } = props;

  const propsWidth = width ? wp(String(width*100)) : wp('90%');
  const propsHeight = height ? hp(String(height*100)) : hp("64%");

  // we'll render the default system font unless a fontID is specified
  const textStyle = fontID == "" ? {} : {
    fontFamily: fontID,
    // marginLeft: wp('1.17%')*width, 
    // marginRight: wp('1.17%')*width, 
    // marginTop: hp('2.16%')*height
  };

  return (
    <View style={[styles.letter, { width: propsWidth, height: propsHeight }]}>
      <ImageBackground
        resizeMode={'cover'}
        style={{ flex: 1, width: '100%', height: '100%' }}
        source={themeID === "" ? null : images.themes[themeID]}>
        <View style={{ width: '100%', height: '100%' }}>
          <View style={{ marginLeft: hp("1.17%"), marginRight: hp('1.17%'), marginTop: hp('2.16%')}}>
            <Text style={[textStyle, {fontSize: wp("5%")*width}]}>{text}</Text>
          </View>
        </View>
        {stickers.map((data, index) => (
          <Image
            key={index}
            source={data.source}
            style={{ position: 'absolute', width: (data.width / data.screenWidth) * propsWidth, height: (data.height / data.screenWidth) * propsWidth, left: (data.x / data.screenWidth) * propsWidth, top: (data.y / data.screenHeight) * propsHeight }}
          />
        ))}
      </ImageBackground>
    </View>
  )

};

export default LetterDetail;

const styles = StyleSheet.create({
  letter: {
    backgroundColor: "#fdfef1",
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  }
});