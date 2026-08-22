import { useEffect, useState } from 'react'

const startingMissions = [
  { id: 1, title: 'Make the bed', category: 'Home', xp: 15, icon: '⌂', done: false },
  { id: 2, title: 'Drink a full glass of water', category: 'Body', xp: 20, icon: '◒', done: false },
  { id: 3, title: '10-minute walk outside', category: 'Body', xp: 35, icon: '↗', done: false },
  { id: 4, title: 'Reply to one important message', category: 'Mind', xp: 25, icon: '✦', done: false },
  { id: 5, title: 'Put away five things', category: 'Home', xp: 20, icon: '⌂', done: false },
]

const questPool = [
  { id: 6, title: 'Clear one small surface', category: 'Home', xp: 20, icon: '⌂' },
  { id: 7, title: 'Write tomorrow’s top priority', category: 'Mind', xp: 20, icon: '✎' },
  { id: 8, title: 'Stretch for five minutes', category: 'Body', xp: 15, icon: '↗' },
  { id: 9, title: 'Read ten pages', category: 'Mind', xp: 25, icon: '▤' },
  { id: 10, title: 'Practice a new skill', category: 'Growth', xp: 30, icon: '✦' },
  { id: 11, title: 'Prep a healthy snack', category: 'Body', xp: 20, icon: '◒' },
  { id: 12, title: 'Write 150 words', category: 'Craft', xp: 25, icon: '✎' },
  { id: 13, title: 'Practice one chord change', category: 'Craft', xp: 20, icon: '♫' },
]

const initialActivity = [
  { text: 'Made the bed', type: 'home', duration: 5, time: '8:12 AM', xp: '+15 XP', icon: '⌂' },
  { text: 'Started a 7 day streak', type: 'streak', duration: 0, time: 'Yesterday', xp: 'STREAK', icon: '♨' },
  { text: 'Finished morning stretch', type: 'gym', duration: 10, time: 'Yesterday', xp: '+20 XP', icon: '↗' },
]

const activityTypes = [
  { id: 'gym', name: 'Gym / Running', icon: '↗', stat: 'Vitality', multiplier: 1 },
  { id: 'coding', name: 'Coding (C++)', icon: '⌘', stat: 'Dexterity', multiplier: 1.1 },
  { id: 'studying', name: 'Studying (BCIS / EBUS)', icon: '✦', stat: 'Wisdom', multiplier: 1.05 },
  { id: 'reading', name: 'Reading', icon: '▤', stat: 'Insight', multiplier: 0.95 },
  { id: 'writing', name: 'Writing', icon: '✎', stat: 'Insight', multiplier: 1.05 },
  { id: 'guitar', name: 'Beginner Guitar', icon: '♫', stat: 'Dexterity', multiplier: 1 },
]

const breakdownColors = ['#d79b3d', '#6f8d68', '#d27b54', '#7d9faf', '#9581a5', '#8a9b72']

const sideQuests = [
  { id: 'photo', title: 'Take a sky photo', reward: 10, icon: '◌' },
  { id: 'kindness', title: 'Send someone encouragement', reward: 15, icon: '♡' },
  { id: 'creative', title: 'Make something for 20 minutes', reward: 25, icon: '✎' },
  { id: 'guitar', title: 'Practice 3 guitar chords', reward: 20, icon: '♫' },
]

const defaultProfile = { name: '', magicType: 'Air', focus: 'Writing · coding · learning', fitness: 'Getting started', school: 'Steady progress', writing: 'Curious beginner', guitar: 'Brand new', notifications: false }

