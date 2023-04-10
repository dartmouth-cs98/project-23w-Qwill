import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {COLORS} from '../styles/colors';
// Citation: https://dev.to/gedalyakrycer/ohsnap-manage-global-styles-in-react-native-334

const ButtonBlue = props => {
  const selected = props.selected;

  // If the button's text is longer, we can make the button a bit wider
  const textWidth = props.textWidth ? props.textWidth : 95;

  // add in a margin top if wanted
  const marginTop = props.marginTop ? props.marginTop : 0;

  if (selected) {
    return (
        <TouchableOpacity
          style={[styles.btn, styles.selectedBtn, {marginTop: marginTop}]}
          onPress={props.onPress}
        >
          <Text style={[styles.text, styles.selectedText, {width: textWidth}]}>{props.title}</Text>
        </TouchableOpacity>
    );
  } 
  else {
    return (
        <TouchableOpacity
          style={[styles.btn, styles.unselectedBtn, {marginTop: marginTop}]}
          onPress={props.onPress}
        >
          <Text style={[styles.text, styles.unselectedText, {width: textWidth}]}>{props.title}</Text>
        </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
    text: {
      height: 18,
      fontStyle: "normal",
      fontFamily: "Mulish-Italic",
      fontWeight: "700",
      fontSize: 15,
      lineHeight: 18,
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
    paddingTop: 16,
    paddingRight: 18,
    paddingBottom: 16,
    paddingLeft: 18,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    marginRight: 10,
    marginLeft: 10,
  },
  selectedBtn: {
    backgroundColor: COLORS.blue700,
  },
  unselectedBtn: {
    backgroundColor: COLORS.blue400,
  }
});

export default ButtonBlue;