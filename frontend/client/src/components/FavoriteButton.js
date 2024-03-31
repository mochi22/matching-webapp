// FavoriteButton.js

import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const FavoriteButton = ({ user }) => {
  const current_user_uuid = Cookies.get('user_uuid');


  const handleAddFavorite = () => {
    axios.post('http://localhost:5000/add_favorite', {
          user_uuid: current_user_uuid,
          favorite_user_uuid: user.user_uuid
      })
      .then(response => {
        console.log('Favorite added:', response.data);
        // お気に入りが追加された場合の処理をここに追加
        console.log("current user uuid",current_user_uuid);
        console.log("favorite_user_uuid",user.user_uuid);
      })
      .catch(error => {
        console.error('Error adding favorite:', error);
        // エラーが発生した場合の処理をここに追加
      });
  };

  return (
    <button onClick={handleAddFavorite}>Add to Favorites</button>
  );
};

export default FavoriteButton;
