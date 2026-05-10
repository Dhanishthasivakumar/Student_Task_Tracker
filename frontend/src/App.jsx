import { useState, useEffect } from 'react'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import TaskManager from './components/TaskManager'
import OverviewDashboard from './components/OverviewDashboard'
import Login from './components/Login'
import './App.css'

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      // Default tab for admin is dashboard
      if (u.role === 'ADMIN') {
        setActiveTab('dashboard');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={(u) => {
      setUser(u);
      if (u.role === 'ADMIN') setActiveTab('dashboard');
    }} />;
  }

  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="app-container">
      {/* Decorative Stickers */}
      <div className="sticker sticker-star-1">✨</div>
      <div className="sticker sticker-sparkle-1">⭐</div>
      <div className="sticker sticker-arrow-1">↪️</div>
      <div className="sticker sticker-doodle-1">🎨</div>

      <header className="app-header">
        <div className="header-top">
          <div className="header-branding">
            <span className="logo-emoji">🎓</span>
            <h1>Tracker Portal</h1>
          </div>
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{isAdmin ? 'Administrator' : 'Student'}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">Sign Out</button>
          </div>
        </div>
        
        <div className="nav-tabs">
          {isAdmin && (
            <button 
              className={activeTab === 'dashboard' ? 'active-tab' : ''} 
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
          )}
          <button 
            className={activeTab === 'tasks' ? 'active-tab' : ''} 
            onClick={() => setActiveTab('tasks')}
          >
            {isAdmin ? 'Tasks Management' : 'My Tasks'}
          </button>
          {isAdmin && (
            <button 
              className={activeTab === 'analytics' ? 'active-tab' : ''} 
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          {activeTab === 'dashboard' && isAdmin ? (
            <OverviewDashboard onNavigate={() => setActiveTab('tasks')} />
          ) : activeTab === 'tasks' ? (
            <TaskManager user={user} />
          ) : activeTab === 'analytics' && isAdmin ? (
            <AnalyticsDashboard studentId={user.id} />
          ) : (
            <TaskManager user={user} /> // Default to tasks for students
          )}
        </div>
      </main>
    </div>
  )
}

export default App;
