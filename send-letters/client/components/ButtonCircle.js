import React from 'react';
import {TouchableOpacity, StyleSheet, Dimensions, PixelRatio} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import COLORS from '../styles/colors'

const windowWidth = Dimensions.get('window').width;

const scale = windowWidth / 390; // Scale factor for font size on 390 width screen

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const ButtonCircle = props => {
  return (
    <TouchableOpacity
      style={buttons.containerBtn}
      onPress={props.onPress}
    >
      <Ionicons
        style={buttons.icon}
        name={props.icon}
        size={normalize(24)}
      >
      </Ionicons>
    </TouchableOpacity>
  );
};

const buttons = StyleSheet.create({
  icon: {
    display: "flex",
    alignItems: "center",
    color: COLORS.white,
  },
  containerBtn: {
    width: wp('13%'),
    height: wp('13%'),
    borderRadius: wp('6.5%'),
    backgroundColor: COLORS.blue700,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp('4%')
  }
});

export default ButtonCircle;