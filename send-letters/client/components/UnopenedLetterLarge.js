import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

// Citation: https://dev.to/gedalyakrycer/ohsnap-manage-global-styles-in-react-native-334
// Shadow Citation: https://blog.logrocket.com/applying-box-shadows-in-react-native/

const ITEM_WIDTH = Math.round(Dimensions.get('window').width * 0.95);

const UnopenedLetterLarge = props => {
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
        height: ITEM_WIDTH * .7,
        width: ITEM_WIDTH,
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
      fontSize: 10,
      position: "absolute",
      left: 15,
      top: 15
    }, 
    letterTextCenter: {
      fontSize: 10,
      position: "absolute",
      left: 95,
      top: 95
    }

});

export default UnopenedLetterLarge;