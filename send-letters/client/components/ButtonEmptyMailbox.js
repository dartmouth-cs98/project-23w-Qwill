import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import {COLORS} from '../styles/colors';

// Citation: https://dev.to/gedalyakrycer/ohsnap-manage-global-styles-in-react-native-334

const ButtonEmptyMailbox = props => {
    return (
        <TouchableOpacity
            style={[styles.btn, styles.unselectedBtn]}
            onPress={props.onPress}
        >
            <Text style={[styles.text, styles.unselectedText]}>{props.title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    text: {
      fontFamily: 'JosefinSansBold',
      width: 115,
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
    unselectedText: {
        color: COLORS.black,
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
    unselectedBtn: {
        backgroundColor: COLORS.white,
      }
});

export default ButtonEmptyMailbox;