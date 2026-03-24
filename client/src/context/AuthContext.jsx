import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, getMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cortex_token');
    if (!token) { setLoading(false); return; }
    getMe()
      .then(res => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('cortex_token');
        localStorage.removeItem('cortex_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    const { token, user } = res.data;
    localStorage.setItem('cortex_token', token);
    localStorage.setItem('cortex_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('cortex_token');
    localStorage.removeItem('cortex_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
