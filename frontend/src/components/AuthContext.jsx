import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false); // 🟡 to delay route check

    // ✅ Restore user from storage
    useEffect(() => {
        const storage = sessionStorage.getItem("token") ? sessionStorage : localStorage;

        const token = storage.getItem("token");
        const role = storage.getItem("role");
        const email = storage.getItem("email");
        const name = storage.getItem("name");
        const userId = storage.getItem("userId");

        if (token && role && email) {
            setUser({ token, role, email, name, id: userId });
        }

        setIsInitialized(true); // ✅ Mark complete
    }, []);

    // ✅ Login and store to session/local based on remember
    const login = ({ token, user }, remember = false) => {
        const storage = remember ? localStorage : sessionStorage;

        storage.setItem("token", token);
        storage.setItem("role", user.role);
        storage.setItem("email", user.email);
        storage.setItem("name", user.name);
        storage.setItem("userId", user.id);

        setUser({ token, ...user });
    };

    const logout = () => {
        sessionStorage.clear();
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isInitialized }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
