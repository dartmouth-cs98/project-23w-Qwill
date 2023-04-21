import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/colors';
// Citation: https://dev.to/gedalyakrycer/ohsnap-manage-global-styles-in-react-native-334

const ButtonBlue = props => {
  const marginTop = props.marginTop ? props.marginTop : 0;
  return (
    <TouchableOpacity
      style={[styles.btn, styles.unselectedBtn, { marginTop: marginTop }]}
      onPress={props.onPress}
    >
      <Text style={[styles.unselectedText]}>{props.title}</Text>
    </TouchableOpacity>
  );
  // const selected = props.selected;

  // // If the button's text is longer, we can make the button a bit wider
  // const textWidth = props.textWidth ? props.textWidth : 300;

  // // add in a margin top if wanted
  // const marginTop = props.marginTop ? props.marginTop : 0;

  // if (selected) {
  //   return (
  //     <TouchableOpacity style={[styles.selectedBtn]} onPress={props.onPress}>
  //       <Text style={[styles.selectedText]}>{props.title}</Text>
  //     </TouchableOpacity>
  //   );
  // }
  // else {
  //   return (
  //     <TouchableOpacity
  //       style={[styles.btn, styles.unselectedBtn, { marginTop: marginTop }]}
  //       onPress={props.onPress}
  //     >
  //       <Text style={[styles.unselectedText]}>{props.title}</Text>
  //     </TouchableOpacity>
  //   );
  // }
};

const styles = StyleSheet.create({
  selectedText: {
    fontFamily: "Mulish-Italic",
    fontWeight: "heavy",
    fontSize: 15,
    letterSpacing: 0.3,
    color: COLORS.blue400,
  },
  unselectedText: {
    fontFamily: "Mulish",
    fontWeight: "900",
    fontSize: 15,
    letterSpacing: 0.3,
    color: COLORS.blue800,
  },
  btn: {
    alignItems: "center",
    padding: 16,
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