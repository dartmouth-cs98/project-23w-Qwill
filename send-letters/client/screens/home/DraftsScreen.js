import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

const DraftsScreen = ({navigation}) => {
  return (
    <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        <View style={{ flexDirection:"row" }}>
          <TouchableOpacity
            style={styles.buttonStyleUnselected}
            onPress={() => navigation.replace('Mailbox')}
          >
            <Text style={{color: "blue"}}>Mailbox</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyleSelected}
          >
            <Text style={{color: "white"}}>Drafts</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>Feature coming soon!</Text>
        </View>

      </SafeAreaView>
  );
};

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