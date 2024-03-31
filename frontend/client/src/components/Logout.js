import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Logout = () => {
    const [message, setMessage] = useState('');

    const handleLogout = async (e) => {
        try {
            // クッキーを削除
            // Cookies.remove('username');
            // Cookies.remove('token');
            // Cookies.remove('user_uuid');
            // Cookies.remove('session');
            // すべてのクッキーを削除
            Object.keys(Cookies.get()).forEach(cookieName => {
                Cookies.remove(cookieName);
            });
            console.log("delete user cookie")
            //バックエンドのログアウト処理
            const response = await axios.post('http://localhost:5000/logout')
            setMessage(response.data.message);

            
            console.log("logout success");
            console.log(response);
            
        } catch (error) {
        setMessage('Error fetching user data');
        console.error('Error fetching user data: ', error);
        }
    };


  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <p>{message}</p>
    </div>
  );
};

export default Logout;
