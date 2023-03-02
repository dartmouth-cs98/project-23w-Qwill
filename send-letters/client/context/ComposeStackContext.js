import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { createContext } from 'react';
import React from 'react';

const ComposeContext = createContext();

const ComposeContextProvider = ({ children }) => {
    const [letterInfo, setLetterInfo] = useState({
        text: "",
        recipientID: 0,
        recipientUsername: "",
        themeID: "",
        fontID: ""
    });

    return (
        <ComposeContext.Provider value={[letterInfo, setLetterInfo]}>
            {children}
        </ComposeContext.Provider>
    );
};

export {ComposeContext, ComposeContextProvider};
