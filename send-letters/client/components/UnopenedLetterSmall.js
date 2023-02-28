import React from 'react';

import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

// Citation: https://dev.to/gedalyakrycer/ohsnap-manage-global-styles-in-react-native-334
// Shadow Citation: https://blog.logrocket.com/applying-box-shadows-in-react-native/

const UnopenedLetterSmall = props => {
  return (
    <TouchableOpacity 
      style={[styles.item, styles.shadow]}
      onPress={props.onPress}>
      <Text style={styles.letterTextHeader}>{props.sender}{"\n"}{props.senderAddress}</Text>
      <Text style={styles.letterTextCenter}>{props.recipient}{"\n"}{props.recipientAddress}</Text>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
    item : {
        backgroundColor : '#EFF2CA',
        height: 75,
        width: 110,
        borderRadius: 3, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    shadow: {
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    letterTextHeader: {
      fontSize: 5,
      position: "absolute",
      left: 5,
      top: 5
    }, 
    letterTextCenter: {
      fontSize: 5,
      position: "absolute",
      left: 30,
      top: 30
    }

});

export default UnopenedLetterSmall;