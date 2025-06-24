import { useState } from "react";
import { createProject } from "../../api/project";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      await createProject({ name });
      navigate("/projects"); // ✅ Redirect to project list
    } catch (err: any) {
      setError(err.message || "Failed to create project. Please try again.");
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-lg mx-auto mt-10 bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-50 rounded-lg shadow-sm">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-gray-50">
        Create New Project
      </h1>

      {error && (
        <div
          className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg relative mb-4"
          role="alert"
        >
          <strong className="font-semibold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="projectName" className="sr-only">
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 text-base bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full
            bg-gray-800 text-gray-50 hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
