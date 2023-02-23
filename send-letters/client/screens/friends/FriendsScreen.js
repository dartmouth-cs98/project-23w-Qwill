import { Text, View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import FriendPreview from '../../components/FriendPreview';

function FriendsScreen({navigation}) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{flexDirection: "row", justifyContent: 'space-between', marginTop: 20}}>
          <Text style={styles.titleText}>Friends</Text>
          <Ionicons 
            style={styles.icons} 
            name="time-outline" 
            size={40}
            onPress={() => {navigation.navigate("PendingFriends")}}></Ionicons>
          <Ionicons 
          style={styles.icons} 
          name="person-add-outline" 
          size={40}
          onPress={() => {navigation.navigate("AddFriends")}}></Ionicons>
        </View>
        <View>
          <FriendPreview username="trogers428"></FriendPreview>
          <FriendPreview username="user1234"></FriendPreview>
          <FriendPreview username="trogers428"></FriendPreview>
        </View>
      </SafeAreaView>

      
    );
  }

export default FriendsScreen;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 40, 
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: 20
  },
  icons: {
    marginRight: 15
  }
});