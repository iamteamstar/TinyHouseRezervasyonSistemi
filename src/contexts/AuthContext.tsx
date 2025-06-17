import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthUser, LoginRequest, RegisterRequest, Role } from '../types';
import { loginUser, registerUser } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: AuthUser | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isHouseOwner: boolean;
  isTenant: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      setLoading(true);
      const response = await loginUser(data);
      
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setCurrentUser(response.data);
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setLoading(true);
      const response = await registerUser(data);
      
      if (response.success) {
        toast.success('Registration successful! Please log in.');
        navigate('/login');
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isAdmin = currentUser?.roleId === Role.Admin;
  const isHouseOwner = currentUser?.roleId === Role.HouseOwner;
  const isTenant = currentUser?.roleId === Role.Tenant;

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isHouseOwner,
    isTenant,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};