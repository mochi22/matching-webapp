import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';


const FavoriteUserList = () => {
    const [favorites, setFavorites] = useState([]);
    const userUUID = Cookies.get('user_uuid');

    useEffect(() => {
        // お気に入りのユーザーデータを取得する関数を定義
        const fetchFavorites = async () => {
            try {
                const response = await axios.get('http://localhost:5000/favorites', {
                    headers: {
                      'Authorization': `Bearer ${userUUID}`  // ヘッダーにuser_uuidを含める
                    }
                  });
                setFavorites(response.data);
            } catch (error) {
                console.error('Error fetching favorites: ', error);
            }
        };

        // ページが読み込まれたときにお気に入りのユーザーデータを取得
        fetchFavorites();
    }, []);

    return (
        <div>
            <h2>Favorite Users</h2>
            <ul>
                {favorites.map((user, index) => (
                    <li key={index}>
                    {Object.keys(user).map(key => (
                        // <p key={key}>{key}: {user[key]}</p>
                        <p key={key}>{key}: {Array.isArray(user[key]) ? user[key].join(', ') : user[key]}</p>
                    ))}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FavoriteUserList;
