import React from "react";
import {View, StyleSheet, Image} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ProfileButton = (props) => {
  return (
    <View>
      <Image style={styles.picture} source={props.profileImage}/>
    </View>

  )
}

const styles = StyleSheet.create({
  picture: {
    width: wp('10%'), // Assuming the picture width is 10% of the screen width, we aren't using this currently so cannot check before conversion
    height: wp('10%'), // Assuming the picture height is 10% of the screen width
    borderRadius: wp('10%') / 2,
  }
});

export default ProfileButton