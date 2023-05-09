import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Citation: https://dev.to/gedalyakrycer/ohsnap-manage-global-styles-in-react-native-334

const ButtonBlue = props => {
  const marginTop = props.marginTop ? props.marginTop : 0;
  return (
    <TouchableOpacity
      style={[styles.btn, styles.unselectedBtn, { marginTop: marginTop }, props.style]}
      onPress={props.onPress}
    >
      <Text style={[styles.unselectedText]}>{props.title}</Text>
    </TouchableOpacity>
  );

};
const styles = StyleSheet.create({
  selectedText: {
    fontFamily: "Mulish-Italic",
    fontWeight: "bold",
    fontSize: wp('3.2%'),
    letterSpacing: wp('0.3%'),
    color: COLORS.blue400,
  },
  unselectedText: {
    fontFamily: "Mulish",
    fontWeight: "bold",
    fontSize: wp('3.2%'),
    letterSpacing: wp('0.3%'),
    color: COLORS.blue800,
  },
  btn: {
    alignItems: "center",
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('8%'),
    borderRadius: wp('5%'),
    marginHorizontal: wp('2%'),
  },
  selectedBtn: {
    backgroundColor: COLORS.blue700,
  },
  unselectedBtn: {
    backgroundColor: COLORS.blue400,
  }
});
export default ButtonBlue;
