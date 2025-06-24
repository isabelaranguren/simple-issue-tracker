import { useState, useEffect } from "react";

interface Owner {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
  ownerId: string;
  owner: Owner;
}

interface UseProjectResult {
  project: Project | null;
  loading: boolean;
  error: string | null;
}

export function useProject(projectId: string | undefined): UseProjectResult {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/projects/${projectId}`, {
      credentials: "include",
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
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setProject(null);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  return { project, loading, error };
}
