// src/components/Teacher.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import LivePollResults from './LivePollResults';
import Tag from './Tag';
import './techer.css';

const socket = io('http://localhost:3000'); // Adjust backend URL if needed

function Teacher() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); // Start with 2 default options
  const [responses, setResponses] = useState({});
  const [pollActive, setPollActive] = useState(false);

  useEffect(() => {
    // Listen for poll results and new polls
    socket.on('poll-results', (data) => {
      setResponses(data);
    });

    socket.on('poll-closed', () => {
      setPollActive(false);
    });

    // Listen for a new poll being created
    socket.on('new-poll', (poll) => {
      setQuestion(poll.question);
      setOptions(poll.options);
      setResponses({}); // Reset responses for the new poll
      setPollActive(true); // Set poll active
    });

    return () => {
      // Clean up socket listeners on unmount
      socket.off('poll-results');
      socket.off('poll-closed');
      socket.off('new-poll');
    };
  }, []);

  const createPoll = () => {
    if (question && options.every((opt) => opt)) {
      fetch('http://localhost:3000/create-poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, options }),
      }).then((res) => {
        if (res.ok) {
          setPollActive(true); // Keep poll active state
        }
      });
    }
  };

  const addOption = () => {
    setOptions([...options, '']); // Add a new empty option
  };

  const deleteOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions); // Update the state to remove the selected option
  };

  return (
    <div className='techers'> 
      <div className='main'>
        <Tag />
        <h2 className='h2'>Let's Get Started</h2>
        <p className='p'>you’ll have the ability to create and 
            manage polls, ask questions,
            and monitor your students'
            responses in real-time.
        </p>
        {pollActive ? (
            <LivePollResults
            question={question}
            options={options}
            responses={responses}
          />
        ) : (
          <div className='ques'> 
            <h3>Enter your question</h3>
            <textarea
              className='textAree'
              rows={2} // Set the textarea to have 2 rows
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <h2>Edit Options</h2>
            {options.map((opt, index) => (
              <div key={index} className="option-container">
                <span className="option-number">{index + 1}.</span>
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  className="inoutt"
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                />
                <button className='delete-option' onClick={() => deleteOption(index)}>Delete</button>
              </div>
            ))}
            <button className='addoption' onClick={addOption}>+Add Option</button> {/* Button to add more options */}
          </div>
        )}
      </div>
      <div className='askQ'>
          <button className='createC' onClick={createPoll}>+ Ask Question</button>  
      </div>
     </div>
  );
}

export default Teacher;
