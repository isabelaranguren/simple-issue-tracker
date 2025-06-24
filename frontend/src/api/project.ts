export interface Project {
  id: string;
  name: string;
  ownerId: string;
}

interface CreateProjectData {
  name: string;
}

const API_URL = "/api/projects";

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(API_URL, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  return res.json();
}

export async function createProject(data: CreateProjectData): Promise<Project> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create project");
  }

  return res.json();
}

export async function deleteProject(projectId: string): Promise<void> {
  const res = await fetch(`${API_URL}/${projectId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete project");
  }
}

export async function getProjectById(projectId: string) {
  const response = await fetch(`/api/projects/${projectId}`, {
    credentials: "include", // so cookies (like auth) are sent
  });

  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  return response.json();
}