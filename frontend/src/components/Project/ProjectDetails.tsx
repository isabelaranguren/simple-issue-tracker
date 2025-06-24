import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Owner {
  id: string;
  name: string;
  email: string;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface Project {
  id: string;
  name: string;
  ownerId: string;
  owner: Owner;
}



export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [errorProject, setErrorProject] = useState<string | null>(null);
  const [errorIssues, setErrorIssues] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    // Fetch project info
    setLoadingProject(true);
    fetch(`/api/projects/${projectId}`, {
      credentials: "include", // to send cookies
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch project");
        }
        return res.json();
      })
      .then((data: Project) => {
        setProject(data);
        setErrorProject(null);
      })
      .catch((err) => {
        setErrorProject(err.message);
        setProject(null);
      })
      .finally(() => setLoadingProject(false));

    // Fetch issues for the project
    setLoadingIssues(true);
    fetch(`/api/issues?projectId=${projectId}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch issues");
        }
        return res.json();
      })
      .then((data: Issue[]) => {
        setIssues(data);
        setErrorIssues(null);
      })
      .catch((err) => {
        setErrorIssues(err.message);
        setIssues([]);
      })
      .finally(() => setLoadingIssues(false));
  }, [projectId]);

  if (loadingProject) return <div className="p-4">Loading project...</div>;
  if (errorProject)
    return (
      <div className="p-4 text-red-600">
        Error loading project: {errorProject}
      </div>
    );
  if (!project) return <div className="p-4">No project found.</div>;

  const toggleIssueStatus = async (
    issueId: string,
    newStatus: "open" | "solved"
  ) => {
    try {
      const res = await fetch(`/api/issues/${issueId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update issue status");
      }

      const updatedIssue = await res.json();

      // Update issues state with new status
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === updatedIssue.id ? updatedIssue : issue
        )
      );
    } catch (err) {
      alert(
        `Error updating issue status: ${
          err instanceof Error ? err.message : err
        }`
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-2">{project.name}</h1>
      <p className="mb-6">Owner ID: {project.ownerId}</p>

      <h2 className="text-2xl font-semibold mb-4">Issues</h2>
      {loadingIssues ? (
        <div>Loading issues...</div>
      ) : errorIssues ? (
        <div className="text-red-600">Error loading issues: {errorIssues}</div>
      ) : issues.length > 0 ? (
        <ul className="space-y-4">
          {issues.map((issue) => (
            <li
              key={issue.id}
              className="p-4 border border-gray-300 dark:border-gray-700 flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-medium">{issue.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {issue.description}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Status:{" "}
                  <span
                    className={
                      issue.status === "solved"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {issue.status}
                  </span>
                </p>
              </div>
              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={issue.status === "solved"}
                    onChange={() =>
                      toggleIssueStatus(
                        issue.id,
                        issue.status === "solved" ? "open" : "solved"
                      )
                    }
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-sm select-none">Solved</span>
                </label>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No issues found for this project.</p>
      )}
    </div>
  );
}
