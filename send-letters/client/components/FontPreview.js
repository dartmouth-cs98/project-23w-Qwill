import React from 'react';
import { StyleSheet, Text, View, Dimensions, PixelRatio  } from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const scale = windowWidth / 390; // Scale factor for font size on 390 width screen

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const FontPreview = props => {
    return (
        <View>
            <TouchableOpacity style={styles.container} onPress={props.onPress}>
                <Text style={[styles.font, props.style]}>AaBbCc</Text>
            </TouchableOpacity>
            <Text style={[styles.title, props.style]}>{props.title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: windowWidth*.25,
        aspectRatio: 1,
        borderWidth: normalize(1),
        borderRadius: normalize(20),
        borderStyle: 'dashed',
        borderColor: "#000000",
        justifyContent: "center",
    },
    font: {
        textAlign: "center",
        fontSize: normalize(20),
        // letterSpacing: -5,
    },
    title: {
        textAlign: "center",
        fontSize: normalize(10)
    },
});

export default FontPreview;