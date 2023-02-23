import React from "react";
import {View, StyleSheet, Image} from "react-native";

const ProfileButton = (props) => {
  return (
    <View>
      <Image style={styles.picture} source={props.profileImage}/>
    </View>

  )
}

const styles = StyleSheet.create({
  picture: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
  }

});

export default ProfileButton