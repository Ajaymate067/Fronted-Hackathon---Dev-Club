import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight, Bell, CalendarDays, Check, ChevronDown, Code2, GitBranch, Grid2X2,
  Layers3, Menu, Moon, Search, Send, Settings, Sparkles, Star, Sun,
  Trophy, UserRound, Users, X, Zap
} from 'lucide-react';
import { developers, events, leaderboard, notifications, projects } from './data';

const projectFilters = ['All', 'AI/ML', 'Web', 'Mobile', 'Cybersecurity', 'Open Source'];
const roleFilters = ['All', 'Frontend', 'Backend', 'AI/ML', 'UI/UX', 'Mobile', 'Cybersecurity'];
const skillFilters = ['All skills', 'React', 'Python', 'JavaScript', 'Java', 'Figma', 'Machine Learning'];
const backgroundParticles = Array.from({ length: 26 }, (_, index) => ({
  id: index,
  size: 2 + (index % 3),
  left: `${8 + ((index * 37) % 84)}%`,
  top: `${6 + ((index * 61) % 86)}%`,
  delay: `${(index % 7) * -1.4}s`,
  duration: `${12 + (index % 6) * 2}s`
}));
const codeSymbols = ['<>', '</>', '{}', '()', '[]', '01', '01', 'JS', 'PY', 'AI', '#', '=>', '&&', '++', 'npm', 'git', '01', '{}'];

