import React from "react";

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface IssueListProps {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  onToggleStatus: (issueId: string, currentStatus: string) => void;
}

export const IssueList: React.FC<IssueListProps> = ({
  issues,
  loading,
  error,
  onToggleStatus,
}) => {
  if (loading) return <div>Loading issues...</div>;
  if (error)
    return <div className="text-red-600">Error loading issues: {error}</div>;
  if (issues.length === 0) return <p>No issues found for this project.</p>;

  return (
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
                onChange={() => onToggleStatus(issue.id, issue.status)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-sm select-none">Solved</span>
            </label>
          </div>
        </li>
      ))}
    </ul>
  );
};