const defaultStreak = { current: 7, best: 12, freezes: 3, lastActiveDate: new Date().toDateString() }
const weeklyChallenges = [
  { id: 'balanced', title: 'Balanced Mage', detail: 'Log 4 different activity types', target: 4, reward: 50, icon: '✦', kind: 'variety' },
  { id: 'grind', title: 'Grinding Session', detail: 'Log 300 minutes of activity', target: 300, reward: 25, icon: 'ϟ', kind: 'minutes' },
  { id: 'consistency', title: 'Consistency Rune', detail: 'Complete 6 quests this week', target: 6, reward: 25, icon: '◒', kind: 'quests' },
]
const starterGoals = [
  { id: 'coding', title: 'Code for 120 minutes', detail: 'Career path · due Sunday', current: 0, target: 120, unit: 'min', color: 'gold' },
  { id: 'study', title: 'Complete 5 study sessions', detail: 'Wisdom path · due Sunday', current: 0, target: 5, unit: 'sessions', color: 'green' },
  { id: 'writing', title: 'Write 500 words', detail: 'Writer path · due Sunday', current: 0, target: 500, unit: 'words', color: 'purple' },
  { id: 'guitar', title: 'Practice guitar 3 times', detail: 'Beginner path · due Sunday', current: 0, target: 3, unit: 'sessions', color: 'orange' },
  { id: 'level', title: 'Reach level 5', detail: 'Milestone · keep earning XP', current: 4, target: 5, unit: 'level', color: 'orange' },
]

function readSaved(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback }
}

function getActiveMissions() {
  const saved = readSaved('mage-missions', startingMissions)
  const active = saved.filter((mission) => !mission.done)
  return active.length ? active : startingMissions.map((mission) => ({ ...mission, done: false }))
}

function missionsForProfile(profile) {
  const missions = [...startingMissions]
  if (profile.writing === 'Building a practice' || profile.writing === 'Serious about my craft') missions[3] = { id: 4, title: 'Write 150 words', category: 'Writing', xp: 25, icon: '✎' }
  if (profile.guitar === 'Brand new' || profile.guitar === 'Learning a few chords') missions[4] = { id: 5, title: 'Practice one chord change', category: 'Guitar', xp: 20, icon: '♫' }
  if (profile.fitness === 'Training consistently' || profile.fitness === 'Performance focused') missions[2] = { id: 3, title: 'Complete a focused workout', category: 'Fitness', xp: 35, icon: '↗' }
  if (profile.school === 'Finding my footing') missions[1] = { id: 2, title: 'Review one class note', category: 'School', xp: 20, icon: '✦' }
  return missions
}

