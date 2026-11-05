import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const bannerColors = {
  danger: { bg: '#fff0f0', text: COLORS.danger },
  warning: { bg: '#fff6e6', text: COLORS.warning },
  success: { bg: '#ebfbee', text: COLORS.success },
};

export default function Banner({ type, title, message }) {
  const colors = bannerColors[type];
  return (
    <View style={[styles.banner, { backgroundColor: colors.bg, borderLeftColor: colors.text }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
  },
  message: {
    color: COLORS.text,
    fontSize: 13,
    marginTop: 3,
  },
});
