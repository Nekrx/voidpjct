
import { Link } from 'react-router-dom';
import React, { useState } from "react";
import { AuthContext } from '../../contests/auth';
import { sendPasswordResetEmail } from "firebase/auth";
import './recover.css'

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(AuthContext, email);
      setMessage("Password reset email sent!");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className='container-center'>
        <div className='login'>
            <div className='login-area'>
            <h2>Password Reset</h2>
            </div>
    
      <form onSubmit={handlePasswordReset}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default PasswordReset;