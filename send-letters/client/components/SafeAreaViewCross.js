import { StyleSheet, Platform, StatusBar } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  safeview: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
});

export function SafeAreaViewCross(props) {
    //const Message = () =>
    const apple = (
        <SafeAreaView style={safeview}> {props.children} </SafeAreaView>
    );

    const android = (
        <View style={AndroidSafeArea}> {props.children} </View>
    );

    if (Platform.OS === 'ios') {
        return ()
    }

    else {
        const Message = () =>
    }

    return (Output);
}


