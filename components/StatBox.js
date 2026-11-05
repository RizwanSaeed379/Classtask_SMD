import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

export default function StatBox({ label, value, color = COLORS.text }) {
  return (
    <View style={styles.box}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
  },
  label: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
    textAlign: 'center',
  },
});
