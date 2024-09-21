import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Tag from './Tag';
import './student.css';
import LivePollResults from './LivePollResults';

const socket = io('https://live-interview-portal-be.onrender.com'); 

function Student() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [responses, setResponses] = useState({});

  useEffect(() => {
   
    socket.on('new-poll', (pollData) => {
      console.log('Received new poll:', pollData); // Debug log
      setPoll(pollData);
      setSubmitted(false);
      setSelectedOption('');
      setResponses({});
    });

    socket.on('poll-results', (data) => {
      setResponses(data);
    });

    socket.emit('request-poll'); 

    return () => {
      socket.off('new-poll');
      socket.off('poll-results');
    };
  }, []);

  const submitAnswer = () => {
    if (selectedOption && studentId) {
      socket.emit('submit-answer', { studentId, selectedOption });
      setSubmitted(true);
    }
  };

  return (
    <div className='stu-main'>
      <div className='stu'>
        <Tag />
        <h2 className='h2'>Let's Get Started</h2>
        <p className='p'>
          If you’re a student, you’ll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates.
        </p>

        {!studentId ? (
          <div className='studName'>
            <p className='h3'>Enter your Name</p>
            <input
              type='text'
              className='inputt'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              className='butt'
              onClick={() => {
                if (name) setStudentId(name + '_' + new Date().getTime());
              }}
            >
              Continue
            </button>
          </div>
        ) : (
          <div>
            {poll ? (
              !submitted ? (
                <div>
                  <h3>{poll.question}</h3>
                  {poll.options.map((opt, index) => (
                    <div key={index}>
                      <input
                        type='radio'
                        id={`option-${index}`}
                        name='poll'
                        value={opt}
                        onChange={(e) => setSelectedOption(e.target.value)}
                      />
                      <label htmlFor={`option-${index}`}>{opt}</label>
                    </div>
                  ))}
                  <button onClick={submitAnswer}>Submit Answer</button>
                </div>
              ) : (
                <div className='stu-stplit'>
                  <h3>Poll Results:</h3>
                  <LivePollResults
                    question={poll.question}
                    options={poll.options}
                    responses={responses}
                  />
                  <p>Waiting for Teacher to ask another question...</p>
                </div>
              )
            ) : (
              <p>No active poll. Waiting for the teacher to ask a question...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Student;
