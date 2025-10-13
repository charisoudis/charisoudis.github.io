
import { GitHubRepo } from '@/lib/github'

export function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <a href={repo.html_url} target="_blank" rel="noreferrer" className="card block">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm">{repo.name}</h3>
        <div className="text-xs text-zinc-500">★ {repo.stargazers_count} · ⑂ {repo.forks_count}</div>
      </div>
      {repo.description && <p className="text-sm mt-2">{repo.description}</p>}
      <div className="text-xs text-zinc-500 mt-2">{repo.language || '—'}</div>
    </a>
  )
}
