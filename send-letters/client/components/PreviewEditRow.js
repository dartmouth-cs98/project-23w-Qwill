import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Feather } from '@expo/vector-icons';

const PreviewEditRow = props => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={styles.textContainer}>
        <Text style={styles.categoryText}>{props.category}</Text>
        <Text style={styles.descriptionText}>{props.text}</Text>
      </View>
      <Feather size={25} name='edit'></Feather>
  </View>
  )
};

export default PreviewEditRow;

const styles = StyleSheet.create({
    textContainer: {
      flexDirection: 'row', 
      flexGrow: 1, 
      justifyContent: 'space-between', 
      marginRight: 15
    },
    categoryText: {
      fontFamily:'JosefinSansBold',
      fontSize: 18,
      lineHeight: 18
    },
    descriptionText: {
      fontFamily: 'JosefinSans',
      fontSize: 18,
      lineHeight: 18
    }
});