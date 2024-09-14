import React, { useState } from 'react';
import Teacher from './components/Teacher';
import Student from './components/Student';
import './App.css';
import Tag from './components/Tag';
import { useNavigate } from "react-router-dom";

function App() {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    console.log(role)
    if (role) {
      if(role==='teacher'){
        return navigate("/teacher");
      }  
       return navigate("/student");
        
    }
  };


  return (
    <div className='appcss'>
        <>
          <Tag />
          <p className='welcome'>Welcome to the <span className='bold'>Live Polling System</span></p>
          <p style={{ color: "rgba(0, 0, 0, 0.5)" }}>
            Please select the role that best describes you to begin using the live polling system
          </p>
          <div className='roles'>
            <div
              className={`roleCard ${role === 'teacher' ? 'selected' : ''}`} // Add 'selected' class if teacher is selected
              onClick={() => setRole('teacher')}
            >
              <b className='header'>Login as Teacher</b>
              <p>Lorem ipsum dolor sit ae ipsa fugit quae sapiente?</p>
            </div>
            <div
              className={`roleCard ${role === 'student' ? 'selected' : ''}`} // Add 'selected' class if student is selected
              onClick={() => setRole('student')}
            >
              <b className='header'>Login as Student</b>
              <p>Submit answers and view live poll results in real-time.</p>
            </div>
          </div>
          <button onClick={handleContinue} className='continue'>
            Continue
          </button>
        </>

    </div>
  );
}

export default App;
