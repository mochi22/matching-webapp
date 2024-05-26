import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const Home = () => {
  // useLocationフックを使用して現在のロケーション情報を取得
  const location = useLocation();
  // location.stateからisLoggedInとusernameを取得
  const { isLoggedIn } = location.state || {};

  const [userinfo, setUserInfo] = useState([]);
  const userUUID = Cookies.get('user_uuid');

  // useEffect(() => {
  //   // ユーザー情報を取得する関数を定義
  //   const fetchUserInfo = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:5000/self_user', {
  //         headers: {
  //           'Authorization': `Bearer ${userUUID}`  // ヘッダーにuser_uuidを含める
  //         }
  //       });
  //       console.log("header", response.header);
  //       console.log(response.data);
  //       setUserInfo(response.data);

  //     } catch (error) {
  //       console.error('Error fetching user info: ', error);
  //     }
  //   };
  //   console.log(userinfo);
  //   // ページが読み込まれたときにユーザー情報を取得
  //   fetchUserInfo();
  // }, []);

  return (
    <div>
      <p>this is Home</p>
    </div>
  )
  // return (
  //   <div>
  //     {isLoggedIn ? (
  //       <div>
  //         <p>Logged in below info</p>
  //         {typeof userinfo === 'object' && (
  //           <ul>
  //             {Object.entries(userinfo).map(([key, value]) => (
  //               <li key={key}>
  //                 <p>{key}: {Array.isArray(value) ? value.join(', ') : value}</p>
  //               </li>
  //             ))}
  //           </ul>
  //         )}
  //       </div>
  //     ) : (
  //       <p>User not logged in</p>
  //     )}
  //   </div>
  // );
};

export default Home;