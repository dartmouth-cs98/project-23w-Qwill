import React from 'react';

import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

// Citation: https://dev.to/gedalyakrycer/ohsnap-manage-global-styles-in-react-native-334
// Shadow Citation: https://blog.logrocket.com/applying-box-shadows-in-react-native/

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const scale = windowWidth / 390; // Scale factor for font size on 390 width screen

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const letterHistoryPreview = props => {
  return (
    <TouchableOpacity 
      style={[styles.item, styles.shadow]}
      onPress={props.onPress}>
      <Text style={{...styles.letterTextHeader, fontFamily: props.item.font}}>{props.item.sender}{"\n"}</Text>
      <Text style={{...styles.letterTextCenter, fontFamily: props.item.font}}>{props.item.recipient}{"\n"}</Text>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
    item : {
        backgroundColor : '#EFF2CA',
        // height: 75,
        // width: 110,
        width: windowWidth*.45,
        aspectRatio: 1.5,
        borderRadius: 3, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10
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

export default letterHistoryPreview;