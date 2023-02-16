import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// https://stackoverflow.com/questions/41754471/change-button-color-react-native 
// The react Button component renders the native button on each platform it uses. Because of this, 
// it does not respond to the style prop. It has its own set of props.

function HomeScreen({navigation}) {
    return (
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        <View style={{ flexDirection:"row" }}>
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

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>Welcome to the Mailbox page</Text>
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