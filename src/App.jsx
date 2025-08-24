import React from 'react';
import AppRouter from './AppRouter';
import { AuthProvider } from './context/AuthContext';
import $ from 'jquery';
window.$ = $;
window.jQuery = $;
const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;