import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Title hidding code by GPT4

const FontPreview = props => {

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={props.onPress}
      >
        <Text style={[styles.font, props.style]}>AaBbCc</Text>
      </TouchableOpacity>
      <View style={styles.titleContainer} >
        <Text style={[styles.title, props.style]} numberOfLines={1}>
          {props.title}
        </Text>
      </View>
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
    fontSize: wp('2.5%')
  },
  titleContainer: {
    width: wp('25%'),
    overflow: 'hidden',
  }
});

export default FontPreview;
