import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Home from './components/Home.jsx'
import Dashboard from './components/Dashboard.jsx'
import Explore from './components/Explore.jsx'
import Messages from './components/Messages.jsx'
import Profile from './components/Profile.jsx'
import Sessions from './components/Sessions.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import NotFound from './components/NotFound.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
    </>
  )
}

export default App
