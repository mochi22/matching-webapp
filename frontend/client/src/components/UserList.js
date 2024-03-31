// src/components/UserList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FavoriteButton from './FavoriteButton';


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data: ', error);
      });
  }, []);


  // const handleAddFavorite = async () => {
  //     try {
  //       if (!selectedUser) {
  //         console.error('No user selected');
  //         return;
  //       }
  //       const response = await axios.post('http://localhost:5000/add_favorite', {
  //         user_uuid: current_user_uuid,
  //         favorite_user_uuid: selectedUser.user_uuid
  //       });
  //       console.log(response.data);
  //       // お気に入りが追加された後の処理をここに追加
  //     } catch (error) {
  //       console.error('Error adding favorite: ', error);
  //     }
  // };

  const handleAddFavorite = (user) => {
    // お気に入りを追加する処理を記述
    console.log('Add to favorites:', user);
  };


  return (
    <div>
    <h2>User List</h2>
    <ul>
      {users.map((user, index) => (
        <li key={index}>
          {Object.keys(user).map(key => (
            // <p key={key}>{key}: {user[key]}</p>
            <p key={key}>{key}: {Array.isArray(user[key]) ? user[key].join(', ') : user[key]}</p>
          ))}
          <FavoriteButton user={user} onClick={handleAddFavorite} />
        </li>
      ))}
    </ul>
  </div>

    // <div>
    //   <h2>User List</h2>
    //   <ul>
    //     {users.map((user, index) => (
    //       <li key={index}>
    //         {Object.keys(user).map(key => (
    //           // <p key={key}>{key}: {user[key]}</p>
    //           <p key={key}>{key}: {Array.isArray(user[key]) ? user[key].join(', ') : user[key]}</p>
    //         ))}
    //         <button onClick={() => setSelectedUser(user)}>Add to Favorites</button>
    //       </li>
    //     ))}
    //   </ul>
    //   <button onClick={handleAddFavorite}>Add Favorite</button>
    // </div>
  );
};

export default UserList;
