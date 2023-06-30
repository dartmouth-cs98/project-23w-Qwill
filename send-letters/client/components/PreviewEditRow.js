import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PreviewEditRow = props => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={styles.textContainer}>
        <Text style={styles.categoryText} allowFontScaling={false}>{props.category}</Text>
        <Text style={styles.descriptionText} allowFontScaling={false}>{props.text}</Text>
      </View>
      {/* <Feather size={25} name='edit'></Feather> */}
  </View>
  )
};

export default PreviewEditRow;

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row', 
    flexGrow: 1, 
    justifyContent: 'space-between', 
  },
  categoryText: {
    fontFamily: 'JosefinSansBold',
    fontSize: wp('4.5%'),
    lineHeight: wp('5%')
  },
  descriptionText: {
    fontFamily: 'JosefinSans',
    fontSize: wp('4.5%'),
    lineHeight: wp('5%')
  }
});