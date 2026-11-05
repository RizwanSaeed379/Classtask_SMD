// static data for the app (no backend)

export const courses = [
  { code: 'SMD', name: 'Software for Mobile Devices', color: '#3b5bdb' },
  { code: 'PDC', name: 'Parallel & Distributed Computing', color: '#e8590c' },
  { code: 'IS', name: 'Information Security', color: '#2b8a3e' },
  { code: 'GenAI', name: 'Generative AI', color: '#ae3ec9' },
];

// week = semester week it is due in
// hours = how long I think it will take
// weight = % of the course grade
export const initialTasks = [
  { id: 1, title: 'Quiz 1', course: 'SMD', type: 'Quiz', week: 5, hours: 1, weight: 3, done: true },
  { id: 2, title: 'Lab task 4', course: 'SMD', type: 'Assignment', week: 6, hours: 2, weight: 2, done: true },
  { id: 3, title: 'Assignment 1 - React Native app', course: 'SMD', type: 'Assignment', week: 7, hours: 8, weight: 10, done: false },
  { id: 4, title: 'Midterm', course: 'SMD', type: 'Exam', week: 9, hours: 5, weight: 25, done: false },
  { id: 5, title: 'Quiz 2', course: 'SMD', type: 'Quiz', week: 10, hours: 1, weight: 3, done: false },
  { id: 6, title: 'Quiz 1', course: 'PDC', type: 'Quiz', week: 5, hours: 1, weight: 3, done: true },
  { id: 7, title: 'OpenMP assignment', course: 'PDC', type: 'Assignment', week: 6, hours: 4, weight: 5, done: false },
  { id: 8, title: 'Midterm', course: 'PDC', type: 'Exam', week: 8, hours: 6, weight: 25, done: false },
  { id: 9, title: 'MPI project', course: 'PDC', type: 'Project', week: 11, hours: 8, weight: 10, done: false },
  { id: 10, title: 'Quiz 1', course: 'IS', type: 'Quiz', week: 4, hours: 1, weight: 3, done: true },
  { id: 11, title: 'Classical ciphers assignment', course: 'IS', type: 'Assignment', week: 6, hours: 3, weight: 5, done: true },
  { id: 12, title: 'Midterm', course: 'IS', type: 'Exam', week: 8, hours: 5, weight: 25, done: false },
  { id: 13, title: 'Prompt engineering assignment', course: 'GenAI', type: 'Assignment', week: 7, hours: 3, weight: 5, done: false },
  { id: 14, title: 'Midterm', course: 'GenAI', type: 'Exam', week: 8, hours: 5, weight: 25, done: false },
  { id: 15, title: 'Paper review', course: 'GenAI', type: 'Assignment', week: 11, hours: 3, weight: 5, done: false },
];
