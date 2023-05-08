import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const FontPreview = props => {
  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={props.onPress}
      >
        <Text style={[styles.font, props.style]}>AaBbCc</Text>
      </TouchableOpacity>
      <Text style={[styles.title, props.style]}>{props.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp('25%'),
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: wp('5%'),
    borderStyle: 'dashed',
    borderColor: "#000000",
    justifyContent: "center",
  },
  font: {
    textAlign: "center",
    fontSize: wp('5%'),
    // letterSpacing: -5,
  },
  title: {
    textAlign: "center",
    fontSize: wp('2%')
  },
});

export default FontPreview;
