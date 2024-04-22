import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Routes, Route } from 'react-router';
import LoginPage from './Pages/LoginPage';
import './App.css';
import Registration from './Pages/Registration';
import Dashboard from './Pages/Admin-Dashboard';
import EmployeeDashboard from './Pages/Employee-Dasboard';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage/>}/>
      <Route path='/registration' element={<Registration/>}/>
      <Route path='/admin-dashboard' element={<Dashboard/>}/>
      <Route path='/user-dashboard' element={<EmployeeDashboard/>}/>
    </Routes>
  );
}

export default App;
