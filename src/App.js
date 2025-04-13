import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import Dashboard from './component/Dashboard';
import Newuser from './component/Newuser';
import Newstore from './component/NewStore';
import StoreList from './component/Storelist';
import UserList from './component/Userlist';
import StoreCards from './component/StoreCard';
import Navbar from './component/Navbar';
import ProtectedRoute from './component/ProtectedRoute';
import ChangePassword from './component/ChangePassword';
import Stores from './component/Stores';
import StoreRatings from './component/Storeratings';
import UserRatings from './component/Useratings';
import './App.css'; 

const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/changepassword" element={<ProtectedRoute roles={['systemadmin',"normaluser","storeowner"]}><Navbar/><ChangePassword /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute roles={['systemadmin',"storeowner"]}><Navbar/><Dashboard /></ProtectedRoute>} />
          <Route path="/newuser" element={<ProtectedRoute roles="systemadmin"><Navbar/><Newuser /></ProtectedRoute>} />
          <Route path="/newstore" element={<ProtectedRoute roles="systemadmin"><Navbar/><Newstore /></ProtectedRoute>} />
          <Route path="/storelist" element={<ProtectedRoute roles="systemadmin"><Navbar/><StoreList /></ProtectedRoute>} />
          <Route path="/userlist" element={<ProtectedRoute roles="systemadmin"><Navbar/><UserList /></ProtectedRoute>} />
          <Route path="/storecards" element={<ProtectedRoute roles="normaluser"><Navbar/><StoreCards /></ProtectedRoute>} />
          <Route path="/mystores" element={<ProtectedRoute roles="storeowner"><Navbar/><Stores /></ProtectedRoute>} />
          <Route path="/mystorerating" element={<ProtectedRoute roles="storeowner"><Navbar/><StoreRatings /></ProtectedRoute>} />
          <Route path="/ratinglist" element={<ProtectedRoute roles="systemadmin"><Navbar/><UserRatings /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
