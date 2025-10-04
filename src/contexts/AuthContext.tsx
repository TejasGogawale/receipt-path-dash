import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'manager' | 'employee' | 'director' | 'assistant_manager' | 'finance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  country: string;
  currency: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, country: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const countryCurrencyMap: Record<string, string> = {
  'United States': 'USD',
  'United Kingdom': 'GBP',
  'India': 'INR',
  'Canada': 'CAD',
  'Australia': 'AUD',
  'Germany': 'EUR',
  'France': 'EUR',
  'Japan': 'JPY',
  'China': 'CNY',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in production, this would call an API
    const mockUser: User = {
      id: '1',
      name: email.includes('admin') ? 'Admin User' : email.includes('manager') ? 'Manager User' : 'Employee User',
      email,
      role: email.includes('admin') ? 'admin' : email.includes('manager') ? 'manager' : 'employee',
      country: 'United States',
      currency: 'USD',
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signup = async (name: string, email: string, password: string, country: string) => {
    const currency = countryCurrencyMap[country] || 'USD';
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'employee',
      country,
      currency,
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
