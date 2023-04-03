import React, { useState, useEffect, createContext} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [state, setState] = useState({
        user: null,
        token: "",
    });

    // handle expired token or 401 error
    const navigation = useNavigation();
    const token = state && state.token ? state.token : "";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.interceptors.response.use(
        async function (response) {
            return response;
        },
        async function (error) {
            let res = error.response;
            if (res && res.status && res.status === 401 && res.config && !res.config.__isRetryRequest) {
                await AsyncStorage.removeItem("auth-rn");
                setState({user: null, token: ""});
                navigation.navigate("SignIn");
            }
        }
    );

    // get user authentification
    useEffect(() => {
        const loadFromAsyncStorage = async () => {
            let data = await AsyncStorage.getItem("auth-rn");
            const parsed = JSON.parse(data);
            if (parsed !== null && parsed.user && parsed.token) {
                setState({ ...state, user: parsed.user, token: parsed.token });
            }
        };
        loadFromAsyncStorage();
    }, []);

    return (
        <AuthContext.Provider value={[state, setState]}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };