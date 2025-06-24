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
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 bg-gray-50">
        <div className="flex items-center text-gray-600">
          <svg
            className="animate-spin h-5 w-5 text-gray-400 mr-3"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-sm font-medium">Loading issues...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 shadow-sm">
        <div className="flex items-center">
          <svg
            className="h-5 w-5 text-red-400 mr-3 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Error loading issues
            </h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-6 py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No issues found
          </h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            This project doesn't have any issues yet. Issues will appear here
            once they are created.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {issues.map((issue) => (
        <div
          key={issue.id}
          className="bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-150">
                    {issue.title}
                  </h3>
                  <div className="flex items-center">
                    <div
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium border ${
                        issue.status === "solved"
                          ? "bg-green-50 text-green-800 border-green-200"
                          : "bg-yellow-50 text-yellow-800 border-yellow-200"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 mr-1.5 ${
                          issue.status === "solved"
                            ? "bg-green-400"
                            : "bg-yellow-400"
                        }`}
                      ></div>
                      {issue.status === "solved" ? "Solved" : "Open"}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {issue.description}
                </p>
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer group/checkbox">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={issue.status === "solved"}
                      onChange={() => onToggleStatus(issue.id, issue.status)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border-2 transition-all duration-200 ${
                        issue.status === "solved"
                          ? "bg-green-600 border-green-600"
                          : "bg-white border-gray-300 group-hover/checkbox:border-gray-400"
                      }`}
                    >
                      {issue.status === "solved" && (
                        <svg
                          className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700 select-none group-hover/checkbox:text-gray-900 transition-colors duration-150">
                    Mark as {issue.status === "solved" ? "Open" : "Solved"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
