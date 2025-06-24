import { useParams } from "react-router-dom";
import { useProject } from "../../hooks/useProject";
import { useIssues } from "../../hooks/useIssues";
import { IssueList } from "../Issues/IssueList";
import CreateIssue from "../Issues/CreateIssue"; 

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const {
    project,
    loading: loadingProject,
    error: errorProject,
  } = useProject(projectId);

  const {
    issues,
    loading: loadingIssues,
    error: errorIssues,
    toggleIssueStatus,
    refetch,
  } = useIssues(projectId);

  if (loadingProject) return <div className="p-4">Loading project...</div>;
  if (errorProject)
    return (
      <div className="p-4 text-red-600">
        Error loading project: {errorProject}
      </div>
    );
  if (!project) return <div className="p-4">No project found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-2">{project.name}</h1>
      <IssueList
        issues={issues}
        loading={loadingIssues}
        error={errorIssues}
        onToggleStatus={toggleIssueStatus}
      />
      <div className="max-w-4xl mx-auto p-6">
        <CreateIssue projectId={project.id} onCreated={refetch} />
      </div>
    </div>
  );
}