function getSavedList(key) {
  try {
    const savedValue = JSON.parse(localStorage.getItem(key));
    return Array.isArray(savedValue) ? savedValue : [];
  } catch {
    return [];
  }
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('devhub-theme') === 'light' ? 'light' : 'dark');
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationItems, setNotificationItems] = useState(() => getSavedList('devhub-notifications').length ? getSavedList('devhub-notifications') : notifications);
  const [registeredEvents, setRegisteredEvents] = useState(() => getSavedList('devhub-events'));
  const [connections, setConnections] = useState(() => getSavedList('devhub-connections'));
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [globalQuery, setGlobalQuery] = useState('');
  const [projectQuery, setProjectQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All skills');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [developerQuery, setDeveloperQuery] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('devhub-theme', theme);
  }, [theme]);
  useEffect(() => {
    const root = document.documentElement;
    const updateMouseGlow = (event) => {
      root.style.setProperty('--mouse-x', `${event.clientX}px`);
      root.style.setProperty('--mouse-y', `${event.clientY}px`);
    };
    const updateScrollDepth = () => {
      root.style.setProperty('--scroll-depth', `${window.scrollY * 0.08}px`);
      root.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    if (window.matchMedia('(pointer: fine)').matches) document.addEventListener('mousemove', updateMouseGlow, { passive: true });
    window.addEventListener('scroll', updateScrollDepth, { passive: true });
    updateScrollDepth();
    return () => {
      document.removeEventListener('mousemove', updateMouseGlow);
      window.removeEventListener('scroll', updateScrollDepth);
    };
  }, []);
  useEffect(() => { localStorage.setItem('devhub-events', JSON.stringify(registeredEvents)); }, [registeredEvents]);
  useEffect(() => { localStorage.setItem('devhub-connections', JSON.stringify(connections)); }, [connections]);
  useEffect(() => { localStorage.setItem('devhub-notifications', JSON.stringify(notificationItems)); }, [notificationItems]);
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { setModal(null); setSearchOpen(false); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
  useEffect(() => {
    const sections = ['home', 'projects', 'events', 'teammates', 'leaderboard']
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visibleSection) setActiveSection(visibleSection.target.id);
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.25, 0.5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
    setMobileMenuOpen(false);
  };
  const registerForEvent = (event) => {
    if (registeredEvents.includes(event.id)) { showToast('You are already registered for this event.', 'info'); return; }
    setRegisteredEvents([...registeredEvents, event.id]);
    showToast(`Registration successful for ${event.name}.`);
  };
  const connectToDeveloper = (developer) => {
    if (connections.includes(developer.id)) { showToast('Request already sent.', 'info'); return; }
    setConnections([...connections, developer.id]);
    showToast(`Connection request sent to ${developer.name}.`);
  };
  const openProject = (project) => setModal({ type: 'project', data: project });
  const openDeveloper = (developer) => setModal({ type: 'developer', data: developer });
  const markNotificationRead = (id) => {
    setNotificationItems((items) => items.map((item) => item.id === id ? { ...item, read: true } : item));
    showToast('Notification marked as read.', 'info');
  };

  const filteredProjects = useMemo(() => projects.filter((project) => {
    const matchesCategory = projectFilter === 'All' || project.category === projectFilter;
    const text = `${project.name} ${project.description}`.toLowerCase();
    return matchesCategory && text.includes(projectQuery.toLowerCase());
  }), [projectFilter, projectQuery]);
  const filteredDevelopers = useMemo(() => developers.filter((developer) => {
    const matchesRole = roleFilter === 'All' || developer.role === roleFilter;
    const matchesSkill = skillFilter === 'All skills' || developer.skills.includes(skillFilter);
    const matchesAvailability = availabilityFilter === 'All' || developer.availability === availabilityFilter;
    const text = `${developer.name} ${developer.title} ${developer.skills.join(' ')}`.toLowerCase();
    return matchesRole && matchesSkill && matchesAvailability && text.includes(developerQuery.toLowerCase());
  }), [roleFilter, skillFilter, availabilityFilter, developerQuery]);
  const unreadCount = notificationItems.filter((item) => !item.read).length;
  const globalResults = useMemo(() => {
    const query = globalQuery.toLowerCase().trim();
    if (!query) return [];
    return {
      projects: projects.filter((item) => `${item.name} ${item.description}`.toLowerCase().includes(query)).slice(0, 3),
      developers: developers.filter((item) => `${item.name} ${item.title} ${item.skills.join(' ')}`.toLowerCase().includes(query)).slice(0, 3),
      events: events.filter((item) => `${item.name} ${item.type}`.toLowerCase().includes(query)).slice(0, 3)
    };
  }, [globalQuery]);

  return (
    <div className="app-shell">
      <AnimatedBackground />
      <Navbar activeSection={activeSection} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} onNavigate={scrollTo} onSearch={() => setSearchOpen(true)} onSettings={() => showToast('Settings will be available in your profile soon.', 'info')} theme={theme} toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} notificationsOpen={notificationsOpen} setNotificationsOpen={setNotificationsOpen} notificationItems={notificationItems} unreadCount={unreadCount} markNotificationRead={markNotificationRead} profileOpen={profileOpen} setProfileOpen={setProfileOpen} openDeveloper={() => openDeveloper(developers.find((item) => item.name === 'Ajay Kumar'))} />
      <main>
        <Hero onNavigate={scrollTo} />
        <Stats />
        <ProjectsSection projects={filteredProjects} query={projectQuery} setQuery={setProjectQuery} filter={projectFilter} setFilter={setProjectFilter} onOpen={openProject} />
        <EventsSection events={events} registeredEvents={registeredEvents} onRegister={registerForEvent} />
        <TeammatesSection developers={filteredDevelopers} query={developerQuery} setQuery={setDeveloperQuery} roleFilter={roleFilter} setRoleFilter={setRoleFilter} skillFilter={skillFilter} setSkillFilter={setSkillFilter} availabilityFilter={availabilityFilter} setAvailabilityFilter={setAvailabilityFilter} connections={connections} onConnect={connectToDeveloper} onOpen={openDeveloper} />
        <LeaderboardSection onOpen={openDeveloper} onStartBuilding={() => scrollTo('projects')} />
      </main>
      <Footer onNavigate={scrollTo} />
      {searchOpen && <GlobalSearch query={globalQuery} setQuery={setGlobalQuery} results={globalResults} onClose={() => { setSearchOpen(false); setGlobalQuery(''); }} onNavigate={scrollTo} />}
      {modal && <Modal modal={modal} onClose={() => setModal(null)} />}
      {toast && <Toast toast={toast} />}
    </div>
  );
}

