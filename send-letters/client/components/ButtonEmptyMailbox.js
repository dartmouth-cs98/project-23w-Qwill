import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

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
      color: "#FFFFFF",
    }, 
    unselectedText: {
        color: "#000000",
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
        backgroundColor: "#FFFFFF",
      }
});

export default ButtonEmptyMailbox;