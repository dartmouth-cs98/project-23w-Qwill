import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

const LetterDetailScreen = ({route}) => {
  const {letterText, letterId, letterIsRead} = route.params;

  return (
    <SafeAreaView>
      <Text>{letterText}</Text>
    </SafeAreaView>
  )
};

export default LetterDetailScreen;

const styles = StyleSheet.create({});