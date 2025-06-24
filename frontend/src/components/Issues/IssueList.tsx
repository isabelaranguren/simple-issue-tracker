import React, { useEffect, useState } from "react";
import {
  getIssues,
  createIssue,
  updateIssue,
  deleteIssue,
  type Issue,
} from "../../api/issue";

interface IssueListProps {
  projectId: string;
}

export const IssueList: React.FC<IssueListProps> = ({ projectId }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch issues when component mounts or projectId changes
  useEffect(() => {
    async function fetchIssues() {
      setLoading(true);
      try {
        const data = await getIssues(projectId);
        setIssues(data);
        setError(null);
      } catch (err) {
        setError("Failed to load issues.");
      }
      setLoading(false);
    }

    fetchIssues();
  }, [projectId]);

  // Create a new issue
  const handleCreateIssue = async () => {
    if (!newTitle) return;

    try {
      const created = await createIssue({
        title: newTitle,
        description: newDescription,
        projectId,
      });
      setIssues((prev) => [...prev, created]);
      setNewTitle("");
      setNewDescription("");
      setError(null);
    } catch {
      setError("Failed to create issue.");
    }
  };

  // Toggle issue status (open/solved)
  const toggleStatus = async (issue: Issue) => {
    const newStatus = issue.status === "open" ? "solved" : "open";
    try {
      const updated = await updateIssue(issue.id, { status: newStatus });
      setIssues((prev) => prev.map((i) => (i.id === issue.id ? updated : i)));
      setError(null);
    } catch {
      setError("Failed to update issue.");
    }
  };

  // Delete issue
  const handleDelete = async (id: string) => {
    try {
      await deleteIssue(id);
      setIssues((prev) => prev.filter((i) => i.id !== id));
      setError(null);
    } catch {
      setError("Failed to delete issue.");
    }
  };

  return (
    <div>
      <h2>Issues</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading issues...</p>
      ) : (
        <>
          {issues.length === 0 && <p>No issues yet.</p>}

          <ul>
            {issues.map((issue) => (
              <li key={issue.id}>
                <strong>{issue.title}</strong> - {issue.status}
                <button onClick={() => toggleStatus(issue)}>
                  Mark {issue.status === "open" ? "Solved" : "Open"}
                </button>
                <button onClick={() => handleDelete(issue.id)}>Delete</button>
                <p>{issue.description}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      <h3>Create New Issue</h3>
      <input
        type="text"
        placeholder="Title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Description"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
      />
      <br />
      <button onClick={handleCreateIssue}>Add Issue</button>
    </div>
  );
};
