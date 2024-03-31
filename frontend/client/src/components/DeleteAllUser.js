import React, { useState } from 'react';
import axios from 'axios';

const DeleteAllUser = () => {
  const [message, setMessage] = useState('');

  const handleDeleteAllUsers = () => {
    axios.delete('http://localhost:5000/users')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error deleting all users: ', error);
        setMessage('Error deleting all users. Please try again later.');
      });
  };

  return (
    <div>
      <h2>Delete All Users</h2>
      <button onClick={handleDeleteAllUsers}>Delete All Users</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteAllUser;
