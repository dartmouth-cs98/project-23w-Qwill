import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

// Citation: https://dev.to/gedalyakrycer/ohsnap-manage-global-styles-in-react-native-334

const ButtonPrimary = props => {
  const selected = props.selected;
  if (selected) {
    return (
        <TouchableOpacity
          style={styles.selectedBtn}
          onPress={props.onPress}
        >
          <Text style={styles.selectedText}>{props.title}</Text>
        </TouchableOpacity>
    );
  }
  else {
    return (
        <TouchableOpacity
          style={styles.unselectedBtn}
          onPress={props.onPress}
        >
          <Text style={styles.unselectedText}>{props.title}</Text>
        </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
    selectedText: {
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
        color: "#FFFFFF",
    }, 
    unselectedText: {
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
        color: "#7184B4",
    }, 
    selectedBtn: {
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 16,
        paddingRight: 18,
        paddingBottom: 16,
        paddingLeft: 18,
        backgroundColor: "#7184B4",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        marginRight: 10,
        marginLeft: 10
      },
      unselectedBtn: {
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 16,
        paddingRight: 18,
        paddingBottom: 16,
        paddingLeft: 18,
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: "#7184B4",
        borderStyle: "solid",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        marginRight: 10,
        marginLeft: 10
      }
});

export default ButtonPrimary;