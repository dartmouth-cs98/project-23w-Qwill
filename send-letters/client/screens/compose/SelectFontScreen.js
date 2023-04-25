import { ComposeContext } from '../../context/ComposeStackContext';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import fontData from '../../assets/fontData';
import FontPreview from '../../components/FontPreview';
import React, { useContext, useState } from 'react';

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
    <SafeAreaView style={{flexDirection: 'column', flex: 1, alignItems: 'center', marginTop: 20 }}>
    <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15}}>
      <TouchableOpacity onPress={()=>composeStackGoBack(navigation, selectFontGoBack)}>
        <Ionicons name={"arrow-back"} size={40}/>
      </TouchableOpacity>
      {/* <Text style={styles.titleText}>Compose</Text> */}
    </View>
    <View style={{ flexDirection: 'row'}}>
      <Text style={styles.titleText}>Compose</Text>
    </View>
    <View style={styles.fontsContainer}>
      <Text style={styles.selectTitleText}>Select a font</Text>
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
      {/* </ScrollView> */}
    </View>
  </SafeAreaView>
  );
};

export default SelectFontScreen;

const styles = StyleSheet.create({
  fontsContainer: {
    width: 350,
    height: 585,
    // backgroundColor: "#ACC3FF",
    borderRadius: 20, 
    marginTop:20,
    flex: 1,
  },
  titleText: {
    fontSize: 50, 
    fontFamily: 'JosefinSansBold',
    fontWeight: 'bold',
    flex: 1,
    textAlign: "center",
    // marginLeft: -60
  },
  selectTitleText: {
    fontSize: 35,
    fontWeight: "400",
    justifyContent: "center",
    textAlign: 'center', 
    marginTop: 15
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }, 
});