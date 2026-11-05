import { Pressable, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

// small selectable button, used for filters, sorting and picking options in the form
export default function Chip({ label, selected, onPress, color = COLORS.primary }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && { backgroundColor: color, borderColor: color },
        pressed && { opacity: 0.6 },
      ]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    marginRight: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: COLORS.text,
  },
  selectedLabel: {
    color: '#fff',
    fontWeight: '700',
  },
});
