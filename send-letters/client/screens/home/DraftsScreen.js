import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import ButtonPrimary from '../../components/ButtonPrimary';

const DraftsScreen = ({navigation}) => {
  return (
    <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        <View style={{ flexDirection:"row" }}>
          <ButtonPrimary title="Mailbox" selected={false} onPress={() => navigation.replace('Mailbox')}></ButtonPrimary>
          <ButtonPrimary title="Drafts" selected={true} onPress={() => navigation.replace('Drafts')}></ButtonPrimary>
        </View>
        
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>Feature coming soon!</Text>
        </View>

      </SafeAreaView>
  );
};

export default DraftsScreen;