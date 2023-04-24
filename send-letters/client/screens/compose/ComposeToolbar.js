import * as React from 'react';
import { Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ComposeToolbar = props => {
    return (
        <Toolbar>
            <ToolbarAction icon="person" />
            <ToolbarAction icon="text_fields" />
            <ToolbarAction icon="filter_b_and_w" />
            <ToolbarAction icon="sentiment_satisfied" />
            {/* onPress={navigation.push('ChangeRecipientScreen')}  */}
        </Toolbar>
    );

}

export default ComposeToolbar;