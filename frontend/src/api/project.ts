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
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch project");
  }

  const project = await response.json();
  return project;
};