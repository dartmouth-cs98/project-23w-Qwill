import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import React, { useContext, useState } from 'react';
import ButtonPrimary from '../../components/ButtonPrimary';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { ComposeContext } from '../../context/ComposeStackContext';
import FontPreview from '../../components/FontPreview';

const SelectFontScreen = ({navigation}) => {

  const [letterInfo, setLetterInfo] = useContext(ComposeContext);

   // Default font ID set to 0
   const [fontID, setFontID] = useState(letterInfo.fontID);

  const handleNextPressed = () => {
      setLetterInfo({...letterInfo, fontID: fontID});
      navigation.push('ComposeHome');
  };

  const selectFontGoBack = () => {
    navigation.navigate('SelectTheme');
  }

  return (
    // <SafeAreaView style={{marginTop: 20}}>
    //   <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15}}>
    //     <TouchableOpacity onPress={()=>composeStackGoBack(navigation, selectFontGoBack)}>
    //       <Ionicons name={"arrow-back"} size={40}/>
    //     </TouchableOpacity>
    //   </View>
    //   <Text>SelectFontScreen</Text>
    //   <ButtonPrimary 
    //     title={"Next"} 
    //     selected={true}
    //     onPress={handleNextPressed}/>
    // </SafeAreaView>
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
      {/* <ScrollView style={styles.scrollView}> */}
        <View style={{flexDirection: "row", marginTop: 20}}>
          <FlatList
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
            data={itemData}
            numColumns={3}
            renderItem={({item}) => 
              <View style={{marginLeft: 10, marginRight: 10}}>
                <FontPreview style={item.style} title={item.title} onPress={handleNextPressed}></FontPreview>
              </View>}
            keyExtractor={(item) => item.title}
          />
        </View>
      {/* </ScrollView> */}
    </View>
  </SafeAreaView>
  );
};

const itemData = [
  {
    style:{fontFamily: 'MyNerve'},
    title: "MyNerve"
  },
  {
    style:{fontFamily: 'GloriaHallelujah'},
    title: 'GloriaHallelujah'
  },
  {
    style:{fontFamily: 'HomemadeApple'},
    title: 'HomemadeApple'
  },
  {
    style:{fontFamily: 'IndieFlower'},
    title: 'IndieFlower'
  },
  {
    style:{fontFamily: 'ShadowsIntoLight'},
    title: 'ShadowsIntoLight'
  },
  {
    style:{fontFamily: 'Mansalva'},
    title: 'Mansalva'
  },
  {
    style:{fontFamily: 'PTSans'},
    title: 'PTSans'
  },
  {
    style:{fontFamily: 'LibreBaskerville'},
    title: 'LibreBaskerville'
  },
];

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