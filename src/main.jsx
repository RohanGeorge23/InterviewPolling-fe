import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Import Tailwind CSS
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Teacher from './components/Teacher';
import Student from './components/Student';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/student" element={<Student />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);