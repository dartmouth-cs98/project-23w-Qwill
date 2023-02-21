import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// https://stackoverflow.com/questions/41754471/change-button-color-react-native 
// The react Button component renders the native button on each platform it uses. Because of this, 
// it does not respond to the style prop. It has its own set of props.


// calculate dimensions for the mailbox image
const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height * (.7);
const imageWidth = Math.round(imageHeight * .626);

function HomeScreen({navigation}) {
    return (
      <SafeAreaView style={{flexDirection: 'column', flex: 1, justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
        <View style={{ flex: 1, flexDirection:"row"}}>
            <TouchableOpacity
              style={styles.buttonStyleSelected}
            >
              <Text style={{color: "white"}}> Mailbox </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyleUnselected}
              onPress={() => navigation.replace('Drafts')}
            >
              <Text style={{color: "blue"}}> Drafts </Text>
            </TouchableOpacity>
        </View>

        <View style={{flex: 1}}></View>

        <View style={{flex: 8, justifyContent: 'center', alignItems: 'center'}} >
          <ImageBackground
            source={require('../../assets/mailboxempty.png')}
            style={{
              flex: 1,
              height: imageHeight,
              width: imageWidth}}>
                {/* TODO: conditionally render this if the mailbox is empty*/}
                <View style={{flex: 2, padding: '20%', justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{color: "#FFF", textAlign: 'center'}}>
                    You don't have any letters in your mailbox.
                  </Text>
              </View> 
              <View style={{flex: 3, alignItems: 'center'}}>
                <TouchableOpacity 
                  style={{backgroundColor:"white"}}
                  onPress={() => {navigation.navigate('Compose')}}>
                  <Text>
                    Send a letter
                  </Text>
                </TouchableOpacity>
              </View>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  }

export default HomeScreen;

const styles = StyleSheet.create({
  buttonStyleSelected: {
    alignItems: 'center',
    backgroundColor: 'blue',
    width: '30%',
    padding: 10,
    borderRadius: 20,
  },
  buttonStyleUnselected: {
    alignItems: 'center',
    backgroundColor: 'white',
    width: '30%',
    padding: 10,
    borderRadius: 20,
    borderColor: 'blue',
    borderWidth: 1,
  },
  buttonSendLetter: {
    backgroundColor: 'white',
    width: 40,
    height: 20
  }
});