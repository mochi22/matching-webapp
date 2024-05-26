import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';


const MyPage = () => {
  // useLocationフックを使用して現在のロケーション情報を取得
  const location = useLocation();
  // location.stateからisLoggedInとusernameを取得
  const { isLoggedIn } = location.state || {};

  const [userinfo, setUserInfo] = useState([]);
  const userUUID = Cookies.get('user_uuid');
  const [message, setMessage] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };


  useEffect(() => {
    // ユーザー情報を取得する関数を定義
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/self_user', {
          headers: {
            'Authorization': `Bearer ${userUUID}`  // ヘッダーにuser_uuidを含める
          }
        });
        console.log("header", response.header);
        console.log(response.data);
        setUserInfo(response.data);

      } catch (error) {
        console.error('Error fetching user info: ', error);
      }
    };
    console.log(userinfo);
    // ページが読み込まれたときにユーザー情報を取得
    fetchUserInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5000/self_user', userinfo);
      setMessage('User information updated successfully');
    } catch (error) {
      setMessage('Error updating user information');
      console.error('Error updating user information:', error);
    }
  };

  const handleChange = (e) => {
    setUserInfo({ ...userinfo, [e.target.name]: e.target.value });
  };
  return (
<div>
    {isEditing ? (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          {/* <label>Gender:</label>
          <input type="text" name="gender" value={userinfo.gender} onChange={handleChange} /> */}
            <label>Gender:</label>
            <select name="gender" value={userinfo.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            </select>
        </div>
        <div>
          <label>Age:</label>
          <input type="number" name="age" value={userinfo.age} onChange={handleChange} />
        </div>
        <div>
          <label>Hobbies:</label>
          <input type="text" name="hobbies" value={userinfo.hobbies} onChange={handleChange} />
        </div>
        <div>
          <label>Interests:</label>
          <input type="text" name="interests" value={userinfo.interests} onChange={handleChange} />
        </div>
        <button type="submit">Save</button>
      </form>
      {message && <p>{message}</p>}
      </div>
    ) : (
    <div>
          {isLoggedIn ? (
            <div>
              <p>Logged in below info</p>
              {typeof userinfo === 'object' && (
                <ul>
                  {Object.entries(userinfo).map(([key, value]) => (
                    <li key={key}>
                      <p>{key}: {Array.isArray(value) ? value.join(', ') : value}</p>
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={handleEdit}>Edit Profile</button>
            </div>
          ) : (
            <p>User not logged in</p>
          )}
        </div>
    )}
    </div>
  );
};

//   return (
//     <div>
//       {isLoggedIn ? (
//         <div>
//           <p>Logged in below info</p>
//           {typeof userinfo === 'object' && (
//             <ul>
//               {Object.entries(userinfo).map(([key, value]) => (
//                 <li key={key}>
//                   <p>{key}: {Array.isArray(value) ? value.join(', ') : value}</p>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       ) : (
//         <p>User not logged in</p>
//       )}
//     </div>
//   );
// };

export default MyPage;
