import { ComposeContext } from '../../context/ComposeStackContext';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import fontData from '../../assets/fontData';
import FontPreview from '../../components/FontPreview';
import React, { useContext, useState, useEffect } from 'react';
import styles from '../../styles/Profile.component.style';
import { useIsFocused } from '@react-navigation/native';
import * as Font from 'expo-font';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { Snackbar } from 'react-native-paper';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SelectFontScreen = ({ navigation }) => {

  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const [userInfo, setUserInfo] = useContext(AuthContext);
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);
  const [customFonts, setCustomFonts] = useState("");

  const isFocused = useIsFocused();

  // fetch the users custom fonts from the server
  useEffect(() => {
    fetchCustomFonts();
  }, [isFocused]);

  const handleNextPressed = (selectedFontID, selectedFontName, customFont) => {
    setLetterInfo({ ...letterInfo, fontID: selectedFontID, fontName: selectedFontName, customFont: customFont });
    navigation.push('ComposeHome');
  };

  const selectFontGoBack = () => {
    navigation.navigate('SelectTheme');
  };

  const fetchCustomFonts = async () => {
    try {
      const resp = await axios.post(findIP()+"/api/fetchCustomFonts", { userID: userInfo.user._id });
      
      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else if (!resp.data || !resp.data.createdFonts) {
        console.error("Error: the response does not contain the expected fields");
      } else {
        // console.log(resp.data.createdFonts);
        for (const customFont of resp.data.createdFonts) {
          if (!Font.isLoaded(customFont._id)) {
            await Font.loadAsync({ [customFont._id]: customFont.firebaseDownloadLink });
          }
        }
        setCustomFonts(resp.data.createdFonts);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.safeview}>
      <View style={[styles.header, styles.shadowLight]}></View>
      <View style={styles.backbutton}>
        <TouchableOpacity onPress={() => composeStackGoBack(navigation, selectFontGoBack)}>
          <Ionicons name={"arrow-back"} size={40} />
        </TouchableOpacity>
        <Text style={styles.selectTitleText}>Select a font</Text>
      </View>
      
      {
        customFonts.length == 0 ? ( 
          <></>
        ) : (
          <View style={styles.customFontsContainer}>
            <View style={{flexDirection: "row", justifyContent: "center", marginBottom: 10}}>
              <View style={styles.line}></View>
              <Text style={{fontSize: 12}}>Custom Fonts</Text>
              <View style={styles.line}></View>
            </View>
            <FlatList
              contentContainerStyle={{ justifyContent: 'center'}}
              data={customFonts}
              numColumns={3}
              renderItem={({ item }) =>
              <View style={{ marginLeft: wp(1), marginRight: wp(1), marginVertical: hp(.3)}}>
                  <FontPreview 
                    style={{fontFamily: item._id}} 
                    title={item.name}
                    displayName={item.name}
                    onPress={() => handleNextPressed(item._id, item.name, true)}
                  />
                </View>
              }
              keyExtractor={(item) => item.title}
            />
          </View>
        )
      }

      <View style={styles.defaultFontsContainer}>
        <View style={{flexDirection: "row", justifyContent: "center", marginVertical: 10}}>
              <View style={styles.line}></View>
              <Text style={{fontSize: 12}}>Default Fonts</Text>
              <View style={styles.line}></View>
        </View>
        {/* <View style={{ flexDirection: "row" }}> */}
          <FlatList
            contentContainerStyle={{ justifyContent: 'center' }}
            data={fontData}
            numColumns={3}
            renderItem={({ item }) =>
            <View style={{ marginLeft: wp(1), marginRight: wp(1), marginVertical: hp(.3)}}>
                <FontPreview 
                  style={item.style} 
                  title={item.title}
                  displayName={item.title}
                  onPress={() => handleNextPressed(item.title, item.title, false)}
                />
              </View>}
            keyExtractor={(item) => item.title}
          />
        {/* </View> */}
      </View>

    </SafeAreaView>
  );
};


export default SelectFontScreen;

