import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
// import buttons from '../styles/Styles';
import COLORS from '../styles/colors'

const ButtonCircle = props => {
  return (
    <TouchableOpacity
      style={buttons.containerBtn}
      onPress={props.onPress}
    >
      <Ionicons
        style={buttons.icon}
        name={props.icon}
        size={24}
      >
      </Ionicons>
    </TouchableOpacity>
  );
};

const buttons = StyleSheet.create({
  icon: {
    display: "flex",
    alignItems: "center",
    color: COLORS.white,
  },
  containerBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.blue700,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15
  }
});

export default ButtonCircle;