import { useEffect, useState } from "react";
import { getIssues } from "./services/api";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIssues() {
      try {
        const data = await getIssues();
        setIssues(data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    }

    loadIssues();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>CommunityFix AI</h1>

      <Register />

      <hr />

      <Login />

      <hr />

      <h2>Community Issues</h2>

      {loading ? (
        <p>Loading...</p>
      ) : issues.length === 0 ? (
        <p>No issues found.</p>
      ) : (
        <ul>
          {issues.map((issue) => (
            <li key={issue.id}>
              <strong>{issue.title}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
