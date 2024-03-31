// src/App.js

import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import PostUserInfo from './components/PostUserInfo';
import UserList from './components/UserList';
import SaearchUser from './components/SearchUser';
import FavoriteUserList from './components/FavoriteUserList';
import ConfirmRegister from './components/ConfirmRegister';
import DeleteUser from './components/DeleteUser';
import DeleteAllUser from './components/DeleteAllUser';
import RegisterUser from './components/RegisterUser';
import Login from './components/Login';
import Logout from './components/Logout';

import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Cookies from 'js-cookie'; // js-cookieライブラリのインポート

import Layout from './layout/Layout'; // Layoutコンポーネントのインポート




function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // クッキーからログイン状態を取得
    // const token = Cookies.get('token');
    console.log("aaaaa");
    const user_uuid = Cookies.get('user_uuid');
    const username = Cookies.get('username');

    if (user_uuid && username) {
      setIsLoggedIn(true);
      setUsername(username);
      console.log("tttrue");
    } else {
      setIsLoggedIn(false);
      setUsername('');
      console.log("fffalse");
    }
    console.log("ggg", isLoggedIn, username);
  }, []); // ページがマウントされたときのみ実行される

  return (
    <Router>
      {/* Layoutコンポーネントで全体のレイアウトを定義 */}
      <Layout isLoggedIn={isLoggedIn} username={username}>
      <div>

        {/* 各ページへのルート設定 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/postuserinfo" element={<PostUserInfo />} />
          <Route path="/alluser" element={<UserList />} />
          <Route path="/searchuser" element={<SaearchUser />} />
          <Route path="/favorites" element={<FavoriteUserList />} />
          <Route path="/confirmation-register" element={<ConfirmRegister />} />
          <Route path="/deleteuser" element={<DeleteUser />} />
          <Route path="/deletealluser" element={<DeleteAllUser />} />
          <Route path="/registeruser" element={<RegisterUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} /> 
        </Routes>
      </div>
      </Layout>
    </Router>
  );
}

export default App;
