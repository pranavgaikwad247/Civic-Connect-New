
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app, this would be in a secure backend.
const mockUsers: User[] = [
    { _id: 'user_alice', name: 'Alice (Admin)', email: 'alice@example.com', password: 'password123', role: 'admin' },
    { _id: 'user_bob', name: 'Bob', email: 'bob@example.com', password: 'password123', role: 'user' },
];

const SESSION_KEY = 'civic_connect_user_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for a saved session on initial load
    try {
        const savedSession = localStorage.getItem(SESSION_KEY);
        if (savedSession) {
            const sessionUser = JSON.parse(savedSession);
            // In a real app, you'd validate this token against a backend.
            // For mock purposes, we find the user in our list.
            const existingUser = mockUsers.find(u => u._id === sessionUser._id);
            if (existingUser) {
                const { password, ...userToSet } = existingUser;
                setUser(userToSet);
            }
        }
    } catch (error) {
        console.error("Failed to parse user session from localStorage", error);
        localStorage.removeItem(SESSION_KEY);
    } finally {
        setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundUser = mockUsers.find(u => u.email === email && u.password === pass);
            if (foundUser) {
                const { password, ...userToSet } = foundUser;
                setUser(userToSet);
                localStorage.setItem(SESSION_KEY, JSON.stringify(userToSet));
                resolve();
            } else {
                reject(new Error("Invalid email or password."));
            }
        }, 800);
    });
  }, []);

  const register = useCallback(async (name: string, email: string, pass:string): Promise<void> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (mockUsers.some(u => u.email === email)) {
                reject(new Error("An account with this email already exists."));
                return;
            }
            const newUser: User = {
                _id: `user_${Date.now()}`,
                name,
                email,
                password: pass,
                role: 'user'
            };
            mockUsers.push(newUser);
            
            const { password, ...userToSet } = newUser;
            setUser(userToSet);
            localStorage.setItem(SESSION_KEY, JSON.stringify(userToSet));
            resolve();
        }, 800);
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout
  }), [user, loading, login, register, logout]);


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
