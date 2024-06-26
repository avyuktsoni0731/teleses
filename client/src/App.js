import React, { useEffect, useState } from "react";

function App() {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokens = urlParams.get("tokens");
    if (tokens) {
      localStorage.setItem("tokens", tokens);
      window.location.search = "";
    }
  }, []);

  const fetchEmails = async () => {
    const tokens = localStorage.getItem("tokens");
    if (tokens) {
      try {
        const response = await fetch("http://localhost:5000/emails", {
          headers: {
            Authorization: `Bearer ${tokens}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch emails");
        }
        const emails = await response.json();
        setEmails(emails);
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError("No tokens found");
    }
  };

  const parseEmailBody = (payload) => {
    let body = "";
    if (payload.parts) {
      payload.parts.forEach((part) => {
        if (part.mimeType === "text/html") {
          body += atob(part.body.data.replace(/-/g, "+").replace(/_/g, "/"));
        } else if (part.parts) {
          body += parseEmailBody(part);
        }
      });
    } else {
      body += atob(payload.body.data.replace(/-/g, "+").replace(/_/g, "/"));
    }
    return body;
  };

  return (
    <div>
      <h1>Gmail Emails</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        onClick={() => (window.location.href = "http://localhost:5000/auth")}
      >
        Authenticate with Google
      </button>
      <button onClick={fetchEmails}>Fetch Emails</button>
      <ul>
        {emails.map((email, index) => (
          <li
            key={index}
            dangerouslySetInnerHTML={{ __html: parseEmailBody(email.payload) }}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
