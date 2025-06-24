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
        setError(null);
      })
      .catch((err) => setError(err.message || "Failed to load projects"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li
              key={project.id}
              className="p-4 bg-white rounded shadow hover:bg-gray-50"
            >
              <Link
                to={`/projects/${project.id}`}
                className="text-blue-600 hover:underline"
              >
                {project.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/projects/new"
        className="inline-block mt-8 px-5 py-3 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + New Project
      </Link>
    </div>
  );
}
