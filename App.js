import { useState } from 'react';
import { View, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { courses, initialTasks } from './data';
import { COLORS } from './constants';
import DashboardScreen from './screens/DashboardScreen';
import TasksScreen from './screens/TasksScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import PlannerScreen from './screens/PlannerScreen';
import VerifyPhoneScreen from './screens/VerifyPhoneScreen';

export default function App() {
  // which view is showing, no navigation library, just state
  const [screen, setScreen] = useState('dashboard');
  const [tasks, setTasks] = useState(initialTasks);
  // stays null until the phone number is verified with an OTP
  const [verifiedPhone, setVerifiedPhone] = useState(null);

  function toggleDone(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  function addTask(newTask) {
    // new id = biggest id + 1
    const nextId = tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1;
    setTasks([...tasks, { ...newTask, id: nextId, done: false }]);
    setScreen('tasks');
  }

  let content;
  if (verifiedPhone === null) {
    content = <VerifyPhoneScreen onVerified={setVerifiedPhone} />;
  } else if (screen === 'tasks') {
    content = (
      <TasksScreen
        tasks={tasks}
        courses={courses}
        onToggle={toggleDone}
        onDelete={deleteTask}
        onBack={() => setScreen('dashboard')}
        onAdd={() => setScreen('add')}
      />
    );
  } else if (screen === 'add') {
    content = <AddTaskScreen courses={courses} onSave={addTask} onBack={() => setScreen('dashboard')} />;
  } else if (screen === 'planner') {
    content = <PlannerScreen tasks={tasks} courses={courses} onBack={() => setScreen('dashboard')} />;
  } else {
    content = <DashboardScreen tasks={tasks} courses={courses} onOpen={setScreen} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: Platform.OS === 'ios' ? 50 : RNStatusBar.currentHeight || 0,
  },
});
