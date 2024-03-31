import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const ConfirmRegister = () => {

  // メッセージを取得
  const location = useLocation();
  const message = location.state?.message || ''; // stateがない場合は空文字列をデフォルトとする

  // const [message, setMessage] = useState("");
  // const location = useLocation();
  // useEffect(()=>{
  //   setMessage(location.state.message);
  // }, [location]);

  console.log("mes", message);


  return (
    <div>
      <h1>Confirmation</h1>
      <p>{message}</p>
      <p>message done!</p>
    </div>
  );
};

export default ConfirmRegister;