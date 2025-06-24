import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjectById, type Project } from "../api/project";
import { getIssues, type Issue } from "../api/issue";

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    Promise.all([getProjectById(projectId), getIssues(projectId)])
      .then(([proj, issueList]) => {
        setProject(proj);
        setIssues(issueList);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div>Loading project...</div>;
  if (!project) return <div>Project not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>

      <div className="mb-6">
        <Link
          to={`/projects/${projectId}/issues/new`}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + New Issue
        </Link>
      </div>

      <h2 className="text-xl font-semibold mb-2">Issues</h2>
      {issues.length === 0 ? (
        <p>No issues found.</p>
      ) : (
        <ul className="space-y-3">
          {issues.map((issue) => (
            <li key={issue.id} className="border p-4 rounded shadow-sm">
              <h3 className="font-bold">{issue.title}</h3>
              <p className="text-sm text-gray-500">{issue.status}</p>
              <p>{issue.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
