
import { fetchGitHub } from '@/lib/github'
import { site } from '@/site.config'
import { RepoCard } from '@/components/RepoCard'

export const metadata = { title: 'Repos' }

export default async function ReposPage() {
  const { user, repos, totalStars, languages } = await fetchGitHub(site.github)

  const langList = Object.entries(languages).sort((a,b) => b[1]-a[1]).slice(0, 8)

  return (
    <div>
      <h1 className="text-3xl font-serif mb-6">GitHub Repositories</h1>

      <section className="card">
        <div className="text-sm">User: <a className="underline" href={`https://github.com/${user.login}`} target="_blank" rel="noreferrer">@{user.login}</a></div>
        <div className="mt-2 text-sm">Followers: {user.followers} · Repos: {user.public_repos} · Stars: {totalStars}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {langList.map(([lang, n]) => (
            <span key={lang} className="text-xs rounded-full border px-2 py-0.5">{lang} · {n}</span>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {repos.sort((a,b) => b.stargazers_count - a.stargazers_count).slice(0, 20).map(r => (
          <RepoCard key={r.id} repo={r} />
        ))}
      </div>
    </div>
  )
}
