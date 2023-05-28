import { AuthContext } from '../../context/AuthContext';
import { ComposeContext } from '../../context/ComposeStackContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, FlatList, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Font from 'expo-font';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import fontData from '../../assets/fontData';
import FontPreview from '../../components/FontPreview';
import React, { useContext, useState, useEffect } from 'react';
import styles from '../../styles/Profile.component.style';

const ChangeFontScreen = ({ navigation }) => {

  const [userInfo, setUserInfo] = useContext(AuthContext);
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);
  const [customFonts, setCustomFonts] = useState("");
  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchCustomFonts();
  }, [isFocused]);

  const handleNextPressed = (selectedFont, selectedFontName, customFont) => {
    setLetterInfo({ ...letterInfo, fontID: selectedFont, fontName: selectedFontName, customFont: customFont });
    navigation.goBack(null);
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
      <Text style={styles.selectTitleText}> Select a font </Text>
      {
        customFonts.length == 0 ? ( 
          <></>
        ) : (
          <View style={styles.custom}>
            <FlatList
              contentContainerStyle={{ justifyContent: 'space-between'}}
              data={customFonts}
              numColumns={3}
              renderItem={({ item }) =>
                <View style={{ marginLeft: windowWidth *.025, marginRight: windowWidth *.025, marginBottom: windowHeight*.01}}>
                  <TouchableOpacity style={styles.removeButton} onPress={() => handleDeleteFontPressed(item)}>
                    <Ionicons name="remove-circle" size={20} color="#FF0000" style={styles.removeIcon}/>
                  </TouchableOpacity>
                  <FontPreview 
                    style={{fontFamily: item._id}}
                    customFont={true}
                    title={item.name}
                    displayName={item.name}
                    fontID={item._id}
                  />
                </View>
              }
              keyExtractor={(item) => item._id}
            />
          </View>
        )
      }
      <View style={{ flexDirection: "row", marginTop: windowHeight *.02 }}>
        <View style={styles.line}></View>
        <Text style={{fontSize: wp("3%") }}>Default Fonts</Text>
        <View style={styles.line}></View>
      </View>
      <View style={{ marginTop: windowHeight *.02, marginLeft: windowWidth *.06, marginRight: windowWidth *.06, flex: 3 }}>
        <FlatList
          contentContainerStyle={{ justifyContent: 'space-between'}}
          data={fontData}
          numColumns={3}
          renderItem={({ item }) =>
            <View style={{ marginLeft: windowWidth *.025, marginRight: windowWidth *.025, marginBottom: windowHeight*.01}}>
              <FontPreview 
                style={item.style}
                title={item.title}
                displayName={item.title}
              />
            </View>
          }
          keyExtractor={(item) => item.title}
        />
      </View>

    </SafeAreaView>
  );
};

export default ChangeFontScreen;