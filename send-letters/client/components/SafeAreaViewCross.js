import { StyleSheet, Platform, StatusBar } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../styles/Profile.component.style';

export default StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});

function SafeAreaViewCross(props) {
    if (Platform.OS === 'ios') {
        return <SafeAreaView style={styles.safeview}> {props.children} </View>
    }

    else {
        return <View style={AndroidSafeArea}> {props.children} </View>
    }
}


