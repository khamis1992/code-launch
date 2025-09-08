import React from 'react';
import type { GitHubRepoInfo } from '~/types/GitHub';

interface RepositoryCardProps {
  repo: GitHubRepoInfo;
  onClone?: (repoUrl: string) => void;
}

export function RepositoryCard({ repo, onClone }: RepositoryCardProps) {
  return (
    <a
      key={repo.name}
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 rounded-lg bg-codelaunch-elements-background-depth-1 border border-codelaunch-elements-borderColor hover:border-codelaunch-elements-borderColorActive transition-all duration-200"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`i-ph:${repo.private ? 'lock' : 'git-repository'} w-4 h-4 text-codelaunch-elements-icon-info`}
            />
            <h5 className="text-sm font-medium text-codelaunch-elements-textPrimary group-hover:text-codelaunch-elements-item-contentAccent transition-colors">
              {repo.name}
            </h5>
            {repo.private && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-codelaunch-elements-background-depth-3 text-codelaunch-elements-textSecondary border border-codelaunch-elements-borderColor">
                Private
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-codelaunch-elements-textSecondary">
            <span className="flex items-center gap-1" title="Stars">
              <div className="i-ph:star w-3.5 h-3.5 text-codelaunch-elements-icon-warning" />
              {repo.stargazers_count.toLocaleString()}
            </span>
            <span className="flex items-center gap-1" title="Forks">
              <div className="i-ph:git-fork w-3.5 h-3.5 text-codelaunch-elements-icon-info" />
              {repo.forks_count.toLocaleString()}
            </span>
          </div>
        </div>

        {repo.description && (
          <p className="text-xs text-codelaunch-elements-textSecondary line-clamp-2">{repo.description}</p>
        )}

        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 text-xs rounded-full bg-codelaunch-elements-background-depth-3 text-codelaunch-elements-textSecondary border border-codelaunch-elements-borderColor"
              >
                {topic}
              </span>
            ))}
            {repo.topics.length > 3 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-codelaunch-elements-background-depth-3 text-codelaunch-elements-textSecondary border border-codelaunch-elements-borderColor">
                +{repo.topics.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-codelaunch-elements-textSecondary">
          {repo.language && (
            <span className="flex items-center gap-1" title="Primary Language">
              <div className="i-ph:circle-fill w-2 h-2 text-codelaunch-elements-icon-success" />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1" title="Default Branch">
            <div className="i-ph:git-branch w-3.5 h-3.5" />
            {repo.default_branch}
          </span>
          <span className="flex items-center gap-1" title="Last Updated">
            <div className="i-ph:clock w-3.5 h-3.5" />
            {new Date(repo.updated_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            {onClone && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  const cloneUrl = `https://github.com/${repo.full_name}.git`;
                  onClone(cloneUrl);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-codelaunch-elements-background-depth-2 hover:bg-codelaunch-elements-background-depth-3 text-codelaunch-elements-textSecondary hover:text-codelaunch-elements-textPrimary transition-colors"
                title="Clone repository"
              >
                <div className="i-ph:git-branch w-3.5 h-3.5" />
                Clone
              </button>
            )}
            <span className="flex items-center gap-1 group-hover:text-codelaunch-elements-item-contentAccent transition-colors">
              <div className="i-ph:arrow-square-out w-3.5 h-3.5" />
              View
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
