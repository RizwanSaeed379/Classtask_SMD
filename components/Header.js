import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

// onBack is optional, home screen doesn't pass it
export default function Header({ title, subtitle, onBack }) {
  return (
    <View style={styles.header}>
      {onBack && (
        <Pressable onPress={onBack} style={styles.back} hitSlop={10}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  back: {
    marginBottom: 6,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 2,
  },
});
