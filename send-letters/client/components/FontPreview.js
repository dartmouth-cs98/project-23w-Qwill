import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler'


const FontPreview = props => {
    return (
        <View>
            <TouchableOpacity style={styles.container} onPress={props.onPress}>
                <Text style={[styles.font, props.style]}>AaBbCc</Text>
            </TouchableOpacity>
            <Text style={[styles.title, props.style]}>{props.title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 90,
        width: 90,
        borderWidth: 1,
        borderRadius: 20,
        borderStyle: 'dashed',
        borderColor: "#000000",
        justifyContent: "center",
        // marginLeft: 10,
        // marginRight: 10
    },
    font: {
        textAlign: "center",
        fontSize: 20
    },
    title: {
        textAlign: "center",
        fontSize: 10
    }
});

export default FontPreview;