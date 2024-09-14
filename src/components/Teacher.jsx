import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import LivePollResults from './LivePollResults';
import Tag from './Tag';
import './teacher.css';

const socket = io('http://localhost:3000');

function Teacher() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [responses, setResponses] = useState({});
  const [pollActive, setPollActive] = useState(false);

  useEffect(() => {
    socket.on('poll-results', (data) => {
      setResponses(data);
    });

    socket.on('poll-closed', () => {
      setPollActive(false);
    });

    socket.on('new-poll', (poll) => {
      console.log('New poll created:', poll); 
      setQuestion(poll.question);
      setOptions(poll.options);
      setResponses({}); 
      setPollActive(true); 
    });

    return () => {
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
          setPollActive(true); 
        }
      });
    }
  };

  const addOption = () => {
    setOptions([...options, '']); 
  };

  const deleteOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions); 
  };

  const resetPollCreation = () => {
    setQuestion(''); 
    setOptions(['', ''])
    setResponses({}); 
    setPollActive(false); //
  };

  const handleNewQuestion = () => {
    resetPollCreation(); 
    socket.emit('request-new-poll'); 
  };

  return (
    <div className='teacher'>
      <div className='main'>
        <Tag />
        <h2 className='h2'>Let's Get Started</h2>
        <p className='p'>
          You’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
        </p>

        {pollActive ? (
          <div>
            <LivePollResults
              question={question}
              options={options}
              responses={responses}
            />
            <button className='new-question' onClick={handleNewQuestion}>
              + Ask New Question
            </button>
          </div>
        ) : (
          <div className='ques'>
            <h3>Enter your question</h3>
            <textarea
              className='textAree'
              rows={2}
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
            <button className='addoption' onClick={addOption}>+ Add Option</button>
          </div>
        )}
      </div>
      <div className='askQ'>
        {!pollActive && (
          <button className='createC' onClick={createPoll}>
            + Ask Question
          </button>
        )}
      </div>
    </div>
  );
}

export default Teacher;
