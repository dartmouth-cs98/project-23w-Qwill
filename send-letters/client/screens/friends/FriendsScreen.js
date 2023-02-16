import { Text, View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

function FriendsScreen({navigation}) {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
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
      </View>
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