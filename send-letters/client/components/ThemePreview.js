import React from 'react';
import { StyleSheet, Text } from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { Image } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ThemePreview = props => {
  return (
    <TouchableOpacity
      style={{}}
      onPress={props.onPress}
    >
        <Image 
          style={styles.theme}
          source={props.imageSource}
        />
        <Text style={styles.themeNameText}>{props.themeName}</Text>
        
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerTheme: {
    width: wp('90%'),
    height: hp('21.6%'),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#E2E8F6',
    borderRadius: 20,
    marginTop: 10
  },
  theme: {
    height: undefined, 
    width: wp('45%'),
    //justifyContent: 'center',
    //alignItems: 'center',
    aspectRatio: 1,
    resizeMode: "contain",
  },
  titleContainer: {
    height: hp('19.44%'),
    width: wp('50%'),
  },
  themeNameText: {
    fontSize: hp('1.94%'), 
    fontFamily: 'JosefinSansBold',
    fontWeight: 'bold',
    flex: 1,
    textAlign: "center",
    marginTop: "8%"
  }
});

export default ThemePreview;
