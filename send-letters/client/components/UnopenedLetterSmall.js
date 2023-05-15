import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { StyleSheet, Text, TouchableOpacity } from 'react-native';

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
  item: {
      backgroundColor: '#EFF2CA',
      height: hp('8.1%'),
      width: wp('25.7%'),
      borderRadius: wp('0.7%'),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: hp('1.1%'),
  },
  shadow: {
      shadowColor: '#171717',
      shadowOffset: { width: -wp('0.47%'), height: hp('0.43%') },
      shadowOpacity: 0.2,
      shadowRadius: wp('0.7%'),
  },
  letterTextHeader: {
      fontSize: wp('1.17%'),
      position: "absolute",
      left: wp('1.17%'),
      top: hp('0.54%'),
  },
  letterTextCenter: {
      fontSize: wp('1.17%'),
      position: "absolute",
      left: wp('7%'),
      top: hp('3.24%'),
  }
});


export default UnopenedLetterSmall;