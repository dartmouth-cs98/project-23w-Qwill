import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const FontPreview = props => {
    return (
        <TouchableOpacity style={styles.container}>
            <Text style={styles.font}>Aa</Text>
        </TouchableOpacity>
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
        justifyContent: "center"
    },
    font: {
        textAlign: "center",
        fontSize: 30
    }
});

export default FontPreview;