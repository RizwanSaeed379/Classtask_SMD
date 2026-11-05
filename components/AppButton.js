import { Pressable, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

export default function AppButton({ title, onPress, outline = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        outline && styles.outline,
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text style={[styles.text, outline && { color: COLORS.primary }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
