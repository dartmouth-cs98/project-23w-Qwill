import { Text, View, FlatList, TouchableOpacity, } from 'react-native';
import React, { useState, useContext, useEffect } from 'react'
import { Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { ComposeContext } from '../../context/ComposeStackContext';
import { hasRestrictedChar, truncate } from '../../helpers/stringValidation';
import styles from '../../styles/Profile.component.style';
import { Snackbar } from 'react-native-paper';
import SelectRecipientButton from '../../components/SelectRecipientButton';


function SelectRecipientScreen({navigation}) {
  const [userInfo, setUserInfo] = useContext(AuthContext);
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
      letterID: "",
      text: "",
      recipientID: "",
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

  const handleChangeText = async (text) => {    
    const newText = text.toLowerCase();
    const senderID = userInfo.user._id;  

    // no need to connect to server if text contains restricted characters
    if (hasRestrictedChar(text) == true) {
      setMatchingUsers([]);
      return;
    }

    try {
      const resp = await axios.post(findIP()+"/api/matchUsers", { senderID, textToMatch: newText, friends: true, returnSelf: true });
      
      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        console.error(error);
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
    setLetterInfo({...letterInfo, recipientID: item._id, recipientUsername: item.username});
    navigation.push('SelectTheme');
  };

  // this function renders the users that match the text in the input component
  function renderMatches() {
    if (matchingUsers.length == 0) {
      return <Text style={{textAlign:'center'}}>No users found</Text>
    }
    return (
      <View>
        <FlatList
          nestedScrollEnabled
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: "center"}}
          data={matchingUsers}
          numColumns={3}
          renderItem={({item}) => <SelectRecipientButton userInfo={item} onPress={() => handleNextPressed(item)}/>}
          keyExtractor={item => item.username}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flexDirection: 'column', flex: 1, alignItems: 'center', marginTop: 20 }}>
      <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15}}>
        <TouchableOpacity onPress={()=>handleGoBack()}>
          <Ionicons name={"arrow-back"} size={40}/>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row'}}>
        <Text style={styles.titleText}>Compose</Text>
      </View>
      <View style={[styles.recipientsContainer]}>
        <Text style={styles.selectTitleText}>Select a recipient</Text>
        <View style={styles.inputContainer}>
          <Input 
            placeholder="enter name or username"
            autoCompleteType="email"
            autoCapitalize="none"
            onChangeText={handleChangeText}
            inputContainerStyle={{borderBottomWidth:0, backgroundColor: 'white', height: 32, borderRadius: 5}}
            leftIcon={{ type: 'font-awesome', name: 'search', size: 15, marginLeft: 10}}
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
