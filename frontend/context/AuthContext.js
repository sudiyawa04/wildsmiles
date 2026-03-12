import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('ws_token') || localStorage.getItem('ws_token');
    if (token) {
      authAPI.getMe()
        .then(({ data }) => setUser(data.user))
        .catch(() => clearAuth())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    Cookies.set('ws_token',   data.token,        { expires: 7, sameSite: 'strict' });
    Cookies.set('ws_refresh', data.refreshToken,  { expires: 30, sameSite: 'strict' });
    localStorage.setItem('ws_token',   data.token);
    localStorage.setItem('ws_refresh', data.refreshToken);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const { data } = await authAPI.register(payload);
    Cookies.set('ws_token', data.token, { expires: 7, sameSite: 'strict' });
    localStorage.setItem('ws_token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    Cookies.remove('ws_token');
    Cookies.remove('ws_refresh');
    localStorage.removeItem('ws_token');
    localStorage.removeItem('ws_refresh');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
