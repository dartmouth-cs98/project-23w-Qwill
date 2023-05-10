import { Toolbar, ToolbarAction } from 'react-native-paper';
import * as React from 'react';

const ComposeToolbar = props => {
    return (
        <Toolbar>
            <ToolbarAction icon="person" />
            <ToolbarAction icon="text_fields" />
            <ToolbarAction icon="filter_b_and_w" />
            <ToolbarAction icon="sentiment_satisfied" />
        </Toolbar>
    );

}

export default ComposeToolbar;