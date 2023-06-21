import { COLORS } from '../styles/colors';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React from 'react';

// Citation: https://dev.to/gedalyakrycer/ohsnap-manage-global-styles-in-react-native-334

const ButtonEmptyMailbox = props => {
    return (
        <TouchableOpacity
            style={[styles.btn, styles.unselectedBtn]}
            onPress={props.onPress}>
            <Text style={[styles.text, styles.unselectedText]} allowFontScaling={false}>{props.title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    text: {
      fontFamily: 'JosefinSansBold',
      width: wp('30%'),
      height: hp('2.8%'),
      fontStyle: "normal",
      fontWeight: "700",
      fontSize: wp('4%'),
      lineHeight: hp('2.8%'),
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      letterSpacing: wp('0.3%'),
      color: COLORS.white,
    }, 
    unselectedText: {
        color: COLORS.black,
    }, 
    btn: {
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      paddingTop: hp('2%'),
      paddingRight: wp('3.6%'),
      paddingBottom: hp('1.3%'),
      paddingLeft: wp('3.6%'),
      borderTopLeftRadius: wp('12.8%'),
      borderTopRightRadius: wp('12.8%'),
      borderBottomRightRadius: wp('12.8%'),
      borderBottomLeftRadius: wp('12.8%'),
      marginRight: wp('2.7%'),
      marginLeft: wp('2.7%')
  },
    unselectedBtn: {
        backgroundColor: COLORS.white,
      }
});

export default ButtonEmptyMailbox;
