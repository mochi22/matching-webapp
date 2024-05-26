// Layout.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import './Layout.css'; // CSSファイルのインポート

const Layout = ({ children, isLoggedIn, username }) => {
//   const [username, setUsername] = useState('');

//   useEffect(() => {
//     const sessionUsername = Cookies.get('username');
//     if (sessionUsername) {
//       setUsername(sessionUsername);
//     }
//   }, []);
  console.log("layout islogeedin",isLoggedIn);

  return (
    <div>
      <header>
        <nav>
        <ul>
          <li><Link to="/mypage" state={{ isLoggedIn, username }}>Mypage</Link></li>
          <li><Link to="/postuserinfo">post user info</Link></li>
          <li><Link to="/alluser">alluser</Link></li>
          <li><Link to="/searchuser">search user</Link></li>
          <li><Link to="/favorites">favorite users</Link></li>
          <li><Link to="/match">matched users</Link></li>
          <li><Link to="/deleteuser">delete user</Link></li>
          <li><Link to="/deletealluser">all delete user</Link></li>
          {isLoggedIn ? null : <li><Link to="/registeruser">register user</Link></li>}
          {isLoggedIn ? <li><Link to="/logout">logout user</Link></li> : <li><Link to="/login">login user</Link></li>} 
          <div className="username">{isLoggedIn ? <span>Welcome, {username}</span> : <span> anonymous</span>}</div>
        </ul>
        
        </nav>
      </header>
      <main>
        {children}
      </main>
      <footer>
        <p>this is footer</p>
        {/* フッターの内容を追加 */}
      </footer>
    </div>
  );
};

export default Layout;
