import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';


const Matching = () => {
  const [isMatching, setIsMatching] = useState(null);
  // useLocationフックを使用して現在のロケーション情報を取得
  const location = useLocation();
  // location.stateからisLoggedInとusernameを取得
  const { isLoggedIn } = location.state || {};
  const userUUID = Cookies.get('user_uuid');
  
  // const checkFavorite = () => {
  //   const data = {
  //     user_uuid: userUUID,          // ログイン中のユーザーのID
  //     target_user_uuid: 'user2'    // お気に入りを確認したい相手のID
  //   };
  //   axios.post('http://localhost:5000/matching', data)
  //     .then(response => {
  //       setIsFavorite(response.data.is_favorite);
  //     })
  //     .catch(error => {
  //       console.error('Error checking favorite:', error);
  //     });
  // };
  useEffect(() => {
    // お気に入りのユーザーデータを取得する関数を定義
    const fetchMatching = async () => {
      console.log("kurara");
        try {
            const response = await axios.get('http://localhost:5000/matching', {
                headers: {
                  'Authorization': `Bearer ${userUUID}`  // ヘッダーにuser_uuidを含める
                }
              });
              setIsMatching(response.data);
        } catch (error) {
            console.error('Error fetching Matching: ', error);
        }
    };

    // ページが読み込まれたときにお気に入りのユーザーデータを取得
    fetchMatching();
}, []);

  return (
    <div>
      {/* <button onClick={checkFavorite}>Check Favorite</button> */}
      {isMatching === null ? null : (
        <div>{isMatching ? 
          <ul>
              {isMatching.map((user, index) => (
                  <li key={index}>
                  {Object.keys(user).map(key => (
                      // <p key={key}>{key}: {user[key]}</p>
                      <p key={key}>{key}: {Array.isArray(user[key]) ? user[key].join(', ') : user[key]}</p>
                  ))}
                  </li>
              ))}
          </ul>
        : 'You have not favorited this user.'}
        </div>
      )}
    </div>
  );
};

export default Matching;
