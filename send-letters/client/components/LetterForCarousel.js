import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';

// Citation: https://dev.to/gedalyakrycer/ohsnap-manage-global-styles-in-react-native-334
// Shadow Citation: https://blog.logrocket.com/applying-box-shadows-in-react-native/

const ITEM_WIDTH = Math.round(Dimensions.get('window').width * 0.95);

const LetterForCarousel = props => {
  const letterStatus = props.letterStatus;

  return (
    <View style={{margin: 0}}>
      <ImageBackground 
        style={styles.imageBackground}
        source={letterStatus === "read" ? require('../assets/openedLetter.png') : require('../assets/letter.png')}>
          <TouchableOpacity 
          style={styles.item}
          onPress={props.onPress}>
            <Text style={styles.letterTextHeader}>{props.sender}{"\n"}{props.senderAddress}</Text>
            <Text style={styles.letterTextCenter}>{props.recipient}{"\n"}{props.recipientAddress}</Text>
          </TouchableOpacity>
      </ImageBackground>
    </View>
  )
};

const styles = StyleSheet.create({
    imageBackground: {
        width: ITEM_WIDTH * 1.03,
        height: ITEM_WIDTH * 1.03  // do not change, this is the aspect ratio of the letter png
    },
    item : {
        height: ITEM_WIDTH * .7,
        width: ITEM_WIDTH,
        borderRadius: 3, 
        position: 'absolute',
        left: 0, 
        bottom: 0
    },
    letterTextHeader: {
      fontSize: 20,
      position: "absolute",
      left: ITEM_WIDTH * .07,
      top: ITEM_WIDTH * .03
    }, 
    letterTextCenter: {
      fontSize: 20,
      position: "absolute",
      left: ITEM_WIDTH * .37,
      top: ITEM_WIDTH * .25
    }

});

export default LetterForCarousel;