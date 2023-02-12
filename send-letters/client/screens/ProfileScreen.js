import { StyleSheet, Text, View } from 'react-native';
import {Button} from 'react-native-elements';


function ProfileScreen({navigation}) {

  const handleSignOutPressed = () => {
    navigation.replace('SignIn')
  }
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile</Text>
        <Button containerStyle={styles.button} onPress={() => handleSignOutPressed()} title="Sign Out"/>
      </View>
    );
  }

export default ProfileScreen;

const styles = StyleSheet.create({
  button: {
      width: 200, 
      marginTop: 10,
  },
});