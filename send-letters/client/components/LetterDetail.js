import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const LetterDetail = props => {
  const text = props.text;
  return (
    <View style={styles.letter}>
      <Text>{text}</Text>
    </View>
  )
};

export default LetterDetail;

const styles = StyleSheet.create({
  letter: {
    backgroundColor: "#fdfef1",
    width: screenWidth * .9,
    height: screenHeight * .65,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
}
});