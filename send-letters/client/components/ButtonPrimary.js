import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/colors';
// Citation: https://dev.to/gedalyakrycer/ohsnap-manage-global-styles-in-react-native-334

const ButtonPrimary = props => {
  const selected = props.selected;
  if (selected) {
    return (
        <TouchableOpacity
          style={[styles.btn, styles.selectedBtn]}
          onPress={props.onPress}
        >
          <Text style={[styles.text, styles.selectedText]}>{props.title}</Text>
        </TouchableOpacity>
    );
  }
  else {
    return (
        <TouchableOpacity
          style={[styles.btn, styles.unselectedBtn]}
          onPress={props.onPress}
        >
          <Text style={[styles.text, styles.unselectedText]}>{props.title}</Text>
        </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
    text: {
        width: 95,
        height: 18,
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: 18,
        lineHeight: 18,
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        letterSpacing: 0.3,
        color: COLORS.white,
    },
    selectedText: {
        color: COLORS.white,
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
        marginLeft: 10
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