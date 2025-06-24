import { useState } from "react";
import { createProject } from "../../api/project";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Project name is required");

    try {
      await createProject({ name });
      navigate("/projects"); // ✅ Redirect to project list
    } catch (err: any) {
      setError(err.message || "Failed to create project");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
