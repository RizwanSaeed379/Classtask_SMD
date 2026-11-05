import { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';

import Header from '../components/Header';
import Chip from '../components/Chip';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import AppButton from '../components/AppButton';
import { COLORS } from '../constants';
import { getCourse, filterTasks, sortTasks } from '../helpers';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'done', label: 'Done' },
];

const sortOptions = [
  { key: 'due', label: 'Due date' },
  { key: 'priority', label: 'Priority' },
  { key: 'hours', label: 'Longest first' },
];

export default function TasksScreen({ tasks, courses, onToggle, onDelete, onBack, onAdd }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('pending');
  const [sortBy, setSortBy] = useState('due');

  const shown = sortTasks(filterTasks(tasks, courses, search, filter), sortBy);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 30 }} keyboardShouldPersistTaps="handled">
      <Header title="My tasks" subtitle="Tap a task to mark it done" onBack={onBack} />

      <TextInput
        style={styles.search}
        placeholder="Search by title, course or type..."
        placeholderTextColor={COLORS.muted}
        value={search}
        onChangeText={setSearch}
        clearButtonMode="while-editing"
        autoCorrect={false}
      />

      <View style={styles.row}>
        {filters.map((f) => (
          <Chip key={f.key} label={f.label} selected={filter === f.key} onPress={() => setFilter(f.key)} />
        ))}
      </View>

      <View style={styles.row}>
        <Text style={styles.sortLabel}>Sort:</Text>
        {sortOptions.map((s) => (
          <Chip
            key={s.key}
            label={s.label}
            selected={sortBy === s.key}
            onPress={() => setSortBy(s.key)}
            color={COLORS.text}
          />
        ))}
      </View>

      <Text style={styles.count}>
        Showing {shown.length} of {tasks.length} tasks
      </Text>

      {shown.length === 0 ? (
        <EmptyState
          title={tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
          message={
            tasks.length === 0
              ? 'Add your first deadline to get started.'
              : 'Try a different search or filter.'
          }
        />
      ) : (
        shown.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            course={getCourse(courses, task.course)}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))
      )}

      <View style={{ marginTop: 10 }}>
        <AppButton title="+ Add a deadline" onPress={onAdd} outline />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    marginHorizontal: 16,
    marginVertical: 10,
    color: COLORS.text,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sortLabel: {
    fontSize: 13,
    color: COLORS.muted,
    marginRight: 8,
    marginBottom: 8,
  },
  count: {
    fontSize: 12,
    color: COLORS.muted,
    marginHorizontal: 16,
    marginBottom: 8,
  },
});
