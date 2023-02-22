import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

// Citation: https://dev.to/gedalyakrycer/ohsnap-manage-global-styles-in-react-native-334

const ButtonPrimary = props => {
  const selected = props.selected;

  // If the button's text is longer, we can make the button a bit wider
  const textWidth = textWidth ? textWidth : 95;

  if (selected) {
    return (
        <TouchableOpacity
          style={[styles.btn, styles.selectedBtn]}
          onPress={props.onPress}
        >
          <Text style={[styles.text, styles.selectedText, {width: textWidth}]}>{props.title}</Text>
        </TouchableOpacity>
    );
  }
  else {
    return (
        <TouchableOpacity
          style={[styles.btn, styles.unselectedBtn]}
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
      fontWeight: "700",
      fontSize: 18,
      lineHeight: 18,
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      letterSpacing: 0.3,
      color: "#FFFFFF",
    },
    selectedText: {
        color: "#FFFFFF",
    }, 
    unselectedText: {
        color: "#7184B4",
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
      marginLeft: 10
  },
    selectedBtn: {
        backgroundColor: "#7184B4",
    },
    unselectedBtn: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#7184B4",
        borderStyle: "solid",
      }
});

export default ButtonPrimary;