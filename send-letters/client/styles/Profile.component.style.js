import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// Separating styles from component code src: https://www.reactnative.guide/8-styling/8.3-separating-styles-from-component.html

export default StyleSheet.create({
  header: {
    position: "absolute",
    backgroundColor: "#BDCCF2",
    width: "100%",
    height: "14%"
  },
  backbutton: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: wp('3%'),
    justifyContent: 'center',
    marginTop: wp('2%'),
  },
  button: {
    width: wp('46.5%'),
    marginTop: hp('1.07%'),
  },
  composeContainer: {
    position: 'absolute',
    left: '20%',
    top: '50%',
  },
  container: {
    height: hp('10.08%'), // (94/932) * 100% ≈ 10.08% of screen height
    width: wp('72.56%'), // (312/430) * 100% ≈ 72.56% of screen width
    backgroundColor: '#97ACE2',
    borderRadius: 20,
    marginBottom: hp('1.61%'), // (15/932) * 100% ≈ 1.61% of screen height
  },
  fontsContainer: {
    width: wp('82%'),
    height: hp('80%'),
    borderRadius: 20,
    flex: 1,
  },
  letterContainer: {
    position: 'absolute',
    left: wp('23%'), // (100/430) * 100% ≈ 23.26% of screen width
    top: 0,
  },
  inputContainer: {
    width: 285,
    marginLeft: 30,
  },
  line: {
    width: wp('25.58%'), // (110/430) * 100% ≈ 25.58% of screen width
    height: 0,
    borderWidth: 1,
    borderColor: '#737B7D',
    marginLeft: wp('2.33%'), // (10/430) * 100% ≈ 2.33% of screen width
    marginRight: wp('2.33%'), // (10/430) * 100% ≈ 2.33% of screen width
    marginTop: hp('0.86%'), // (8/932) * 100% ≈ 0.86% of screen height
  },
  profilePicture: {
    height: hp('6.01%'), // (56/932) * 100% ≈ 6.01% of screen height
    width: wp('13.02%'), // (56/430) * 100% ≈ 13.02% of screen width
    borderRadius: wp('6.51%'), // (28/430) * 100% ≈ 6.51% of screen width
    backgroundColor: '#000000',
    position: 'absolute',
    left: wp('4.19%'), // (18/430) * 100% ≈ 4.19% of screen width
    top: hp('1.18%'), // (11/932) * 100% ≈ 1.18% of screen height
  },
  recipientsContainer: {
    width: 350,
    height: 585,
    borderRadius: 20,
    flex: 1,
  },
  safeview: {
    flexDirection: 'column', flex: 1, alignItems: 'center'
  },
  scrollView: {
    height: 200,
  },
  selectTitleText: {
    marginBottom: hp('4%'),
    fontSize: wp('9%'),
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
    marginLeft: wp('3%')
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  subtitleText: {
    fontSize: 20,
    fontFamily: 'JosefinSansBold',
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom: 10
  },
  shadowLight: {
    shadowColor: '#171717',
    shadowOffset: {height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  titleText: {
    marginTop: 7,
    fontSize: wp('10%'),
    fontFamily: 'JosefinSansBold',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  username: {
    fontSize: wp('2.5%'), // (11/430) * 100% ≈ 2.56% of screen width
    position: 'absolute',
    top: hp('8%'), // (72/932) * 100% ≈ 7.73% of screen height
    left: wp('4%'), // (18/430) * 100% ≈ 4.19% of screen width
  },
  backIcon: {
    marginTop: wp('.0%')
  },
});
