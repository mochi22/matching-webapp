import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'; // js-cookieライブラリのインポート

const Login = () => {
    // ログインのコンポーネント
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [redirect, setRedirect] = useState(false);
//   const [redirect, SetRedirect] = useState(false);
  const navigation = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password
      });
      // ログイン成功時の処理
      setMessage('Login successful')
      console.log('Login successful:', response.data);
      // ログイン成功時にクッキーにセッション情報を保存
      const session = response.data["session"]
    //   Cookies.set('_fresh', session["_fresh"])
    //   Cookies.set('_user_id', session["_user_id"])
    //   Cookies.set('_id', session["_id"])
      Cookies.set('username', session["username"])
      Cookies.set('user_uuid', session["user_uuid"])
    //   Cookies.set('user_uuid', user_uuid);
      console.log(JSON.stringify(session))
    //   Cookies.set('session', JSON.stringify(session));
      setRedirect(true);
    } catch (error) {
      // ログイン失敗時の処理
      setMessage('Login failed. maybe Invalid username or password.')
      console.error('Login failed:', error, { expires: 1 });
    }
  };
  useEffect(() => {
    if (redirect) {
        navigation('/confirmation-register',{state: {message: message}});
    }
  }, [redirect]);

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
