import { ComposeContext } from '../../context/ComposeStackContext';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import fontData from '../../assets/fontData';
import FontPreview from '../../components/FontPreview';
import React, { useContext, useState } from 'react';
import styles from '../../styles/Profile.component.style';


const SelectFontScreen = ({ navigation }) => {

  const [letterInfo, setLetterInfo] = useContext(ComposeContext);

  const handleNextPressed = (selectedFont) => {
    setLetterInfo({ ...letterInfo, fontID: selectedFont });
    navigation.push('ComposeHome');
  };

  const selectFontGoBack = () => {
    navigation.navigate('SelectTheme');
  }

  return (
    <SafeAreaView style={styles.safeview}>
      <View style={styles.backbutton}>
        <TouchableOpacity onPress={() => composeStackGoBack(navigation, selectFontGoBack)}>
          <Ionicons name={"arrow-back"} size={40} />
        </TouchableOpacity>
        <Text style={styles.selectTitleText}>Select a font</Text>
      </View>
      <View style={styles.fontsContainer}>
        <View style={{ flexDirection: "row" }}>
          <FlatList
            contentContainerStyle={{ justifyContent: 'center' }}
            data={fontData}
            numColumns={3}
            renderItem={({ item }) =>
              <View style={{ marginLeft: 5, marginRight: 5 }}>
                <FontPreview style={item.style} title={item.title} onPress={() => handleNextPressed(item.title)}></FontPreview>
              </View>}
            keyExtractor={(item) => item.title}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectFontScreen;

