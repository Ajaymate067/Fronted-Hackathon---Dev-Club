export const projects = [
  { id: 1, name: 'AI Study Buddy', description: 'Turns lecture notes into focused practice sessions with helpful explanations.', category: 'AI/ML', tech: ['Python', 'Machine Learning'], creator: 'Riya Mehta', team: 4, stars: 128, status: 'In progress', icon: '✦' },
  { id: 2, name: 'CampusNav', description: 'A friendly campus guide for classrooms, clubs, shortcuts, and campus events.', category: 'Web', tech: ['React', 'JavaScript'], creator: 'Aarav Sharma', team: 3, stars: 96, status: 'Live beta', icon: '⌁' },
  { id: 3, name: 'FormFix', description: 'Makes essential civic forms easier to understand and complete for everyone.', category: 'Open Source', tech: ['HTML', 'CSS', 'AI'], creator: 'Sneha Nair', team: 5, stars: 84, status: 'Open source', icon: '◇' },
  { id: 4, name: 'HostelHub', description: 'A simple way to share room updates, maintenance requests, and hostel resources.', category: 'Web', tech: ['React', 'Firebase'], creator: 'Kabir Singh', team: 4, stars: 73, status: 'Prototype', icon: '⌂' },
  { id: 5, name: 'CodeConnect', description: 'Matches student builders by skills, interests, and the kind of work they enjoy.', category: 'Mobile', tech: ['React Native', 'Node.js'], creator: 'Ajay Kumar', team: 3, stars: 68, status: 'In progress', icon: '◎' },
  { id: 6, name: 'EcoTrack', description: 'Helps campus communities measure small changes that make a real environmental impact.', category: 'Cybersecurity', tech: ['Python', 'Data Viz'], creator: 'Rahul Patel', team: 2, stars: 54, status: 'Research', icon: '◌' }
];

export const events = [
  { id: 1, type: 'Hackathon', name: 'DevHack 2026', description: 'Build something meaningful in 24 hours with a team that gets it.', date: 'Oct 05', time: '10:00 AM', location: 'Innovation Lab', participants: 120 },
  { id: 2, type: 'Meetup', name: 'AI Builders Meetup', description: 'Share experiments, prompt ideas, and practical lessons from the field.', date: 'Oct 12', time: '5:30 PM', location: 'Seminar Hall B', participants: 80 },
  { id: 3, type: 'Workshop', name: 'Frontend Friday', description: 'A hands-on evening of thoughtful interfaces, CSS, and tiny details.', date: 'Oct 15', time: '4:00 PM', location: 'Design Studio', participants: 54 },
  { id: 4, type: 'Meetup', name: 'Open Source Night', description: 'Find your first issue and make your first contribution together.', date: 'Oct 18', time: '6:00 PM', location: 'Library Commons', participants: 65 },
  { id: 5, type: 'Workshop', name: 'Python Sprint', description: 'Practice Python by shipping small, useful automations in a group.', date: 'Oct 22', time: '3:00 PM', location: 'Lab 03', participants: 72 },
  { id: 6, type: 'Hackathon', name: 'Campus Code Jam', description: 'One weekend, one prompt, and a room full of people who build.', date: 'Oct 28', time: '9:00 AM', location: 'Main Auditorium', participants: 150 }
];

export const developers = [
  { id: 1, name: 'Aarav Sharma', initials: 'AS', year: '2nd year', role: 'Frontend', title: 'Frontend Developer', skills: ['React', 'JavaScript', 'CSS'], projects: 12, xp: 2450, availability: 'Available', lookingFor: 'AI/ML Hackathons' },
  { id: 2, name: 'Riya Mehta', initials: 'RM', year: '3rd year', role: 'AI/ML', title: 'AI/ML Developer', skills: ['Python', 'Machine Learning', 'Pandas'], projects: 9, xp: 2180, availability: 'Available', lookingFor: 'AI Projects' },
  { id: 3, name: 'Kabir Singh', initials: 'KS', year: '2nd year', role: 'UI/UX', title: 'Product Designer', skills: ['Figma', 'UI Design', 'Research'], projects: 8, xp: 2010, availability: 'Available', lookingFor: 'Design + Web' },
  { id: 4, name: 'Ajay Kumar', initials: 'AK', year: '1st year', role: 'AI/ML', title: 'Student Developer', skills: ['Python', 'React', 'AI/ML'], projects: 7, xp: 1920, availability: 'Available', lookingFor: 'Open Source' },
  { id: 5, name: 'Rahul Patel', initials: 'RP', year: '3rd year', role: 'Backend', title: 'Backend Developer', skills: ['Node.js', 'Java', 'APIs'], projects: 7, xp: 1760, availability: 'Busy', lookingFor: 'Backend Systems' },
  { id: 6, name: 'Sneha Nair', initials: 'SN', year: '2nd year', role: 'Frontend', title: 'Accessibility Advocate', skills: ['JavaScript', 'CSS', 'Testing'], projects: 6, xp: 1490, availability: 'Available', lookingFor: 'Open Source' },
  { id: 7, name: 'Dev Malhotra', initials: 'DM', year: '4th year', role: 'Mobile', title: 'Mobile Developer', skills: ['React Native', 'Java', 'Firebase'], projects: 11, xp: 2320, availability: 'Busy', lookingFor: 'Mobile Apps' },
  { id: 8, name: 'Meera Shah', initials: 'MS', year: '1st year', role: 'Cybersecurity', title: 'Security Learner', skills: ['Python', 'JavaScript', 'Linux'], projects: 4, xp: 1260, availability: 'Available', lookingFor: 'Security Projects' }
];

export const leaderboard = [...developers].sort((a, b) => b.xp - a.xp).map((developer, index) => ({ ...developer, rank: index + 1, hackathons: Math.max(3, 10 - index) }));

export const notifications = [
  { id: 1, text: 'Riya joined your project.', time: '12 min ago', icon: 'users', read: false },
  { id: 2, text: 'DevHack 2026 registration is open.', time: '1 hr ago', icon: 'calendar', read: false },
  { id: 3, text: 'You earned 150 XP.', time: 'Yesterday', icon: 'sparkles', read: true },
  { id: 4, text: 'Someone wants to connect with you.', time: 'Yesterday', icon: 'bell', read: true }
];
