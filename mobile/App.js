import React, { useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <DashboardScreen />;
  }

  return (
    <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
  );
}