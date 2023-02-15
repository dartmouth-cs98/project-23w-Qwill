import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const DraftsScreen = ({navigation}) => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection:"row" }}>
          <TouchableOpacity
            style={styles.buttonStyleUnselected}
            onPress={() => navigation.replace('Mailbox')}
          >
            <Text style={{color: "blue"}}> Mailbox </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyleSelected}
          >
            <Text style={{color: "white"}}> Drafts </Text>
          </TouchableOpacity>
        </View>
        
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>Welcome to the Drafts page</Text>
        </View>

      </View>
  );
}

export default DraftsScreen;

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