import React, { useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shopData, setShopData] = useState(null);

  function handleLoginSuccess(shop, phone) {
    setShopData(shop);
    setIsLoggedIn(true);
  }

  if (isLoggedIn) {
    return (
      <DashboardScreen
        shopId={shopData?.id}
        shopName={shopData?.shop_name}
      />
    );
  }

  return (
    <LoginScreen onLoginSuccess={handleLoginSuccess} />
  );
}