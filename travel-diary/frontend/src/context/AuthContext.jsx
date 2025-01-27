import React, { createContext, useState, useEffect } from "react";
import api from '../api';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const existingToken = localStorage.getItem("token");
  const [authState, setAuthState] = useState({
    token: existingToken || null,
    isAuthenticated: existingToken ? true : false,
    username: "",
    avatar: null,
    trips: [],
    diaries: [],
  });

  const setAuthInfo = async ({ token }) => {
    if (token) {
      localStorage.setItem('token', token);
      setAuthState((prevState) => ({
        ...prevState,
        token,
        isAuthenticated: true,
      }));
      await fetchUserDetails(token);
    } else {
      console.error('Token is undefined');
    }
  };  

  const fetchUserDetails = async () => {
    try {
      const response = await api.get('/auth/details');
      const userData = response.data;
  
      setAuthState((prevState) => ({
        ...prevState,
        username: userData.username,
        avatar: userData.avatar,
      }));
  
      const tripsRes = await api.get('/trips');
      const trips = tripsRes.data;
  
      const diariesRes = await api.get('/diaries');
      const diaries = diariesRes.data;
  
      setAuthState((prevState) => ({
        ...prevState,
        trips,
        diaries,
      }));
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      token: null,
      isAuthenticated: false,
      username: "",
      avatar: null,
      trips: [],
      diaries: [],
    });
  };

  useEffect(() => {
    if (authState.token && !authState.username) {
      fetchUserDetails(authState.token);
    }
  }, [authState.token]);

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState,
        setAuthInfo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