function App() {
  const [profile, setProfile] = useState(() => readSaved('mage-profile', defaultProfile))
  const [missions, setMissions] = useState(getActiveMissions)
  const [activity, setActivity] = useState(() => readSaved('mage-activity', initialActivity))
  const [loggedXp, setLoggedXp] = useState(() => readSaved('mage-xp', 0))
  const [spentXp, setSpentXp] = useState(() => readSaved('mage-spent-xp', 0))
  const [completedSideQuests, setCompletedSideQuests] = useState(() => readSaved('mage-side-quests', []))
  const [streak, setStreak] = useState(() => readSaved('mage-streak', defaultStreak))
  const [goals, setGoals] = useState(() => readSaved('mage-goals', starterGoals))
  const [isLogging, setIsLogging] = useState(false)
  const [isSettingUp, setIsSettingUp] = useState(!profile.name)
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false)
  const [activeView, setActiveView] = useState('today')
  const [nextQuestIndex, setNextQuestIndex] = useState(() => readSaved('mage-next-quest', 0))
  const [completingMissionId, setCompletingMissionId] = useState(null)
  const [rewardMessage, setRewardMessage] = useState('')
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [activityForm, setActivityForm] = useState({ type: 'coding', duration: 30, intensity: 3 })
  const completed = missions.filter((mission) => mission.done).length
  const earnedXp = missions.filter((mission) => mission.done).reduce((total, mission) => total + mission.xp, 0) + loggedXp + completedSideQuests.reduce((total, id) => total + (sideQuests.find((quest) => quest.id === id)?.reward || 0), 0) - spentXp
  const totalMinutes = activity.reduce((total, item) => total + (item.duration || 0), 0)
  const activeTypes = new Set(activity.map((item) => item.type).filter(Boolean)).size
  const activityBreakdown = activityTypes.map((type, index) => ({ ...type, minutes: activity.filter((item) => item.type === type.id).reduce((total, item) => total + (item.duration || 0), 0), sessions: activity.filter((item) => item.type === type.id).length, color: breakdownColors[index] })).filter((item) => item.sessions > 0)
  const otherMinutes = activity.filter((item) => !activityTypes.some((type) => type.id === item.type)).reduce((total, item) => total + (item.duration || 0), 0)
  const chartTotal = Math.max(1, activityBreakdown.reduce((total, item) => total + item.minutes, 0) + otherMinutes)
  const chartStops = activityBreakdown.reduce((stops, item) => { const start = stops.length ? stops[stops.length - 1].end : 0; const end = start + (item.minutes / chartTotal) * 360; return [...stops, { color: item.color, start, end }] }, []).map((item) => `${item.color} ${item.start}deg ${item.end}deg`).join(', ')
  const weeklyQuestProgress = { variety: activeTypes, minutes: totalMinutes, quests: completed + completedSideQuests.length }
  const achievements = [
    { icon: '🔥', title: '7 day streak', unlocked: streak.current >= 7 },
    { icon: '★', title: 'First 100 XP', unlocked: earnedXp >= 100 },
    { icon: '✦', title: 'Balanced mage', unlocked: activeTypes >= 4 },
    { icon: '♜', title: 'Level 5 reached', unlocked: earnedXp >= 100 },
  ]

  useEffect(() => { localStorage.setItem('mage-profile', JSON.stringify(profile)) }, [profile])
  useEffect(() => { localStorage.setItem('mage-missions', JSON.stringify(missions)) }, [missions])
  useEffect(() => { localStorage.setItem('mage-activity', JSON.stringify(activity)) }, [activity])
  useEffect(() => { localStorage.setItem('mage-xp', JSON.stringify(loggedXp)) }, [loggedXp])
  useEffect(() => { localStorage.setItem('mage-spent-xp', JSON.stringify(spentXp)) }, [spentXp])
  useEffect(() => { localStorage.setItem('mage-side-quests', JSON.stringify(completedSideQuests)) }, [completedSideQuests])
  useEffect(() => { localStorage.setItem('mage-streak', JSON.stringify(streak)) }, [streak])
  useEffect(() => { localStorage.setItem('mage-goals', JSON.stringify(goals)) }, [goals])
  useEffect(() => { localStorage.setItem('mage-next-quest', JSON.stringify(nextQuestIndex)) }, [nextQuestIndex])
  useEffect(() => {
    if (!isTimerRunning) return undefined
    const interval = window.setInterval(() => setTimerSeconds((current) => current + 1), 1000)
    return () => window.clearInterval(interval)
  }, [isTimerRunning])

  function registerActiveDay() {
    const today = new Date().toDateString()
    if (streak.lastActiveDate === today) return
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    setStreak((current) => ({ ...current, current: current.lastActiveDate === yesterday ? current.current + 1 : 1, best: Math.max(current.best, current.lastActiveDate === yesterday ? current.current + 1 : 1), lastActiveDate: today }))
  }

  function toggleMission(id) {
    const mission = missions.find((item) => item.id === id)
    if (!mission || mission.done || completingMissionId) return
    const replacement = { ...questPool[nextQuestIndex % questPool.length], id: `${questPool[nextQuestIndex % questPool.length].id}-${Date.now()}` }
    setCompletingMissionId(id)
    setRewardMessage(`+${mission.xp} XP · Quest cleared`)
    setActivity((current) => [{ text: mission.title, time: 'Just now', xp: `+${mission.xp} XP`, icon: mission.icon }, ...current])
    registerActiveDay()
    window.setTimeout(() => {
      setMissions((current) => current.map((item) => item.id === id ? replacement : item))
      setNextQuestIndex((current) => current + 1)
      setCompletingMissionId(null)
      setRewardMessage('')
    }, 480)
  }

  function logActivity(event) {
    event.preventDefault()
    const selected = activityTypes.find((item) => item.id === activityForm.type)
    const duration = timerSeconds >= 60 ? Math.max(1, Math.round(timerSeconds / 60)) : Number(activityForm.duration)
    const xp = Math.round((duration / 10) * Number(activityForm.intensity) * (selected?.multiplier || 1) * 1.2)
    setLoggedXp((current) => current + xp)
    setActivity((current) => [{ text: selected.name, type: selected.id, duration, time: 'Just now', xp: `+${xp} XP`, icon: selected.icon }, ...current])
    setGoals((current) => current.map((goal) => goal.id === 'coding' && selected.id === 'coding' ? { ...goal, current: Math.min(goal.target, goal.current + duration) } : goal.id === 'study' && selected.id === 'studying' ? { ...goal, current: Math.min(goal.target, goal.current + 1) } : goal.id === 'writing' && selected.id === 'writing' ? { ...goal, current: Math.min(goal.target, goal.current + duration * 3) } : goal.id === 'guitar' && selected.id === 'guitar' ? { ...goal, current: Math.min(goal.target, goal.current + 1) } : goal))
    registerActiveDay()
    setTimerSeconds(0)
    setIsTimerRunning(false)
    setIsLogging(false)
  }

  function finishSetup(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const nextProfile = { name: form.get('name'), magicType: form.get('magicType'), focus: form.get('focus'), fitness: form.get('fitness'), school: form.get('school'), writing: form.get('writing'), guitar: form.get('guitar'), notifications: profile.notifications }
    setProfile(nextProfile)
    setMissions(missionsForProfile(nextProfile))
    setIsSettingUp(false)
  }

  async function enableNotifications() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setProfile((current) => ({ ...current, notifications: permission === 'granted' }))
      if (permission === 'granted') new Notification('Mage Quest is ready', { body: 'Your daily quests are waiting.' })
    }
  }

  function toggleSideQuest(quest) {
    const alreadyDone = completedSideQuests.includes(quest.id)
    setCompletedSideQuests((current) => alreadyDone ? current.filter((id) => id !== quest.id) : [...current, quest.id])
    if (!alreadyDone) { setActivity((current) => [{ text: quest.title, time: 'Just now', xp: `+${quest.reward} XP`, icon: quest.icon }, ...current]); registerActiveDay() }
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setProfile((current) => ({ ...current, avatar: reader.result }))
    reader.readAsDataURL(file)
  }

  function useFreeze() {
    if (streak.freezes > 0 && earnedXp >= 50) { setStreak((current) => ({ ...current, freezes: current.freezes - 1 })); setSpentXp((current) => current + 50) }
  }

  return (
    <main className={`app-shell ${profile.magicType.toLowerCase()}`}>
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">✦</span><span>mage quest<br /><em>level up life</em></span></div>
        <nav>
          <button className={activeView === 'today' ? 'active' : ''} onClick={() => setActiveView('today')}><span>▦</span>Today</button>
          <button className={activeView === 'quests' ? 'active' : ''} onClick={() => setActiveView('quests')}><span>✦</span>Quests</button>
          <button className={activeView === 'analysis' ? 'active' : ''} onClick={() => setActiveView('analysis')}><span>◔</span>Analysis</button>
          <button className={activeView === 'character' ? 'active' : ''} onClick={() => setActiveView('character')}><span>◉</span>Character</button>
        </nav>
        <div className="sidebar-bottom"><button className="avatar">{profile.avatar ? <img src={profile.avatar} alt="Character portrait" /> : profile.name ? profile.name.slice(0, 2).toUpperCase() : 'MQ'}</button><div><strong>{profile.name || 'New adventurer'}</strong><small>{profile.magicType} mage</small></div><button className="more" aria-label="Notifications" onClick={() => setIsNotificationPanelOpen(true)}>♢</button></div>
      </aside>

      <section className="content" id="today" data-view={activeView}>
        <header className="topbar"><div><p className="eyebrow">YOUR {profile.magicType.toUpperCase()} ARC · MONDAY, JUNE 24</p><h1>Good morning, {profile.name || 'adventurer'} <span>✦</span></h1></div><button className="icon-button" aria-label="Notifications" onClick={() => setIsNotificationPanelOpen(true)}>♢{profile.notifications && <i />}</button></header>
        <section className="hero-grid view-today">
          <article className="level-card">
            <div className="level-card-head"><div><p className="label">CURRENT LEVEL</p><div className="level-number">04 <span>DAY SHAPER</span></div></div><div className="level-badge">04</div></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${Math.min(100, (earnedXp / 100) * 100)}%` }} /></div>
            <div className="progress-copy"><span>{earnedXp} / 100 XP to level 5</span><span>{Math.max(0, 100 - earnedXp)} XP left</span></div>
            <div className="level-footer"><span>✹ &nbsp;{streak.current} day streak</span><span>Best: {streak.best} days</span></div>
          </article>
          <article className="quote-card"><div className="quote-mark">“</div><p>Small steps. Every day.<br /><strong>That’s the whole game.</strong></p><span>— Your future self</span></article>
        </section>
        <section className="home-insights view-today"><div><p className="eyebrow">YOUR ACTIVITY MIX</p><h2>Where your energy goes</h2><p className="insight-copy">Based on {activity.length} logged actions.</p></div><div className="donut-chart" style={{ background: `conic-gradient(${chartStops || '#dfe3d9 0deg 360deg'})` }}><div><strong>{totalMinutes}</strong><small>MINUTES</small></div></div><div className="legend">{activityBreakdown.slice(0, 3).map((item) => <span key={item.id}><i style={{ background: item.color }} />{item.name}<b>{item.minutes}m</b></span>)}{otherMinutes > 0 && <span><i style={{ background: '#b9beb4' }} />Other<b>{otherMinutes}m</b></span>}</div></section>

        <section className="section-heading view-quests"><div><p className="eyebrow">YOUR DAILY RUN</p><h2>Today’s quests <span>{completed}/{missions.length}</span></h2></div><button className="primary-button" onClick={() => setIsLogging(true)}>+ Log activity</button></section>
        <div className="missions view-quests" id="quests">{missions.map((mission) => <button className={`mission ${mission.done ? 'done' : ''} ${completingMissionId === mission.id ? 'completing' : ''}`} key={mission.id} onClick={() => toggleMission(mission.id)}><span className="mission-icon">{mission.icon}</span><span className="mission-info"><strong>{mission.title}</strong><small>{mission.category}</small></span><span className="mission-xp">+{mission.xp} XP</span><span className="check" /></button>)}</div>
        {rewardMessage && <div className="reward-toast"><span>✦</span>{rewardMessage}</div>}

        <section className="streak-panel view-today"><div><p className="eyebrow">KEEP THE FLAME LIT</p><h2>{streak.current} days in a row <span>🔥</span></h2><p className="streak-copy">Log anything today to protect your streak. It resets at midnight.</p></div><div className="streak-actions"><strong>{streak.freezes} freezes</strong><small>50 XP each</small><button className="text-button" onClick={useFreeze} disabled={streak.freezes === 0 || earnedXp < 50}>Use a freeze</button></div></section>
        <section className="weekly-quests view-quests"><div className="section-heading"><div><p className="eyebrow">WEEKLY CHALLENGES · 4 DAYS LEFT</p><h2>Quests of the week</h2></div><span className="quest-note">Fresh every Monday</span></div><div className="challenge-grid">{weeklyChallenges.map((challenge) => { const progress = Math.min(challenge.target, weeklyQuestProgress[challenge.kind]); return <article className="challenge-card" key={challenge.id}><div className="challenge-top"><span className="challenge-icon">{challenge.icon}</span><b>+{challenge.reward} XP</b></div><h3>{challenge.title}</h3><p>{challenge.detail}</p><div className="challenge-bar"><i style={{ width: `${(progress / challenge.target) * 100}%` }} /></div><small>{progress} / {challenge.target} {challenge.kind === 'minutes' ? 'min' : challenge.kind === 'variety' ? 'types' : 'quests'}</small></article> })}</div></section>
        <section className="side-quests view-quests" id="side-quests"><div className="section-heading"><div><p className="eyebrow">OPTIONAL ADVENTURES</p><h2>Side quests</h2></div><span className="quest-note">For bonus XP & joy</span></div><div className="side-quest-grid">{sideQuests.map((quest) => <button className={`side-quest ${completedSideQuests.includes(quest.id) ? 'done' : ''}`} key={quest.id} onClick={() => toggleSideQuest(quest)}><span>{quest.icon}</span><strong>{quest.title}</strong><small>+{quest.reward} XP</small></button>)}</div></section>
        <section className="activity view-analysis" id="analysis"><div className="section-heading"><div><p className="eyebrow">YOUR PATTERN BOOK</p><h2>Data analysis</h2></div><span className="quest-note">This week</span></div><div className="analysis-grid"><article><strong>{activity.length}</strong><small>actions logged</small></article><article><strong>{Math.round(earnedXp / Math.max(1, activity.length))}</strong><small>average XP / action</small></article><article><strong>{totalMinutes}m</strong><small>time invested</small></article></div><div className="weekly-chart"><div className="chart-labels"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div><div className="bars"><i style={{ height: '42%' }} /><i style={{ height: '68%' }} /><i style={{ height: '30%' }} /><i style={{ height: '84%' }} /><i style={{ height: '55%' }} /><i style={{ height: '25%' }} /><i style={{ height: '10%' }} /></div></div><div className="section-heading compact-heading"><div><p className="eyebrow">MILESTONES</p><h2>Your goals</h2></div><span className="quest-note">3 active</span></div><div className="goals-list">{goals.map((goal) => <article className="goal-row" key={goal.id}><span className={`goal-dot ${goal.color}`} /><div><strong>{goal.title}</strong><small>{goal.detail}</small></div><b>{goal.current} / {goal.target} {goal.unit}</b><div className="goal-bar"><i style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }} /></div></article>)}</div><div className="section-heading compact-heading"><div><p className="eyebrow">REWARDS EARNED</p><h2>Achievement shelf</h2></div></div><div className="achievement-shelf">{achievements.map((achievement) => <div className={`achievement ${achievement.unlocked ? 'unlocked' : ''}`} key={achievement.title}><span>{achievement.icon}</span><small>{achievement.title}</small></div>)}</div></section>
        <section className="character-panel view-character"><label className="portrait-upload"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatarChange} /><span className="character-orb">{profile.avatar ? <img src={profile.avatar} alt="Your character portrait" /> : profile.magicType.slice(0, 1)}</span><strong>{profile.avatar ? 'Change portrait' : 'Add a character portrait'}</strong><small>PNG, JPG, or WebP</small></label><p className="eyebrow">YOUR CHARACTER</p><h2>{profile.name || 'Unnamed mage'}</h2><p className="character-subtitle">{profile.magicType} mage · Level 4 Day Shaper</p><div className="trait-grid"><span><small>FITNESS</small><b>{profile.fitness}</b></span><span><small>SCHOOL</small><b>{profile.school}</b></span><span><small>WRITING</small><b>{profile.writing}</b></span><span><small>GUITAR</small><b>{profile.guitar}</b></span></div><div className="character-stats"><div><b>12</b><small>VITALITY</small></div><div><b>08</b><small>WISDOM</small></div><div><b>15</b><small>DEXTERITY</small></div><div><b>06</b><small>INSIGHT</small></div></div><button className="primary-button" onClick={() => setIsSettingUp(true)}>Edit character</button></section>
        {isNotificationPanelOpen && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setIsNotificationPanelOpen(false)}><section className="log-modal notification-modal"><button type="button" className="close-button" onClick={() => setIsNotificationPanelOpen(false)} aria-label="Close">×</button><p className="eyebrow">STAY IN THE FLOW</p><h2>Quest reminders</h2><p className="modal-copy">Get a gentle nudge when it is time to check in with your daily run.</p><button className="submit-button" onClick={enableNotifications}>{profile.notifications ? 'Notifications enabled' : 'Enable notifications'} <span>→</span></button></section></div>}
        {isSettingUp && <div className="modal-backdrop"><form className="log-modal setup-modal" onSubmit={finishSetup}><p className="eyebrow">WELCOME, MAGE · 01 / 01</p><h2>Build your character</h2><p className="modal-copy">A quick read on your world helps us shape better quests.</p><div className="quiz-grid"><label>What should we call you?<input name="name" required defaultValue={profile.name} placeholder="Your name" autoFocus /></label><label>Choose your magic type<select name="magicType" defaultValue={profile.magicType}><option>Air</option><option>Fire</option><option>Water</option><option>Earth</option></select></label><label>What are you focusing on?<input name="focus" defaultValue={profile.focus} /></label><label>How is your fitness right now?<select name="fitness" defaultValue={profile.fitness}><option>Getting started</option><option>Finding my rhythm</option><option>Training consistently</option><option>Performance focused</option></select></label><label>How is school going?<select name="school" defaultValue={profile.school}><option>Finding my footing</option><option>Steady progress</option><option>Doing well</option><option>Ready for a challenge</option></select></label><label>Where are you with writing?<select name="writing" defaultValue={profile.writing}><option>Curious beginner</option><option>Writing sometimes</option><option>Building a practice</option><option>Serious about my craft</option></select></label><label>Where are you with guitar?<select name="guitar" defaultValue={profile.guitar}><option>Brand new</option><option>Learning a few chords</option><option>Practicing regularly</option><option>Playing songs</option></select></label></div><button className="submit-button" type="submit">Enter Mage Quest <span>→</span></button></form></div>}
        {isLogging && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setIsLogging(false)}><form className="log-modal" onSubmit={logActivity}><button type="button" className="close-button" onClick={() => { setIsTimerRunning(false); setIsLogging(false) }} aria-label="Close">×</button><p className="eyebrow">ADD TO YOUR JOURNEY</p><h2>Log an activity</h2><label>What did you work on?<select value={activityForm.type} onChange={(event) => setActivityForm({ ...activityForm, type: event.target.value })}>{activityTypes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><div className="timer-box"><div><p className="eyebrow">FOCUS TIMER</p><strong>{String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:{String(timerSeconds % 60).padStart(2, '0')}</strong></div><div className="timer-controls"><button type="button" onClick={() => setIsTimerRunning((current) => !current)}>{isTimerRunning ? 'Pause' : timerSeconds ? 'Resume' : 'Start timer'}</button><button type="button" onClick={() => { setTimerSeconds(0); setIsTimerRunning(false) }}>Reset</button></div></div><div className="form-row"><label>Minutes<input type="number" min="1" max="600" value={activityForm.duration} onChange={(event) => setActivityForm({ ...activityForm, duration: event.target.value })} /></label><label>Intensity <span className="field-hint">1–5</span><input type="number" min="1" max="5" value={activityForm.intensity} onChange={(event) => setActivityForm({ ...activityForm, intensity: event.target.value })} /></label></div><button className="submit-button" type="submit">{timerSeconds >= 60 ? 'Finish & claim XP' : 'Claim XP'} <span>→</span></button></form></div>}
      </section>
    </main>
  )
}

export default App
