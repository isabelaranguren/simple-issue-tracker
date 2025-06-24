export interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  projectId: string;
  authorId: string;
  createdAt: string;
}

interface CreateIssueData {
  title: string;
  description: string;
  projectId: string;
}

interface UpdateIssueData {
  title?: string;
  description?: string;
  status?: string;
}

const API_URL = "/api/issues";

export async function getIssues(projectId: string): Promise<Issue[]> {
  const res = await fetch(`/api/issues/${projectId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch issues");
  }

  return res.json();
}

export async function createIssue(data: CreateIssueData): Promise<Issue> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create issue");
  }

  return res.json();
}

export async function updateIssue(
  id: string,
  data: UpdateIssueData
): Promise<Issue> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update issue");
  }

  return res.json();
}

export async function deleteIssue(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete issue");
  }
}
