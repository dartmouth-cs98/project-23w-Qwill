import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import React, { useContext, useState } from 'react';
import ButtonPrimary from '../../components/ButtonPrimary';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { ComposeContext } from '../../context/ComposeStackContext';
import FontPreview from '../../components/FontPreview';
import fontData from '../../assets/fontData';
import styles from '../../styles/Profile.component.style';


const SelectFontScreen = ({navigation}) => {

  const [letterInfo, setLetterInfo] = useContext(ComposeContext);

  const handleNextPressed = (selectedFont) => {
      setLetterInfo({...letterInfo, fontID: selectedFont});
      navigation.push('ComposeHome');
  };

  const selectFontGoBack = () => {
    navigation.navigate('SelectTheme');
  }

  return (
    <SafeAreaView style={{flexDirection: 'column', flex: 1, marginTop: 20 }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity style={styles.backIcon} onPress={()=>composeStackGoBack(navigation, selectFontGoBack)}>
          <Ionicons name={"arrow-back"} size={40}/>
        </TouchableOpacity>
        <Text style={styles.selectTitleText}>Select a font</Text>
      </View>
      <View style={{alignSelf: "center"}}>
        <View style={styles.fontsContainer}>
          <View style={{flexDirection: "row", marginTop: 20}}>
            <FlatList
              contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
              data={fontData}
              numColumns={3}
              renderItem={({item}) => 
                <View style={{marginLeft: 10, marginRight: 10}}>
                  <FontPreview style={item.style} title={item.title} onPress={() => handleNextPressed(item.title)}></FontPreview>
                </View>}
              keyExtractor={(item) => item.title}
            />
          </View>
      </View>
    </View>
  </SafeAreaView>
  );
};

export default SelectFontScreen;
