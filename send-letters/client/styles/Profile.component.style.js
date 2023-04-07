import { StyleSheet } from 'react-native';
// Separating styles from component code src: https://www.reactnative.guide/8-styling/8.3-separating-styles-from-component.html

export default StyleSheet.create({
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
    // backgroundColor: "#ACC3FF",
    borderRadius: 20,
    marginTop: 20,
    flex: 1,
  },
  friendCircle: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: "rgba(30,70,147,0.2)",
    // backgroundColor: "white",
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    // borderWidth: 1,
    // borderColor: 'black'
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
  friendMidText: {
    textAlign: "center",
    // textAlignVertical: "center",
    fontSize: 20,
    color: "#1E4693",
    opacity: 1,
    marginTop: 21,
    fontWeight: "600"
    // backgroundColor: "rgba(0,0,0,1)" 
  }
});
