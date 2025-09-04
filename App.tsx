import React, { useState, useCallback } from 'react';
import LoginScreen from './components/screens/LoginScreen';
import MainScreen from './components/screens/MainScreen';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleLogin = useCallback((loggedInUser: User, token: string) => {
    setUser(loggedInUser);
    setAccessToken(token);
  }, []);

  const handleLogout = useCallback(() => {
    if (accessToken) {
      window.google?.accounts.oauth2.revoke(accessToken, () => {});
    }
    setUser(null);
    setAccessToken(null);
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      {user && accessToken ? (
        <MainScreen user={user} accessToken={accessToken} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;