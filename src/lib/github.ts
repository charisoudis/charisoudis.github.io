
export type GitHubUser = {
  login: string
  avatar_url: string
  html_url: string
  followers: number
  following: number
  public_repos: number
}

export type GitHubRepo = {
  id: number
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics?: string[]
}

export async function fetchGitHub(username: string) {
  const headers: Record<string, string> = { 'Accept': 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`

  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    headers,
    next: { revalidate: 3600 }
  })
  if (!userRes.ok) throw new Error('Failed to fetch GitHub user')
  const user: GitHubUser = await userRes.json()

  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
    headers,
    next: { revalidate: 3600 }
  })
  if (!reposRes.ok) throw new Error('Failed to fetch GitHub repos')
  const repos: GitHubRepo[] = await reposRes.json()

  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
  const languages = repos.reduce<Record<string, number>>((acc, r) => {
    if (r.language) acc[r.language] = (acc[r.language] || 0) + 1
    return acc
  }, {})

  return { user, repos, totalStars, languages }
}
