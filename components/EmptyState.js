import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

export default function EmptyState({ title, message }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    padding: 24,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  message: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 4,
  },
});
