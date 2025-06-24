import { useState } from "react";
import { createIssue } from "../../api/issue";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateIssue() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!projectId) {
    return <div>Project ID is missing.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createIssue({ title, description, projectId });
      navigate(`/projects/${projectId}`); // back to project details or issue list
    } catch (err: any) {
      setError(err.message || "Failed to create issue");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Create New Issue</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Issue title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          rows={4}
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Create Issue
        </button>
      </form>
    </div>
  );
}
