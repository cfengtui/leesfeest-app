import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

// Use environment variable for API base URL, fallback to relative URL for production
// When running with Vite locally, VITE_API_URL can be set to http://localhost:8000
// In production, use relative URLs since frontend may be served from same origin
const API_BASE = import.meta.env.VITE_API_URL || '';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('dmt_token'));
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await fetch(`${API_BASE}/token`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('dmt_token', data.access_token);
            setToken(data.access_token);
            await fetchUser(data.access_token);
            return true;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('dmt_token');
        setToken(null);
        setUser(null);
    };

    const fetchUser = async (accessToken) => {
        try {
            const response = await fetch(`${API_BASE}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                logout();
            }
        } catch (error) {
            console.error("Fetch user error:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
