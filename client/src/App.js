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
    if (tokens && tokens.access_token) {
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });
      const data = await response.json();
      if (data.messages) {
        const emailPromises = data.messages.map(async (message) => {
          const msgResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
            {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
              },
            }
          );
          const msgData = await msgResponse.json();
          return msgData.snippet;
        });
        const emailSnippets = await Promise.all(emailPromises);
        setEmails(emailSnippets);
      } else {
        setEmails([]);
      }
    }
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
