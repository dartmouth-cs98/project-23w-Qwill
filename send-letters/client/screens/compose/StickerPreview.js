import React from 'react';
import { StyleSheet, Text, Dimensions, View } from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler'
import { Image } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
          <Text style={styles.themeNameText} allowFontScaling={false}>{props.stickerName}</Text>
        </View>
        
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  containerTheme: {
    width: wp('90%'),
    height: hp('27%'),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#E2E8F6',
    borderRadius: wp('5.33%'),
    marginTop: hp('1.35%')
  },
  theme: {
    height: undefined, 
    width: wp('45%'),
    aspectRatio: 1,
    resizeMode: "contain"
  },
  titleContainer: {
    height: hp('24.32%'),
    width: wp('50%'),
  },
  themeNameText: {
    fontSize: hp('4.05%'), 
    fontFamily: 'JosefinSansBold',
    fontWeight: 'bold',
    flex: 1,
    marginTop: hp('10.14%')
  }
});
export default StickerPreview;