function AnimatedBackground() {
  return <div className="ambient-background" aria-hidden="true">
    <span className="mouse-glow" />
    <span className="ambient-orb orb-blue" />
    <span className="ambient-orb orb-purple" />
    <span className="ambient-orb orb-cyan" />
    <div className="particle-layer">{backgroundParticles.map((particle) => <i key={particle.id} style={{ '--particle-size': `${particle.size}px`, '--particle-left': particle.left, '--particle-top': particle.top, '--particle-delay': particle.delay, '--particle-duration': particle.duration }} />)}</div>
    <div className="code-symbol-layer">{codeSymbols.map((symbol, index) => <span key={`${symbol}-${index}`} style={{ '--symbol-index': index }}>{symbol}</span>)}</div>
    <div className="network-layer"><span className="network-node node-one" /><span className="network-node node-two" /><span className="network-node node-three" /><span className="network-node node-four" /><span className="network-node node-five" /><span className="network-line line-one" /><span className="network-line line-two" /><span className="network-line line-three" /><span className="network-line line-four" /></div>
  </div>;
}

function Navbar({ activeSection, mobileMenuOpen, setMobileMenuOpen, onNavigate, onSearch, onSettings, theme, toggleTheme, notificationsOpen, setNotificationsOpen, notificationItems, unreadCount, markNotificationRead, profileOpen, setProfileOpen, openDeveloper }) {
  const links = [['home', 'Home'], ['projects', 'Projects'], ['events', 'Events'], ['teammates', 'Teammates'], ['leaderboard', 'Leaderboard']];
  return <header className="navbar-wrap"><nav className="navbar container"><button className="brand" onClick={() => onNavigate('home')}><span className="brand-mark">D</span><span>ev<span>Hub</span></span></button><button className="menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation"><Menu size={21} /></button><div className={`nav-content ${mobileMenuOpen ? 'open' : ''}`}><div className="nav-links">{links.map(([id, label]) => <button key={id} className={activeSection === id ? 'active' : ''} onClick={() => onNavigate(id)}>{label}</button>)}</div><div className="nav-actions"><button className="nav-icon" onClick={onSearch} aria-label="Open search"><Search size={18} /></button><button className="nav-icon" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button><div className="popover-anchor"><button className="nav-icon notification-button" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Open notifications"><Bell size={18} />{unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}</button>{notificationsOpen && <NotificationMenu items={notificationItems} onRead={markNotificationRead} />}</div><div className="popover-anchor"><button className="profile-button" onClick={() => setProfileOpen(!profileOpen)}><span className="mini-avatar">AK</span><ChevronDown size={14} /></button>{profileOpen && <ProfileMenu openDeveloper={openDeveloper} onSettings={onSettings} />}</div></div></div></nav></header>;
}

function NotificationMenu({ items, onRead }) { return <div className="dropdown notification-menu"><div className="dropdown-title"><span>Notifications</span><span className="muted">{items.filter((item) => !item.read).length} new</span></div>{items.map((item) => <button className={`notification-item ${item.read ? 'read' : ''}`} key={item.id} onClick={() => onRead(item.id)}><span className="notification-icon"><Bell size={14} /></span><span><b>{item.text}</b><small>{item.time}</small></span></button>)}</div>; }
function ProfileMenu({ openDeveloper, onSettings }) { return <div className="dropdown profile-menu"><div className="profile-summary"><span className="large-avatar">AK</span><span><b>Ajay Kumar</b><small>Student Developer</small></span></div><div className="profile-xp"><strong>1,920 XP</strong><span>Level 08 · Builder</span></div><div className="profile-stats"><span><b>12</b> Projects</span><span><b>5</b> Hacks</span><span><b>8</b> Contributions</span></div><div className="profile-skills"><span>Python</span><span>React</span><span>AI/ML</span><span>JavaScript</span></div><button className="profile-menu-button" onClick={openDeveloper}><UserRound size={15} /> View Profile</button><button className="profile-menu-button" onClick={onSettings}><Settings size={15} /> Settings</button></div>; }

