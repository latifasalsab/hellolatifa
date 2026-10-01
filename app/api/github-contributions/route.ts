// Needs GITHUB_TOKEN (scope: read:user) and GITHUB_USERNAME. Without them the UI falls back to a static ✱ pattern.
export const revalidate = 21600 // 6h

export async function GET() {
  const token = process.env.GITHUB_TOKEN, user = process.env.GITHUB_USERNAME
  if (!token || !user) return Response.json({ ok: false })
  try {
    const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{weeks{contributionDays{contributionCount}}}}}}`
    const r = await fetch('https://api.github.com/graphql', {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { login: user } }), next: { revalidate: 21600 },
    })
    if (!r.ok) throw new Error('github')
    const j = await r.json()
    const weeks = j.data.user.contributionsCollection.contributionCalendar.weeks.slice(-26)
    return Response.json({ ok: true, weeks: weeks.map((w: any) => w.contributionDays.map((d: any) => d.contributionCount)) })
  } catch {
    return Response.json({ ok: false })
  }
}
