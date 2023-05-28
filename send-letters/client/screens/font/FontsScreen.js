import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, StyleSheet, FlatList, Dimensions, PixelRatio, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Font from 'expo-font';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import fontData from '../../assets/fontData';
import FontPreview from '../../components/FontPreview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect, useContext } from 'react';
import { Snackbar } from 'react-native-paper';
import { COLORS } from '../../styles/colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const scale = windowWidth / 390; // Scale factor for font size on 390 width screen

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const FontsScreen = ({navigation}) => {
  const [userInfo, setUserInfo] = useContext(AuthContext);
  const [customFonts, setCustomFonts] = useState("");

  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);

  const isFocused = useIsFocused();

  // fetch the users custom fonts from the server
  useEffect(() => {
    fetchCustomFonts();
  }, [isFocused]);

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

  const handleDeleteFontPressed = async (item) => {
    try {
      const resp = await axios.post(findIP()+"/api/deleteFont", { fontID: item._id });
      
      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else if (!resp.data || !resp.data.ok) {
        console.error("Error: the response does not contain the expected fields");
      } else {
        setSnackMessage("Font " + item.name + " successfully deleted");
        setSnackIsVisible(true);
        fetchCustomFonts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={{ alignItems: 'center', flex: 1, backgroundColor: "#F0F4FF" }}>
      <View style={[styles.header, styles.shadowLight]}></View>
      <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: wp("4%") }}>
        <Text style={styles.titleText}>Fonts</Text>
        <TouchableOpacity style={styles.btn} onPress={() => { navigation.navigate("InstructionsScreen") }}>
          <Ionicons name="pencil-outline" size={normalize(40)} ></Ionicons>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", marginTop: windowHeight *.04 }}>
        <View style={styles.line}></View>
        <Text style={{fontSize: wp("3%") }}>Custom Fonts</Text>
        <View style={styles.line}></View>
      </View>
      
      {
        customFonts.length == 0 ? ( 
          <View style={styles.noCustom}>
            <Text style={{ textAlign: 'center', marginTop: windowHeight *.02, fontSize: normalize(12) }}>You don't have any custom fonts yet.</Text>
            <Text style={{ textAlign: 'center', marginTop: windowHeight *.02, marginBottom: windowHeight *.02,textDecorationLine: 'underline', fontSize: normalize(12) }} onPress={() => navigation.navigate("InstructionsScreen")}>Add Custom Font</Text>
          </View>
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
      <Snackbar
          style={styles.snackbar}
          //SnackBar visibility control
          visible={snackIsVisible}
          onDismiss={() => {setSnackIsVisible(false)}}
          // short dismiss duration
          duration={2000}
          >
            <Text style={styles.snackBarText}>Letter sent!</Text>
        </Snackbar>
    </SafeAreaView>
  );
};

export default FontsScreen;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    backgroundColor: "#BDCCF2",
    width: wp("100%"),
    height: hp('15%')
  },
  shadowLight: {
    shadowColor: '#171717',
    shadowOffset: { height: hp(0.4) },
    shadowOpacity: 0.2,
    shadowRadius: hp(0.15),
  },
  titleText: {
    fontFamily: 'JosefinSansBold',
    fontSize: wp('12%'),
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: wp('4%'),
    marginTop: hp('0.8%')
  },
  line: {
    width: wp('30%'),
    height: 0,
    borderWidth: 1,
    borderColor: "#737B7D",
    marginLeft: wp('2%'),
    marginRight: wp('2%'),
    marginTop: hp('0.5%')
  },
  noCustom: {
    width: wp('80%'),
    borderRadius: wp('10%'),
    backgroundColor: "#E2E8F6",
    marginTop: hp('2%'),
  },
  custom: {
    width: wp('88%'),
    marginLeft: wp('6%'), 
    marginRight: wp('6%'),
    marginTop: hp('2%'),
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  text: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: 'white',
  },
  btn: {
    width: wp('18%'),
  },
  removeButton: {
    zIndex: 1,
  }, 
  removeIcon: {
    position: 'absolute',
    left: wp('22%'),
    top: -hp('.2%'),
    zIndex: 2,
  },
  snackbar: {
    opacity: 0.7,
    alignSelf: 'center',
    width: wp('70%'),
    bottom: hp('1.3%'),
    fontSize: wp('4%'),
    borderRadius: wp('4%'),
  },
  snackBarText: {
    color: COLORS.white,
    textAlign: 'center'
  }
});