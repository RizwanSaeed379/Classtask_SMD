import { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';

import Header from '../components/Header';
import Chip from '../components/Chip';
import AppButton from '../components/AppButton';
import { COLORS, CURRENT_WEEK, TOTAL_WEEKS, TASK_TYPES } from '../constants';

export default function AddTaskScreen({ courses, onSave, onBack }) {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [type, setType] = useState('Assignment');
  const [week, setWeek] = useState('');
  const [hours, setHours] = useState('');
  const [weight, setWeight] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    const w = Number(week);
    const h = Number(hours);
    const g = Number(weight);

    if (title.trim().length < 3) e.title = 'Title should be at least 3 characters';
    if (course === '') e.course = 'Pick a course';
    if (week === '' || !Number.isInteger(w)) e.week = 'Enter a week number';
    else if (w < CURRENT_WEEK || w > TOTAL_WEEKS) e.week = `Week must be between ${CURRENT_WEEK} and ${TOTAL_WEEKS}`;
    if (hours === '' || h <= 0) e.hours = 'How many hours will it take?';
    else if (h > 40) e.hours = 'That seems too long, max is 40h';
    if (weight === '' || g < 0 || g > 100) e.weight = 'Weight must be 0 - 100';

    return e;
  }

  function handleSave() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    onSave({
      title: title.trim(),
      course,
      type,
      week: Number(week),
      hours: Number(hours),
      weight: Number(weight),
    });
  }

  // only keep digits (and one dot for hours)
  function onlyNumbers(text) {
    return text.replace(/[^0-9.]/g, '');
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <Header title="Add a deadline" subtitle="Estimate honestly, the dashboard depends on it" onBack={onBack} />

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={[styles.input, errors.title && styles.inputError]}
        placeholder="e.g. Assignment 2"
        placeholderTextColor={COLORS.muted}
        value={title}
        onChangeText={setTitle}
        maxLength={40}
        autoCapitalize="sentences"
      />
      {errors.title && <Text style={styles.error}>{errors.title}</Text>}

      <Text style={styles.label}>Course</Text>
      <View style={styles.row}>
        {courses.map((c) => (
          <Chip
            key={c.code}
            label={c.code}
            color={c.color}
            selected={course === c.code}
            onPress={() => setCourse(c.code)}
          />
        ))}
      </View>
      {errors.course && <Text style={styles.error}>{errors.course}</Text>}

      <Text style={styles.label}>Type</Text>
      <View style={styles.row}>
        {TASK_TYPES.map((t) => (
          <Chip key={t} label={t} selected={type === t} onPress={() => setType(t)} />
        ))}
      </View>

      <View style={styles.threeCols}>
        <View style={styles.col}>
          <Text style={styles.label}>Due week</Text>
          <TextInput
            style={[styles.input, errors.week && styles.inputError]}
            placeholder={String(CURRENT_WEEK + 1)}
            placeholderTextColor={COLORS.muted}
            keyboardType="number-pad"
            maxLength={2}
            value={week}
            onChangeText={(t) => setWeek(onlyNumbers(t))}
          />
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Hours</Text>
          <TextInput
            style={[styles.input, errors.hours && styles.inputError]}
            placeholder="4"
            placeholderTextColor={COLORS.muted}
            keyboardType="decimal-pad"
            maxLength={4}
            value={hours}
            onChangeText={(t) => setHours(onlyNumbers(t))}
          />
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Weight %</Text>
          <TextInput
            style={[styles.input, errors.weight && styles.inputError]}
            placeholder="10"
            placeholderTextColor={COLORS.muted}
            keyboardType="number-pad"
            maxLength={3}
            value={weight}
            onChangeText={(t) => setWeight(onlyNumbers(t))}
          />
        </View>
      </View>
      {errors.week && <Text style={styles.error}>{errors.week}</Text>}
      {errors.hours && <Text style={styles.error}>{errors.hours}</Text>}
      {errors.weight && <Text style={styles.error}>{errors.weight}</Text>}

      <View style={{ marginTop: 20 }}>
        <AppButton title="Save deadline" onPress={handleSave} />
        <AppButton title="Cancel" onPress={onBack} outline />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    marginHorizontal: 16,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  error: {
    color: COLORS.danger,
    fontSize: 12,
    marginHorizontal: 16,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  threeCols: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  col: {
    flex: 1,
  },
});
