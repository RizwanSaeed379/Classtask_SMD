import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, CURRENT_WEEK } from '../constants';
import { getStatus, getPriority } from '../helpers';

function getBadge(task) {
  const status = getStatus(task);
  if (status === 'done') return { text: 'Done', color: COLORS.success };
  if (status === 'overdue') return { text: 'Overdue', color: COLORS.danger };
  if (status === 'thisWeek') return { text: 'This week', color: COLORS.warning };

  const left = task.week - CURRENT_WEEK;
  return { text: left === 1 ? 'Next week' : `In ${left} weeks`, color: COLORS.muted };
}

// onDelete is optional (planner screen only shows the card)
export default function TaskCard({ task, course, onToggle, onDelete }) {
  const badge = getBadge(task);

  return (
    <Pressable
      onPress={() => onToggle && onToggle(task.id)}
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: course.color },
        task.done && styles.doneCard,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.title, task.done && styles.doneText]} numberOfLines={1}>
          {task.title}
        </Text>
        <Text style={[styles.badge, { color: badge.color, borderColor: badge.color }]}>
          {badge.text}
        </Text>
      </View>

      <Text style={styles.course}>
        {course.name} · {task.type}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.info}>
          Week {task.week}  ·  {task.hours}h  ·  {task.weight}% of grade
        </Text>
        {!task.done && <Text style={styles.priority}>Priority {getPriority(task)}</Text>}
      </View>

      {onDelete && (
        <View style={styles.actions}>
          <Text style={styles.hint}>{task.done ? 'Tap to mark not done' : 'Tap to mark done'}</Text>
          <Pressable onPress={() => onDelete(task.id)} hitSlop={8}>
            <Text style={styles.remove}>Remove</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderLeftWidth: 5,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  doneCard: {
    opacity: 0.6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginRight: 8,
  },
  doneText: {
    textDecorationLine: 'line-through',
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  course: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  info: {
    fontSize: 13,
    color: COLORS.text,
  },
  priority: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  hint: {
    fontSize: 12,
    color: COLORS.muted,
  },
  remove: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.danger,
  },
});
