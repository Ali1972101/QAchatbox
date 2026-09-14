import React from "react";
import {useState, useEffect, createContext, useContext} from "react";

const AuthContext = createContext();
const AuthProvider = ({children}) => {
    const [token , setToken] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken) setToken(storedToken);
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                setUser(null);
            }
        }
    }, []);

    const login = (newToken, newUser = null) => {
        setToken(newToken);
        localStorage.setItem("token", newToken);
        if (newUser) {
            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));
        } else {
            setUser(null);
            localStorage.removeItem("user");
        }
       
        try {
            sessionStorage.removeItem('chat_selectedUser_v1');
            sessionStorage.removeItem('chat_messages_v1');
        } catch (e) {}
    };

    const logout = () => {
        setToken("");
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        try {
            sessionStorage.removeItem('chat_selectedUser_v1');
            sessionStorage.removeItem('chat_messages_v1');
        } catch (e) {}
    };

    return (
        <AuthContext.Provider value={{token, user, login, logout, setUser}}>
            {children}
        </AuthContext.Provider>
    );
}

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export { AuthProvider, useAuth };

