import { Text, View, StyleSheet, FlatList, ScrollView, TouchableOpacity, } from 'react-native';
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react'
import { Button, Input, Image } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/auth';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';


function SelectRecipientScreen({route, navigation}) {
  const [recipientField, setRecipientField] = useState("");
  const [state, setState] = useContext(AuthContext);
  const [matchingUsers, setMatchingUsers] = useState("");

    // This is callback for the composeStackGoBack default helper
    const selectRecipientGoBack = () => {
      navigation.navigate('Home');
    };

  const handleChangeText = async (text) => {    
    const newText = text.toLowerCase();
    const senderID = state.user._id;  

    const resp = await axios.post(findIP()+"/api/matchRecipient", { senderID, newText });
    if (resp.error) {
      console.log(error);
    } else if (!resp.data || !resp.data.matchingUsers) {
      console.log("Error: the response does not contain the expected fields");
    } else {
      setMatchingUsers(resp.data.matchingUsers);
    }
  };

  const handleNextPressed = (item) => {
    navigation.push('SelectTheme', {
      recipientID: item._id
    });
  };

  // this function renders the users that match the text in the input component
  function renderMatches() {

    if (matchingUsers.length == 0) {
      return <Text style={{textAlign:'center'}}>No users found</Text>
    }
    
    // return matchingUsers.map((item, index) => 
    //   // <Button 
    //   //   key={index}
    //   //   containerStyle={styles.button} 
    //   //   onPress={() => handleNextPressed(item)} title={JSON.stringify(item.username)}
    //   // />
    //   <TouchableOpacity style={styles.friendCircle} keyExtractor={(item) => item.title}>
    //     <Text>{(JSON.stringify(item.username)).replace(/["]/g, '')}</Text>
    //   </TouchableOpacity>
    // );
    return (
      <View style={{marginLeft: 30, marginRight: 30}}>
        <FlatList
          nestedScrollEnabled
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          data={matchingUsers}
          numColumns={3}
          
          renderItem={({item}) => 
            <View>
              <TouchableOpacity style={styles.friendCircle} onPress={() => handleNextPressed(item)} title={JSON.stringify(item.username)}>
                <Text style={styles.friendMidText}>{(JSON.stringify(item.name)).replace(/["]/g, '')[0]}</Text>
              </TouchableOpacity>
              <Text style={{textAlign: 'center', fontSize: 12}}>{(JSON.stringify(item.username)).replace(/["]/g, '')}</Text>
            </View>
            }
          keyExtractor={item => item.username}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flexDirection: 'column', flex: 1, alignItems: 'center', marginTop: 20 }}>
      <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15}}>
        <TouchableOpacity onPress={()=>composeStackGoBack(navigation, selectRecipientGoBack)}>
          <Ionicons name={"arrow-back"} size={40}/>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', marginLeft: 15, marginTop: 20}}>
        <Text style={styles.titleText}>Compose</Text>
      </View>
      <View style={[styles.recipientsContainer, styles.shadow]}>
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
        <ScrollView style={styles.scrollView}>
          <View>
            {renderMatches()}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SelectRecipientScreen;

const styles = StyleSheet.create({
  button: {
      width: 200, 
      marginTop: 10,
  },
  container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      backgroundColor: 'white',
  },
  scrollView: {
    height: 200,
  },
  titleText: {
    fontSize: 40, 
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: 20
  },
  recipientsContainer: {
    width: 350,
    height: 585,
    backgroundColor: "#ACC3FF",
    borderRadius: 20, 
    marginTop:20,
    flex: 1,
  },
  friendCircle: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: "rgba(30,70,147,0.2)",
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }, 
  selectTitleText: {
    fontSize: 35,
    fontWeight: "400",
    justifyContent: "center",
    textAlign: 'center', 
    marginTop: 15
  },
  inputContainer: {
    width: 285,
    marginLeft: 30,
    marginTop: 10
  }, 
  friendMidText: {
    textAlign: "center",
    // textAlignVertical: "center",
    fontSize: 20, 
    color: "#1E4693", 
    opacity: 1,
    marginTop: 21,
    fontWeight: "600"
    // backgroundColor: "rgba(0,0,0,1)" 
  }
});
