import React from 'react';
import styles from './Styles.js';
import { Text, View } from 'react-native';

// Citation: https://dev.to/gedalyakrycer/ohsnap-manage-global-styles-in-react-native-334
// Shadow Citation: https://blog.logrocket.com/applying-box-shadows-in-react-native/

const UnopenedLetter = props => {
  return (
    <View style={[styles.item, styles.shadow]}>
      <Text style={styles.letterTextHeader}>{props.sender}{"\n"}{props.senderAddress}</Text>
      <Text style={styles.letterTextCenter}>{props.recipient}{"\n"}{props.recipientAddress}</Text>
    </View>
  )
};

export default UnopenedLetter;