import { useEffect, useState } from "react";
import { getProjects } from "../../api/project"; // Your API call function
import { Link } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  ownerId: string;
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjects(data);
        setError(null); // Clear any previous errors
      })
      .catch((err) => setError(err.message || "Failed to load projects"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-500">
        <svg
          className="animate-spin h-6 w-6 text-gray-400 mr-3"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading projects...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg relative"
        role="alert"
      >
        <strong className="font-semibold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-4xl mx-auto space-y-8 bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-50 rounded-lg shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl md:text-4xl font-bold">Projects</h1>
        <Link
          to="/projects/new"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gray-800 text-gray-50 hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="p-6 text-center text-gray-600 border border-dashed rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
          <p className="text-lg font-medium mb-2">No projects found.</p>
          <p className="text-sm">
            Start by creating a new project to see it listed here.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className="relative group bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <Link
                to={`/projects/${project.id}`}
                className="block p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 rounded-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-1 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Owner ID: {project.ownerId}
                </p>
              </Link>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
