import { CURRENT_WEEK, HEAVY_WEEK_HOURS } from './constants';

export function getCourse(courses, code) {
  return courses.find((c) => c.code === code);
}

export function getStatus(task) {
  if (task.done) return 'done';
  if (task.week < CURRENT_WEEK) return 'overdue';
  if (task.week === CURRENT_WEEK) return 'thisWeek';
  return 'upcoming';
}

// bigger number = should be done first
// mix of how much it is worth and how close the deadline is
export function getPriority(task) {
  const weeksLeft = task.week - CURRENT_WEEK;
  let urgency = 10;
  if (weeksLeft > 0) {
    urgency = 10 / (weeksLeft + 1);
  }
  return Math.round(task.weight * 0.5 + urgency * 3);
}

// total pending hours for each week, starting from startWeek
export function getWeeklyHours(tasks, startWeek, count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const week = startWeek + i;
    const hours = tasks
      .filter((t) => !t.done && t.week === week)
      .reduce((sum, t) => sum + t.hours, 0);
    result.push({ week, hours });
  }
  return result;
}

export function getHeavyWeeks(tasks, startWeek, count) {
  return getWeeklyHours(tasks, startWeek, count).filter((w) => w.hours > HEAVY_WEEK_HOURS);
}

export function getHoursByCourse(tasks, courses) {
  return courses
    .map((c) => {
      const hours = tasks
        .filter((t) => t.course === c.code && !t.done)
        .reduce((sum, t) => sum + t.hours, 0);
      return { ...c, hours };
    })
    .filter((c) => c.hours > 0);
}

// fraction (0 - 1) of tasks finished in each course
export function getCompletionByCourse(tasks, courses) {
  return courses.map((c) => {
    const courseTasks = tasks.filter((t) => t.course === c.code);
    const doneCount = courseTasks.filter((t) => t.done).length;
    const value = courseTasks.length === 0 ? 0 : doneCount / courseTasks.length;
    return { code: c.code, name: c.name, done: doneCount, total: courseTasks.length, value };
  });
}

export function filterTasks(tasks, courses, search, filter) {
  const text = search.trim().toLowerCase();

  return tasks.filter((t) => {
    if (filter === 'pending' && t.done) return false;
    if (filter === 'done' && !t.done) return false;
    if (filter === 'overdue' && getStatus(t) !== 'overdue') return false;

    if (text === '') return true;

    const course = getCourse(courses, t.course);
    return (
      t.title.toLowerCase().includes(text) ||
      t.type.toLowerCase().includes(text) ||
      course.name.toLowerCase().includes(text) ||
      t.course.toLowerCase().includes(text)
    );
  });
}

export function sortTasks(tasks, sortBy) {
  const copy = [...tasks]; // don't change the original array
  if (sortBy === 'due') {
    copy.sort((a, b) => a.week - b.week);
  } else if (sortBy === 'priority') {
    copy.sort((a, b) => getPriority(b) - getPriority(a));
  } else if (sortBy === 'hours') {
    copy.sort((a, b) => b.hours - a.hours);
  }
  return copy;
}

// picks the most important tasks that fit in the hours the student has
export function makePlan(tasks, hoursAvailable, range) {
  const candidates = tasks
    .filter((t) => !t.done && t.week <= CURRENT_WEEK + range)
    .sort((a, b) => getPriority(b) - getPriority(a));

  const planned = [];
  const leftOut = [];
  let used = 0;

  candidates.forEach((t) => {
    if (used + t.hours <= hoursAvailable) {
      planned.push(t);
      used += t.hours;
    } else {
      leftOut.push(t);
    }
  });

  return { planned, leftOut, used, total: candidates.length };
}
