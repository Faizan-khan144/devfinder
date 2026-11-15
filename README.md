# DevFinder

Read any GitHub developer in one glance: languages, momentum, top repositories, and a side-by-side comparison. No login, no token, no database.

DevFinder is a single-page React app that talks straight to the public GitHub REST API. Type a username, and you get a profile dashboard instead of a wall of JSON: language share, activity sparkline, best repositories, recent events, and a compare view for two developers.

![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-b6f36b)

## Features

| Feature | Status | Notes |
| --- | --- | --- |
| Profile search | Live | Any public GitHub username, deep links at `/u/:username` |
| Language breakdown | Live | Aggregated by repo count and bytes, colour-coded |
| Activity sparkline | Live | Last 14 days of public events |
| Top repositories | Live | Sorted by stars, with language and metadata |
| Side-by-side compare | Live | Two developers, shared metrics, relative bars |
| Bookmarks and recents | Live | Stored locally, survives reloads |
| Scroll-driven landing | Live | Scrubbed animations, revealed sections, marquee |
| Commit streak calendar | Soon | Needs a larger event sample |
| Org and team view | Soon | Aggregate multiple accounts |
| Server-side cache | Soon | Would lift the anonymous rate limit |

## Routes

- `/` landing page
- `/explore` search and featured developers
- `/u/:username` developer profile
- `/compare` head-to-head comparison
- `/bookmarks` saved developers and recent searches

## Data and rate limits

DevFinder uses `https://api.github.com` without authentication, so every visitor gets 60 requests per hour from their own IP. Successful responses are cached in memory for five minutes and mirrored to local storage, so previously opened profiles keep working even after the anonymous limit runs out. When a request does hit the limit, the UI shows the exact reset time and a live countdown instead of a dead end. No personal data is collected or transmitted anywhere else.

## Stack

- React 19 with TypeScript
- Vite 7
- Tailwind CSS 4
- React Router 7
- Zustand 5 for local bookmarks
- Hand-written CSS and IntersectionObserver motion, no animation library
- lucide-react icons

## Local development

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build      # typecheck and production build
npm run typecheck  # types only
npm run lint       # oxlint
npm run preview    # serve the production build
```

## Project structure

```
src/
  components/
    app/      app shell, search, data display
    motion/   reveal, parallax, scrub, counters, cursor
    site/     header, footer, logo
  lib/        GitHub client and derived stats
  pages/      landing, explore, profile, compare, bookmarks
  store/      persisted bookmarks and recents
```

## Deployment

The build output in `dist` is fully static. A `vercel.json` rewrite keeps client-side routes working.

```bash
npm run build
npx vercel --prod
```

## Roadmap

- Optional GitHub token support to raise the API limit for heavy use
- Streak calendar once event pagination is in place
- Shared compare links
- Light theme with the same motion language

## Author

Built by [Faizan Khan](https://github.com/Faizan-khan144).

## License

MIT, see [LICENSE](./LICENSE).
