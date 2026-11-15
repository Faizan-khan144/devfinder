import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import Bookmarks from './pages/Bookmarks'
import Compare from './pages/Compare'
import NotFound from './pages/NotFound'
import AppShell from './components/app/AppShell'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AppShell />}>
          <Route path="/explore" element={<Explore />} />
          <Route path="/u/:username" element={<Profile />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/compare" element={<Compare />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
