import { useState, useEffect, useCallback } from "react";

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface UseIssuesResult {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  toggleIssueStatus: (issueId: string, currentStatus: string) => Promise<void>;
}

export function useIssues(projectId: string | undefined): UseIssuesResult {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/issues?projectId=${id}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch issues");
      }
      const data: Issue[] = await res.json();
      setIssues(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchIssues(projectId);
    }
  }, [projectId, fetchIssues]);

  const toggleIssueStatus = useCallback(
    async (issueId: string, currentStatus: string) => {
      const newStatus = currentStatus === "solved" ? "open" : "solved";
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

        const updatedIssue: Issue = await res.json();

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
    },
    []
  );

  return { issues, loading, error, toggleIssueStatus };
}
