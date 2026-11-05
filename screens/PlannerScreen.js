import { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';

import Header from '../components/Header';
import Chip from '../components/Chip';
import TaskCard from '../components/TaskCard';
import Banner from '../components/Banner';
import EmptyState from '../components/EmptyState';
import { COLORS, PLAN_RANGE } from '../constants';
import { getCourse, makePlan } from '../helpers';

const quickHours = [5, 10, 15, 20];

export default function PlannerScreen({ tasks, courses, onBack }) {
  const [hoursText, setHoursText] = useState('');

  const hours = Number(hoursText);
  const isValid = hoursText !== '' && hours > 0 && hours <= 80;
  const plan = isValid ? makePlan(tasks, hours, PLAN_RANGE) : null;

  function renderResult() {
    if (hoursText === '') {
      return <EmptyState title="How much time do you have?" message="Enter your free study hours for this week and I'll pick what to do first." />;
    }
    if (!isValid) {
      return <Banner type="danger" title="Enter a number between 1 and 80" />;
    }
    if (plan.total === 0) {
      return <EmptyState title="Nothing due soon" message={`No pending tasks in the next ${PLAN_RANGE} weeks. Enjoy it!`} />;
    }

    return (
      <View>
        {plan.leftOut.length === 0 ? (
          <Banner type="success" title="Everything fits!" message={`You need ${plan.used}h out of your ${hours}h.`} />
        ) : (
          <Banner
            type="warning"
            title={`${plan.leftOut.length} task${plan.leftOut.length > 1 ? 's' : ''} won't fit`}
            message={`Using ${plan.used}h of ${hours}h. Do the ones below first, they matter most.`}
          />
        )}

        <Text style={styles.sectionTitle}>Do these first</Text>
        {plan.planned.length === 0 ? (
          <EmptyState title="Not enough time" message="None of your upcoming tasks fit. Try adding more hours." />
        ) : (
          plan.planned.map((t, i) => (
            <View key={t.id}>
              <Text style={styles.step}>{i + 1}.</Text>
              <TaskCard task={t} course={getCourse(courses, t.course)} />
            </View>
          ))
        )}

        {plan.leftOut.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Doesn't fit this week</Text>
            {plan.leftOut.map((t) => (
              <TaskCard key={t.id} task={t} course={getCourse(courses, t.course)} />
            ))}
          </View>
        )}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 30 }} keyboardShouldPersistTaps="handled">
      <Header title="Plan my week" subtitle={`Looks at pending tasks due in the next ${PLAN_RANGE} weeks`} onBack={onBack} />

      <Text style={styles.label}>Free study hours this week</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 12"
        placeholderTextColor={COLORS.muted}
        keyboardType="number-pad"
        maxLength={2}
        value={hoursText}
        onChangeText={(t) => setHoursText(t.replace(/[^0-9]/g, ''))}
      />
      <View style={styles.row}>
        {quickHours.map((h) => (
          <Chip key={h} label={h + 'h'} selected={hours === h} onPress={() => setHoursText(String(h))} />
        ))}
      </View>

      <View style={{ marginTop: 8 }}>{renderResult()}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 18,
    marginHorizontal: 16,
    marginBottom: 10,
    color: COLORS.text,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  step: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.muted,
    marginHorizontal: 18,
    marginBottom: 2,
  },
});
