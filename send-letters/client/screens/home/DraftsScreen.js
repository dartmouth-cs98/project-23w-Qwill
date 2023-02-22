import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

import ButtonPrimary from '../../components/ButtonPrimary';

const DraftsScreen = ({navigation}) => {
  return (
    <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
      <View style={{ flexDirection:"row" }}>
        <ButtonPrimary 
        selected={false} 
        title={"Mailbox"} 
        onPress={() => navigation.replace('Mailbox')}/>
        <ButtonPrimary selected={true} title={"Drafts"} />
      </View>
      
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text>Feature coming soon!</Text>
      </View>
    </SafeAreaView>
  );
};

export default DraftsScreen;