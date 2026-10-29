import { useCallback, useEffect, useState } from "react";
import { getIssues, voteForIssue } from "./services/api";
import Register from "./components/Register";
import Login from "./components/Login";
import ReportIssue from "./components/ReportIssue";

function App() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [loadError, setLoadError] = useState("");
  const [voting, setVoting] = useState({});
  const [votedIssues, setVotedIssues] = useState([]);
  const [voteMessages, setVoteMessages] = useState({});

  const loadIssues = useCallback(async () => {
    try {
      setLoadError("");
      const data = await getIssues();
      setIssues(data);
    } catch (error) {
      console.error("Error fetching issues:", error);
      setLoadError("Unable to load community issues. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  // Sort issues according to the selected option.
  const sortedIssues = [...issues].sort((a, b) => {
    if (sortBy === "most_votes") {
      return (b.vote_count ?? 0) - (a.vote_count ?? 0);
    }

    if (sortBy === "fewest_votes") {
      return (a.vote_count ?? 0) - (b.vote_count ?? 0);
    }

    // Default: newest issues first.
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const handleVote = async (issueId) => {
    setVoting((previous) => ({
      ...previous,
      [issueId]: true,
    }));

    setVoteMessages((previous) => ({
      ...previous,
      [issueId]: "",
    }));

    try {
      await voteForIssue(issueId);

      setVotedIssues((previous) =>
        previous.includes(issueId)
          ? previous
          : [...previous, issueId]
      );

      setVoteMessages((previous) => ({
        ...previous,
        [issueId]: "Your vote was recorded successfully!",
      }));

      await loadIssues();
    } catch (error) {
      setVoteMessages((previous) => ({
        ...previous,
        [issueId]: error.message || "Unable to submit your vote.",
      }));
    } finally {
      setVoting((previous) => ({
        ...previous,
        [issueId]: false,
      }));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CommunityFix AI</h1>

      <p>
        Report community problems and help improve your neighbourhood.
      </p>

      <Register />

      <hr />

      <Login />

      <hr />

      <ReportIssue onCreated={loadIssues} />

      <hr />

      <h2>Community Issues</h2>

      {/* Issue sorting dropdown */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="sort-issues">
          <strong>Sort issues: </strong>
        </label>

        <select
          id="sort-issues"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          style={{
            padding: "8px",
            marginLeft: "8px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          <option value="newest">Newest first</option>
          <option value="most_votes">Most votes</option>
          <option value="fewest_votes">Fewest votes</option>
        </select>
      </div>

      {loading ? (
        <p>Loading issues...</p>
      ) : loadError ? (
        <div>
          <p role="alert">{loadError}</p>
          <button onClick={loadIssues}>Retry</button>
        </div>
      ) : issues.length === 0 ? (
        <p>No issues found.</p>
      ) : (
        <ul>
          {sortedIssues.map((issue) => (
            <li key={issue.id} className="issue-card">
              <h3>{issue.title}</h3>

              <p>
                <strong>Votes:</strong> {issue.vote_count ?? 0}
              </p>

              <p>{issue.description}</p>

              <p>
                <strong>Category:</strong> {issue.category}
              </p>

              <p>
                <strong>Location:</strong> {issue.location}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {issue.status.replace("_", " ")}
              </p>

              <p>
                <strong>Reported by:</strong> {issue.reported_by}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(issue.created_at).toLocaleDateString()}
              </p>

              <button
                onClick={() => handleVote(issue.id)}
                disabled={
                  voting[issue.id] ||
                  votedIssues.includes(issue.id)
                }
              >
                {voting[issue.id]
                  ? "Submitting vote..."
                  : votedIssues.includes(issue.id)
                    ? "Voted"
                    : "Vote for this issue"}
              </button>

              {voteMessages[issue.id] && (
                <p role="status" aria-live="polite">
                  {voteMessages[issue.id]}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;