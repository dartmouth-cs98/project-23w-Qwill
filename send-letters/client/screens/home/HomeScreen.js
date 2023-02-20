import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/auth';
import axios from "axios";
import findIP from '../../helpers/findIP';


// https://stackoverflow.com/questions/41754471/change-button-color-react-native 
// The react Button component renders the native button on each platform it uses. Because of this, 
// it does not respond to the style prop. It has its own set of props.

function HomeScreen({navigation}) {

  const [state, setState] = useContext(AuthContext);
  const userID = state.user._id;
  const [mail, setMail] = useState("");

  // fetch the mail from the server
  useEffect(() => {
    async function fetchMail() {
      try {
        const resp = await axios.post(findIP()+"/api/receiveLetters", { userID });
        if (resp.error) {
          console.log(error);
        } else if (!resp.data || !resp.data.receivedLetters) {
          console.log("Error: the response does not contain the expected fields");
        } else {
          setMail(resp.data.receivedLetters);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchMail();
  }, []);

  console.log(mail);

  return (
    <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
      <View style={{ flexDirection:"row" }}>
          <TouchableOpacity
            style={styles.buttonStyleSelected}
          >
            <Text style={{color: "white"}}>Mailbox</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyleUnselected}
            onPress={() => navigation.replace('Drafts')}
          >
            <Text style={{color: "blue"}}>Drafts</Text>
          </TouchableOpacity>
      </View>

      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text>Welcome to the Mailbox page</Text>
        <Text>{JSON.stringify(mail)}</Text>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  buttonStyleSelected: {
    alignItems: 'center',
    backgroundColor: 'blue',
    width: '20%',
    padding: 10,
    borderRadius: 20,
  },
  buttonStyleUnselected: {
    alignItems: 'center',
    backgroundColor: 'white',
    width: '20%',
    padding: 10,
    borderRadius: 20,
    borderColor: 'blue',
    borderWidth: 1,
  }
});