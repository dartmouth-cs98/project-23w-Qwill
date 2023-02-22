import {StyleSheet} from "react-native";
import {COLORS} from '../styles/colors';

const styles = StyleSheet.create({
  item: {
    backgroundColor: COLORS.cream300,
    height: 70,
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10
  },
  shadow: {
    shadowColor: COLORS.blue900,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  letterTextHeader: {
    fontSize: 5,
    position: "absolute",
    left: 3,
    top: 3
  },
  letterTextCenter: {
    fontSize: 5,
    position: "absolute",
    left: 30,
    top: 30
  }
});

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

export default {styles, buttons};