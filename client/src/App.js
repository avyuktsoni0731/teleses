import React, { useEffect, useState } from 'react';

function App() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokens = urlParams.get('tokens');
    if (tokens) {
      localStorage.setItem('tokens', tokens);
      window.location.search = '';
    }
  }, []);

  const fetchEmails = async () => {
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    const response = await fetch('http://localhost:5000/emails', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });
    const data = await response.json();
    setEmails(data);
  };

  return (
    <div>
      <h1>LinkedIn Emails</h1>
      <button onClick={() => (window.location.href = 'http://localhost:5000/auth')}>
        Authenticate with Google
      </button>
      <button onClick={fetchEmails}>Fetch Emails</button>
      <ul>
        {emails.map((email, index) => (
          <li key={index}>{email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
