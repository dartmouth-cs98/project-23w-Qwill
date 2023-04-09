import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
//import styles from '../../styles/Profile.component.style.js';

const handleGoBack = () => {
  setLetterInfo({
    text: "",
    recipientID: 0,
    recipientUsername: "",
    themeID: "",
    fontID: ""
  });
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    navigation.navigate('Home');
  }
};

const AddFriendsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flexDirection: 'row', flex: 1, alignItems: 'left', marginTop: 20 }}>
      <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back"} size={40} />
        </TouchableOpacity>

      </View>
      <View><Text style={styles.titleText}>Add Friends</Text></View>
    </SafeAreaView>
  )
};

export default AddFriendsScreen;

const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'JosefinSansBold',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: 30,
    marginTop: 5
  },
})