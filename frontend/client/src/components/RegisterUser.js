import React, { useState } from 'react';
import axios from 'axios';

const RegisterUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/registeruser', {
        username,
        password
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error registering user');
      console.error('Error registering user:', error);
    }
  };

//   return (
//     <div>
//       <h2>User Registration</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Username:
//           <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
//         </label>
//         <label>
//           Password:
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//         </label>
//         <label>
//           Confirm Password:
//           <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
//         </label>
//         <button type="submit">Register</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };
return (
  <div>
    <h2>User Registration</h2>
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password:</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
      </div>
      <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>Register</button>
    </form>
    {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
  </div>
);
};

export default RegisterUser;
