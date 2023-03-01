import { Text, View, StyleSheet, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import FriendPreview from '../../components/FriendPreview';

function FriendsScreen({navigation}) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{flexDirection: "row", justifyContent: 'space-between', marginTop: 20, marginRight: 10}}>
          <Text style={styles.titleText}>Friends</Text>
          <TouchableOpacity style={styles.btn} onPress={() => {navigation.navigate("PendingFriends")}}>
            <Ionicons 
              name="time-outline" 
              size={40}>
              </Ionicons>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => {navigation.navigate("PendingFriends")}}>
            <Ionicons 
            name="person-add-outline" 
            size={40}
            >
            </Ionicons>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, marginTop: 20}}>
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
    fontFamily: 'JosefinSansBold',
    fontSize: 50, 
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: 20, 
    marginTop: 5
  },
  btn: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  }
});