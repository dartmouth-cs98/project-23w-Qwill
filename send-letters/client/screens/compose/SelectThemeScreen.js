import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { Input } from 'react-native-elements';
import React from 'react';
import ThemePreview from '../../components/ThemePreview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

const SelectThemeScreen = ({navigation, route}) => {
  const { recipientID } = route.params;

  // Default theme set to string none
  const [themeID, setThemeID] = useState("none");

  const handleNextPressed = () => {
    navigation.push('SelectFont', {
        recipientID: recipientID,
        themeID: themeID
    });
  };

  const selectThemeGoBack = () => {
    navigation.replace('NavBar', {
        screen: 'Compose', 
        params: {
            screen: 'SelectRecipient',
            params: {
                recipientID: recipientID
            }
        }
    });
  };

  return (
    // <SafeAreaView style={{marginTop: 20}}>
    //   <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15}}>
    //     <Ionicons name={"arrow-back"} size={40} onPress={()=>composeStackGoBack(navigation, selectThemeGoBack)}/>
    //   </View>
    //   <Text>SelectThemeScreen</Text>
    //   <ButtonPrimary 
    //     title={"Next"}
    //     selected={true} 
    //     onPress={handleNextPressed}/>
    // </SafeAreaView>
    <SafeAreaView style={{flexDirection: 'column', flex: 1, alignItems: 'center', marginTop: 20 }}>
      <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15}}>
        <TouchableOpacity onPress={()=>composeStackGoBack(navigation, selectThemeGoBack)}>
          <Ionicons name={"arrow-back"} size={40}/>
        </TouchableOpacity>
        {/* <Text style={styles.titleText}>Compose</Text> */}
      </View>
      <View style={{ flexDirection: 'row'}}>
        <Text style={styles.titleText}>Compose</Text>
      </View>
      <View style={styles.themeContainer}>
        <Text style={styles.selectTitleText}>Select a theme</Text>
        <ScrollView style={styles.scrollView}>
          <ThemePreview themeName="Stars" onPress={handleNextPressed}></ThemePreview>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
};

export default SelectThemeScreen;

const styles = StyleSheet.create({
  themeContainer: {
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