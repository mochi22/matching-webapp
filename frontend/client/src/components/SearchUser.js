import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchUser = () => {
  const [gender, setGender] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   if (gender !== '') {
  //     // 特定の性別のユーザー情報を取得するリクエストを送信
  //     axios.get(`http://localhost:5000/users?gender=${gender}&hobbies=${hobbies}`)
  //       .then(response => {
  //         setUsers(response.data);
  //         console.log(users);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching user data: ', error);
  //       });
  //   }
  // }, [gender, hobbies]);

  const fetchFilteredUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/filter=${gender}&${hobbies}`);
      setUsers(response.data);
      console.log(users);
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  const handleSearch = () => {
    fetchFilteredUsers();
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleHobbiesChange = (e) => {
    setHobbies(e.target.value);
  };

  return (
    <div>
      <h2>Users by Gender</h2>
      <label>
        Select Gender:
        <select value={gender} onChange={handleGenderChange}>
          <option value="">Select gender...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="nogender">nogender</option>
        </select>
      </label>
      <label>
        Select Hobbies:
        <select value={hobbies} onChange={handleHobbiesChange}>
          <option value="">Select hobbies...</option>
          <option value="sports">Sports</option>
          <option value="game">Game</option>
          <option value="picture">Picture</option>
          <option value="vacation">Vacation</option>
          <option value="swim">Swim</option>
          <option value="mount">Mount</option>
        </select>
      </label>
      <button onClick={handleSearch}>Searching</button>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {Object.keys(user).map(key => (
              <p key={key}>{key}: {user[key]}</p>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchUser;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const SearchUser = () => {
//   const [users, setUsers] = useState([]);
//   const [gender, setGender] = useState('');
//   const [hobbies, setHobbies] = useState('');

//   useEffect(() => {
//     axios.get('http://localhost:5000/users')
//       .then(response => {
//         setUsers(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching users:', error);
//       });
//   }, [gender, hobbies]);

//   const handleFilter = () => {
//     axios.get(`http://localhost:5000/searchusers?gender=${gender}&hobbies=${hobbies}`)
//       .then(response => {
//         console.log("setting filter", gender, hobbies);
//         setUsers(response.data);
//         console.log(users);
//       })
//       .catch(error => {
//         console.error('Error filtering users:', error);
//       });
//   };


//   const handleGenderChange = (e) => {
//     setGender(e.target.value);
//   };
  
  
//   return (
//     <div>
//       <h1>Users By Criteria</h1>
//       <div>
//         <label>Gender:</label>
//         <select value={gender} onChange={handleGenderChange}>
//           <option value="">Select gender...</option>
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//         </select>
//       </div>
//       <div>
//         <label>Hobbies:</label>
//         <input type="text" value={hobbies} onChange={(e) => setHobbies(e.target.value)} />
//       </div>
//       <button onClick={handleFilter}>Filter Users</button>
//       <ul>
//         {users.map(user => (
//           <li key={user.id}>
//             <p>Gender: {user.gender}</p>
//             <p>Age: {user.age}</p>
//             <p>Hobbies: {Array.isArray(user.hobbies) ? user.hobbies.join(', ') : user.hobbies}</p>

//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SearchUser;
