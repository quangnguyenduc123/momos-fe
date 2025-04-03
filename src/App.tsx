import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import PrivateRoute from './components/PrivateRoute';
import DashboardScreen from './components/DashBoardScreen';
import LoginScreen from './screen/LoginScreen';

const App: React.FC = () => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardScreen />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;