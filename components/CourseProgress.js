import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

// darkest shade for the most completed course, lightest for the least
const shades = ['#1e3a8a', '#3b5bdb', '#748ffc', '#bac8ff'];

// items: [{ code, name, done, total, value }]  (value is 0 - 1)
export default function CourseProgress({ items }) {
  const sorted = [...items].sort((a, b) => b.value - a.value);

  return (
    <View style={styles.box}>
      {sorted.map((item, index) => {
        const percent = Math.round(item.value * 100);
        const color = shades[Math.min(index, shades.length - 1)];

        return (
          <View key={item.code} style={styles.row}>
            <View style={styles.labelRow}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={[styles.percent, { color }]}>{percent}%</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: percent + '%', backgroundColor: color }]} />
            </View>
            <Text style={styles.count}>
              {item.done} of {item.total} tasks done
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 14,
  },
  row: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  percent: {
    fontSize: 14,
    fontWeight: '800',
  },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#edf0f7',
    overflow: 'hidden',
  },
  fill: {
    height: 10,
    borderRadius: 5,
  },
  count: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
  },
});
