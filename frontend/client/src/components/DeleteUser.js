import React, { useState, useEffect } from 'react';
import axios from 'axios';


const DeleteUser = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // ユーザー一覧を取得する関数を定義
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    // ユーザー一覧を取得する関数を呼び出す
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      console.log("try delete, %s", userId);
      // ユーザーを削除するリクエストを送信
      await axios.delete(`http://localhost:5000/users/${userId}`);
      // 削除したユーザーを除いた新しいユーザー一覧を更新

      setUsers(users.filter(user => user.uuid !== userId));
    } catch (error) {
      console.error('Error deleting user: ', error);
    }
  };

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user.uuid}>  {/* ユーザーのIDをキーとして設定 */}
            <p>Gender: {user.gender}</p>
            <p>Age: {user.age}</p>
            <p>Hobbies: {user.hobbies}</p>
            <p>Interests: {user.interests}</p>
            <p>uuid: {user.uuid}</p>
            <button onClick={() => deleteUser(user.uuid)}>Delete</button>
          </li>
        ))}
      </ul>
      {/* <ul>
        {users.map((user, index) => (
          <li key={index}>
            {Object.keys(user).map(key => (
              <p key={key}>{key}: {user[key]}</p>
            ))}
            <button onClick={() => deleteUser(user._id)}>Delete</button>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default DeleteUser;
