import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const LivePollResults = ({ question, options, responses }) => {
  const data = options.map(option => ({
    name: option,
    value: Object.values(responses).filter(response => response === option).length
  }));

  const totalResponses = Object.keys(responses).length;

  return (
    <div className="live-poll-results">
      <h2>Question</h2>
      <div className="question-box">
        <p>{question}</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={150} />
          <Bar dataKey="value" fill="#8884d8" label={({ value }) => `${((value / totalResponses) * 100).toFixed(0)}%`} />
        </BarChart>
      </ResponsiveContainer>
      <button className="new-question-btn">+ Ask a new question</button>
    </div>
  );
};

export default LivePollResults;