function Hero({ onNavigate }) { return <section className="hero" id="home"><div className="hero-grid container"><div className="hero-copy"><div className="eyebrow"><span className="pulse-dot" /> 642 developers building together</div><h1>Build.<br /><span>Ship.</span> Connect.</h1><p>Your college developer community for projects, hackathons, teammates and everything you build.</p><div className="hero-buttons"><button className="primary-button" onClick={() => onNavigate('projects')}>Explore Projects <ArrowRight size={16} /></button><button className="secondary-button" onClick={() => onNavigate('teammates')}>Find Teammates <Users size={16} /></button></div><div className="hero-subnote"><span className="avatar-stack"><i>AS</i><i>RM</i><i>+8</i></span><span>Real people. Real projects. One community.</span></div></div><div className="activity-visual"><div className="visual-glow glow-a" /><div className="visual-glow glow-b" /><div className="activity-card"><div className="activity-top"><span className="window-dots"><i /><i /><i /></span><span>devhub / activity</span><span className="live-label"><span /> live</span></div><div className="activity-head"><span><small>Community pulse</small><strong>Build energy is high</strong></span><span className="activity-icon"><Zap size={18} /></span></div><div className="activity-graph"><div className="graph-labels"><span>commits</span><b>+28.4%</b></div><div className="bars">{[32, 50, 43, 68, 55, 76, 64, 90, 74, 100].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><div className="graph-days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Today</span></div></div><div className="activity-metrics"><span><b>128</b><small>projects</small></span><span><b>37</b><small>events</small></span><span><b>2.4k</b><small>XP earned</small></span></div></div><div className="floating-note note-project"><span className="note-icon"><Sparkles size={15} /></span><span><small>New project</small><b>CodeConnect</b></span><ArrowRight size={14} /></div><div className="floating-note note-xp"><span className="note-icon blue"><Trophy size={15} /></span><span><small>Top contributor</small><b>Aarav · 2,450 XP</b></span></div></div></div></section>; }
function Stats() { const stats = [['642', 'Developers'], ['128', 'Projects'], ['37', 'Events'], ['24', 'Active Teams']]; return <section className="stats-bar"><div className="container stats-grid">{stats.map(([number, label], index) => <div className="stat-item" key={label}><strong>{number}{index === 0 && <em>+</em>}</strong><span>{label}</span></div>)}</div></section>; }

function ProjectsSection({ projects: visibleProjects, query, setQuery, filter, setFilter, onOpen }) { return <section className="section" id="projects"><div className="container"><SectionHeader eyebrow="01 / Explore & build" title="Trending Projects" subtitle="See what students are building." /><div className="section-tools"><div className="filter-scroll">{projectFilters.map((item) => <button className={`filter-pill ${filter === item ? 'selected' : ''}`} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div><label className="search-input"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects..." /></label></div>{visibleProjects.length ? <div className="project-grid">{visibleProjects.map((project) => <ProjectCard key={project.id} project={project} onOpen={onOpen} />)}</div> : <EmptyState onClear={() => { setFilter('All'); setQuery(''); }} />}</div></section>; }
function ProjectCard({ project, onOpen }) { return <article className="project-card"><div className="card-heading"><span className="project-icon">{project.icon}</span><span className="tag">{project.category}</span></div><h3>{project.name}</h3><p>{project.description}</p><div className="tag-list">{project.tech.map((item) => <span key={item}>{item}</span>)}</div><div className="project-meta"><span><Users size={13} /> {project.team} members</span><span><Star size={13} /> {project.stars}</span></div><div className="project-actions"><span>by {project.creator}</span><button onClick={() => onOpen(project)}>View Project <ArrowRight size={13} /></button></div></article>; }
function EmptyState({ onClear }) { return <div className="empty-state"><Search size={24} /><h3>No projects found.</h3><p>Try another search or clear the filters.</p><button className="secondary-button" onClick={onClear}>Clear Filters</button></div>; }

function EventsSection({ events: eventItems, registeredEvents, onRegister }) { return <section className="section soft-section" id="events"><div className="container"><SectionHeader eyebrow="02 / Learn together" title="Upcoming Events" subtitle="Make time to learn, build, and meet the people shaping what's next." /><div className="event-grid">{eventItems.map((event) => <EventCard key={event.id} event={event} registered={registeredEvents.includes(event.id)} onRegister={onRegister} />)}</div></div></section>; }
function EventCard({ event, registered, onRegister }) { return <article className="event-card"><div className="event-top"><span className="tag">{event.type}</span><CalendarDays size={18} /></div><h3>{event.name}</h3><p>{event.description}</p><div className="event-details"><span><b>{event.date}</b><small>{event.time}</small></span><span><b>{event.location}</b><small>{event.participants + (registered ? 1 : 0)} participants</small></span></div><button className={`register-button ${registered ? 'registered' : ''}`} onClick={() => onRegister(event)}>{registered ? <><Check size={15} /> Registered</> : <>Register <ArrowRight size={15} /></>}</button></article>; }

function TeammatesSection({ developers: visibleDevelopers, query, setQuery, roleFilter, setRoleFilter, skillFilter, setSkillFilter, availabilityFilter, setAvailabilityFilter, connections, onConnect, onOpen }) { return <section className="section" id="teammates"><div className="container"><SectionHeader eyebrow="03 / Find your people" title="Find Your Next Teammate" subtitle="Don't build alone. Find the skills and energy your next idea needs." /><div className="teammate-tools"><label className="search-input"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search developers..." /></label><div className="filter-scroll"><select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} aria-label="Filter by role">{roleFilters.map((item) => <option key={item}>{item}</option>)}</select><select value={skillFilter} onChange={(event) => setSkillFilter(event.target.value)} aria-label="Filter by skill">{skillFilters.map((item) => <option key={item}>{item}</option>)}</select><select value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value)} aria-label="Filter by availability"><option>All</option><option>Available</option><option>Busy</option></select></div></div><div className="developer-grid">{visibleDevelopers.map((developer) => <DeveloperCard key={developer.id} developer={developer} connected={connections.includes(developer.id)} onConnect={onConnect} onOpen={onOpen} />)}</div>{visibleDevelopers.length === 0 && <div className="empty-state"><Users size={24} /><h3>No teammates found.</h3><p>Try clearing one of the filters.</p></div>}</div></section>; }
function DeveloperCard({ developer, connected, onConnect, onOpen }) { return <article className="developer-card"><div className="developer-heading"><span className="developer-avatar">{developer.initials}</span><span className={`availability ${developer.availability.toLowerCase()}`}><i /> {developer.availability}</span></div><button className="developer-name" onClick={() => onOpen(developer)}><h3>{developer.name}</h3><ChevronDown size={15} /></button><p className="developer-role">{developer.title} · {developer.year}</p><div className="tag-list">{developer.skills.map((skill) => <span key={skill}>{skill}</span>)}</div><div className="developer-stats"><span><b>{developer.projects}</b> projects</span><span><b>{developer.xp}</b> XP</span></div><p className="looking-for">Available for: <b>{developer.lookingFor}</b></p><button className={`connect-button ${connected ? 'connected' : ''}`} onClick={() => onConnect(developer)}>{connected ? <><Check size={15} /> Request Sent</> : <><Send size={15} /> Connect</>}</button></article>; }

function LeaderboardSection({ onOpen, onStartBuilding }) { return <section className="section leaderboard-section" id="leaderboard"><div className="container leaderboard-layout"><div><SectionHeader eyebrow="04 / Celebrate progress" title="DevHub Leaderboard" subtitle="Build. Contribute. Level Up." /><div className="leader-list">{leaderboard.map((developer) => <button className={`leader-row ${developer.name === 'Ajay Kumar' ? 'current-user' : ''}`} key={developer.id} onClick={() => onOpen(developer)}><span className="rank">{developer.rank < 4 ? ['🥇', '🥈', '🥉'][developer.rank - 1] : `0${developer.rank}`}</span><span className="leader-avatar">{developer.initials}</span><span className="leader-person"><b>{developer.name}{developer.name === 'Ajay Kumar' && <em>You</em>}</b><small>{developer.title}</small></span><span><b className="xp-value">{developer.xp} XP</b><small>{developer.projects} projects · {developer.hackathons} hacks</small></span><ArrowRight size={15} /></button>)}</div></div><XpPanel onStartBuilding={onStartBuilding} /></div></section>; }
function XpPanel({ onStartBuilding }) { const items = [['Participate in hackathon', '+100 XP', Trophy], ['Build a project', '+150 XP', Code2], ['Attend workshop', '+50 XP', CalendarDays], ['Open-source contribution', '+200 XP', GitBranch], ['Help another student', '+25 XP', Users]]; return <aside className="xp-panel"><div className="xp-title"><span><Zap size={18} /></span><div><p className="eyebrow">Keep climbing</p><h3>How XP works</h3></div></div>{items.map(([label, value, Icon]) => <div className="xp-row" key={label}><Icon size={15} /><span>{label}</span><b>{value}</b></div>)}<button className="primary-button full-button" onClick={onStartBuilding}>Start building <ArrowRight size={15} /></button></aside>; }

function SectionHeader({ eyebrow, title, subtitle }) { return <div className="section-header"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><p>{subtitle}</p></div>; }
function Footer({ onNavigate }) { return <footer className="footer"><div className="container footer-grid"><div><button className="brand" onClick={() => onNavigate('home')}><span className="brand-mark">D</span><span>ev<span>Hub</span></span></button><p>Built by students, for students.</p></div><div className="footer-links"><b>Explore</b><button onClick={() => onNavigate('projects')}>Projects</button><button onClick={() => onNavigate('events')}>Events</button><button onClick={() => onNavigate('teammates')}>Community</button><button onClick={() => onNavigate('leaderboard')}>Leaderboard</button></div><div className="footer-links"><b>Find us</b><a href="https://github.com" target="_blank" rel="noreferrer"><GitBranch size={15} /> GitHub</a><a href="https://linkedin.com" target="_blank" rel="noreferrer"><Layers3 size={15} /> LinkedIn</a><a href="https://discord.com" target="_blank" rel="noreferrer"><Users size={15} /> Discord</a></div></div><div className="container footer-bottom"><span>© 2026 DevHub. Built for the college developer community.</span><span>Made with curiosity <Sparkles size={13} /></span></div></footer>; }

function GlobalSearch({ query, setQuery, results, onClose, onNavigate }) { const hasResults = results.projects?.length || results.developers?.length || results.events?.length; return <div className="overlay search-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="global-search"><div className="global-search-bar"><Search size={21} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, developers, events..." /><button onClick={onClose} aria-label="Close search"><X size={19} /></button></div>{query && !hasResults && <div className="search-empty"><Search size={22} /><p>No results for “{query}”.</p></div>}{hasResults && <div className="search-results">{[['Projects', results.projects, 'projects'], ['Developers', results.developers, 'teammates'], ['Events', results.events, 'events']].map(([label, items, section]) => items?.length > 0 && <div key={label}><p className="result-label">{label}</p>{items.map((item) => <button key={item.id} onClick={() => { onClose(); onNavigate(section); }}><span className="result-icon">{label === 'Projects' ? <Grid2X2 size={15} /> : label === 'Developers' ? <Users size={15} /> : <CalendarDays size={15} />}</span><span><b>{item.name}</b><small>{item.description || item.title || item.type}</small></span><ArrowRight size={14} /></button>)}</div>)}</div>}{!query && <div className="search-hint"><span>⌘ K</span><p>Search across the DevHub community</p></div>}</div></div>; }

function Modal({ modal, onClose }) { const isProject = modal.type === 'project'; const item = modal.data; return <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="modal-card"><button className="modal-close" onClick={onClose} aria-label="Close modal"><X size={18} /></button>{isProject ? <><div className="modal-symbol project-icon">{item.icon}</div><span className="tag">{item.category}</span><h2>{item.name}</h2><p>{item.description}</p><div className="modal-info-grid"><span><small>Status</small><b>{item.status}</b></span><span><small>Created by</small><b>{item.creator}</b></span><span><small>Stars</small><b><Star size={14} /> {item.stars}</b></span><span><small>Team</small><b>{item.team} members</b></span></div><div className="modal-tags">{item.tech.map((tech) => <span key={tech}>{tech}</span>)}</div><button className="primary-button full-button" onClick={() => window.open('https://github.com', '_blank')}><GitBranch size={16} /> View GitHub</button></> : <><div className="modal-profile-head"><span className="large-avatar">{item.initials}</span><div><span className="availability available"><i /> {item.availability}</span><h2>{item.name}</h2><p>{item.title} · {item.year}</p></div></div><div className="modal-info-grid"><span><small>XP</small><b>{item.xp}</b></span><span><small>Projects</small><b>{item.projects}</b></span><span><small>Looking for</small><b>{item.lookingFor}</b></span></div><div className="modal-tags">{item.skills.map((skill) => <span key={skill}>{skill}</span>)}</div><button className="primary-button full-button" onClick={onClose}>Done <Check size={16} /></button></>}</div></div>; }
function Toast({ toast }) { return <div className={`toast ${toast.type}`}><span><Check size={16} /></span>{toast.message}</div>; }

export default App;
