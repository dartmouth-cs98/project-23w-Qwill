import React from 'react';
import {TouchableOpacity} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import buttons from './Styles';

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

export default ButtonCircle;