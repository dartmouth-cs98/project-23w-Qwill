import { StyleSheet, Text, View } from 'react-native';
import { useState, useContext, createContext } from 'react';
import React from 'react';
import { AuthContext } from './auth';

const ComposeContext = createContext();

const ComposeContextProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useContext(AuthContext);
    const [letterInfo, setLetterInfo] = useState({
        senderID: userInfo.user._id,
        letterID: "",
        text: "",
        recipientID: "",
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

export { ComposeContext, ComposeContextProvider };
