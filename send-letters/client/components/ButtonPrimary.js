import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Citation: https://dev.to/gedalyakrycer/ohsnap-manage-global-styles-in-react-native-334

const ButtonPrimary = (props) => {
  const selected = props.selected;
  const disabled = props.disabled;

  // If the button's text is longer, we can make the button a bit wider
  const textWidth = props.textWidth ? props.textWidth : wp('22.2%');

  // add in a margin top if wanted
  const marginTop = props.marginTop ? props.marginTop : 0;
  
  if (selected) {
    return (
        <TouchableOpacity
          style={[styles.btn, styles.selectedBtn, {marginTop: marginTop}]}
          onPress={props.onPress}
          disabled={disabled}
        >
          <Text style={[styles.text, styles.selectedText, {width: textWidth}]} allowFontScaling={false}>{props.title}</Text>
        </TouchableOpacity>
    );
  } else {
    return (
        <TouchableOpacity
          style={[styles.btn, styles.unselectedBtn, {marginTop: marginTop}]}
          onPress={props.onPress}
          disabled={disabled}
        >
          <Text style={[styles.text, styles.unselectedText, {width: textWidth}]} allowFontScaling={false}>{props.title}</Text>
        </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  text: {
    height: hp('2.5%'),
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: hp('2.2%'),
    lineHeight: hp('2.5%'),
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    letterSpacing: 0.3,
    color: COLORS.white,
  },
  selectedText: {
    color:  COLORS.white,
  },
  unselectedText: {
    color: COLORS.blue700,
  },
  btn: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: hp('1.8%'),
    paddingRight: wp('2.4%'),
    paddingBottom: hp('1.8%'),
    paddingLeft: wp('2.4%'),
    borderTopLeftRadius: hp('3.2%'),
    borderTopRightRadius: hp('3.2%'),
    borderBottomRightRadius: hp('3.2%'),
    borderBottomLeftRadius: hp('3.2%'),
    marginRight: wp('2.7%'),
    marginLeft: wp('2.7%')
  },
  selectedBtn: {
    backgroundColor: COLORS.blue700,
  },
  unselectedBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.blue700,
    borderStyle: "solid",
  }
});

export default ButtonPrimary;
