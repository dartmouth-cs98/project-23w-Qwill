import { StyleSheet } from 'react-native';
// Separating styles from component code src: https://www.reactnative.guide/8-styling/8.3-separating-styles-from-component.html

export default StyleSheet.create({
  titleText: {
    fontFamily: 'JosefinSansBold',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: 30,
    marginTop: 5
  },
  line: {
    width: 110,
    height: 0,
    borderWidth: 1,
    borderColor: "#737B7D",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 8
  },
  container: {
    height: 94,
    width: 312,
    backgroundColor: "#97ACE2",
    borderRadius: 20,
    marginBottom: 15
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  profilePicture: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: "#000000",
    position: "absolute",
    left: 18,
    top: 11
  },
  username: {
    fontSize: 11,
    position: "absolute",
    top: 72,
    left: 18
  },
  letterContainer: {
    position: "absolute",
    left: 100,
    top: 0
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: 'white',
  },
  scrollView: {
    height: 200,
  },
  titleText: {
    fontFamily: 'JosefinSansBold',
    fontSize: 50,
    fontWeight: 'bold',
    flex: 1,
    textAlign: "center",
    // marginLeft: -10
  },
  recipientsContainer: {
    width: 350,
    height: 585,
    borderRadius: 20,
    marginTop: 20,
    flex: 1,
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  selectTitleText: {
    fontSize: 35,
    fontWeight: "400",
    justifyContent: "center",
    textAlign: 'center',
    marginTop: 15,
    // textDecorationLine: 'underline'
  },
  inputContainer: {
    width: 285,
    marginLeft: 30,
    marginTop: 10
  },
});