import { useState } from "react";

interface CreateIssueProps {
  projectId: string;
  onCreated?: () => void; 
}

export default function CreateIssue({ projectId, onCreated }: CreateIssueProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, projectId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create issue");
      }

      setTitle("");
      setDescription("");
      if (onCreated) onCreated(); 
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Create New Issue</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <input
        type="text"
        placeholder="Issue title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 px-4 py-2 border border-gray-300"
        required
      />
      <textarea
        placeholder="Issue description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-2 px-4 py-2 border border-gray-300"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 hover:bg-gray-800"
      >
        {loading ? "Creating..." : "Create Issue"}
      </button>
    </form>
  );
}
