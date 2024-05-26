import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const PostUserInfo = () => {
  const [userinfo, setUserInfo] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [interests, setInterests] = useState('');
  const [message, setMessage] = useState('');
  const [redirect, SetRedirect] = useState(false);
  const navigation = useNavigate();

  const userUUID = Cookies.get('user_uuid');

  
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      gender: gender,
      age: age,
      hobbies: hobbies,
      interests: interests
    };
    axios.post('http://localhost:5000/self_user', userData, {
      headers: {
        'Authorization': `Bearer ${userUUID}`  // ヘッダーにuser_uuidを含める
      }
    })
      .then(response => {
        setMessage('User registration successful.');
        console.log("post success:",response);
        SetRedirect(true);
      })
      .catch(error => {
        setMessage('User registration failed. Please try again later.');
        console.error('Error saving user data: ', error);
      });
  };

  useEffect(() => {
    if (redirect) {
      navigation('/confirmation-register',{state: {message: message}});
    }
  }, [redirect]);

  return (
    <div>
    <h1>User Registration Form</h1>
    <form onSubmit={handleSubmit}>
      <label>
        Gender:
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Select a gender...</option>
        <option value="male">male</option>
        <option value="female">female</option>
        <option value="nogender">no gender</option>
        </select>
      </label>
      <label>
        Age:
        <input type="number" min="18" max="150" value={age} onChange={(e) => setAge(e.target.value)} />
      </label>
      <label>
        Hobbies:
        <select value={hobbies} onChange={(e) => setHobbies(e.target.value)}>
          <option value="">Select a hobby...</option>
          <option value="sports">Sports</option>
          <option value="game">Game</option>
          <option value="picture">Picture</option>
          <option value="vacation">Vacation</option>
          <option value="swim">Swim</option>
          <option value="mount">Mount</option>
        </select>
      </label>
      <label>
        Interests:
        <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} />
      </label>
      <button type="submit">Submit</button>
    </form>
    {message && <p>{message}</p>}
    </div>
  );
};

export default PostUserInfo;
