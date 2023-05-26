import { ComposeContext } from '../../context/ComposeStackContext';
import { hasRestrictedChar, truncate } from '../../helpers/stringValidation';
import { TextInput } from 'react-native';
import { Input } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, FlatList, TouchableOpacity, } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import React, { useState, useContext, useEffect } from 'react'
import SelectRecipientButton from '../../components/SelectRecipientButton';
import styles from '../../styles/Profile.component.style';

function SelectRecipientScreen({ navigation }) {
  const [matchingUsers, setMatchingUsers] = useState("");
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);

  // For snackbar:
  // https://callstack.github.io/react-native-paper/snackbar.html
  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);

  // This is callback for the composeStackGoBack default helper
  const handleGoBack = () => {
    setLetterInfo({
      ...letterInfo,
      letterID: "",
      text: "",
      recipientID: "",
      recipientUsername: "",
      themeID: "",
      fontID: "",
      fontName: "",
      customFont: false,
      stickers: []
    });
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  const handleChangeText = async (text) => {
    const newText = text.toLowerCase();

    // no need to connect to server if text contains restricted characters
    if (hasRestrictedChar(text) == true) {
      setMatchingUsers([]);
      return;
    }

    try {
      const resp = await axios.post(findIP() + "/api/matchUsers", { senderID: letterInfo.senderID, textToMatch: newText, friends: true, returnSelf: true });

      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else if (!resp.data || !resp.data.matchingUsers) {
        console.error("Error: the response does not contain the expected fields");
      } else {
        setMatchingUsers(resp.data.matchingUsers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // update the matching users when the page is first (will correspond to all friends)
  useEffect(() => {
    handleChangeText("");
  }, []);

  const handleNextPressed = (item) => {
    setLetterInfo({ ...letterInfo, recipientID: item._id, recipientUsername: item.username });
    navigation.push('SelectTheme');
  };

  // this function renders the users that match the text in the input component
  function renderMatches() {
    if (matchingUsers.length == 0) {
      return <Text style={{ textAlign: 'center' }}>No users found</Text>
    }
    return (
      <FlatList
        nestedScrollEnabled
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: "center" }}
        data={matchingUsers}
        numColumns={3}
        renderItem={({ item }) => <SelectRecipientButton userInfo={item} onPress={() => handleNextPressed(item)} />}
        keyExtractor={item => item.username}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeview}>
      <View style={[styles.header, styles.shadowLight]}></View>
      <View style={styles.backbutton}>
        <TouchableOpacity style={styles.backIcon} onPress={() => handleGoBack()}>
          <Ionicons name={"arrow-back"} size={40} />
        </TouchableOpacity>
        <Text style={styles.selectTitleText}>Select a recipient</Text>
      </View>
      <View style={[styles.recipientsContainer]}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="enter name or username"
            autoCompleteType="email"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={handleChangeText}
            inputStyle={{ fontSize: wp("4%") }}
            inputContainerStyle={{ borderBottomWidth: 0, backgroundColor: 'white', height: wp('8%'), width: wp('85%'), borderRadius: 5 }}
            leftIcon={{ type: 'font-awesome', name: 'search', size: wp('4%'), marginLeft: wp('2%') }}
          />
        </View>
        <View>
          {renderMatches()}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectRecipientScreen;
