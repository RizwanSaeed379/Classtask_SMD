import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

import Header from '../components/Header';
import StatBox from '../components/StatBox';
import Banner from '../components/Banner';
import EmptyState from '../components/EmptyState';
import AppButton from '../components/AppButton';
import CourseProgress from '../components/CourseProgress';
import { COLORS, CURRENT_WEEK, TOTAL_WEEKS, HEAVY_WEEK_HOURS, WEEKS_TO_SHOW } from '../constants';
import {
  getStatus,
  getWeeklyHours,
  getHeavyWeeks,
  getHoursByCourse,
  getCompletionByCourse,
} from '../helpers';

const chartWidth = Dimensions.get('window').width - 32;

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(59, 91, 219, ${opacity})`,
  labelColor: () => COLORS.muted,
  barPercentage: 0.6,
};

export default function DashboardScreen({ tasks, courses, onOpen }) {
  const pending = tasks.filter((t) => !t.done);
  const overdue = tasks.filter((t) => getStatus(t) === 'overdue');
  const doneCount = tasks.length - pending.length;
  const donePercent = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);
  const hoursThisWeek = pending
    .filter((t) => t.week === CURRENT_WEEK)
    .reduce((sum, t) => sum + t.hours, 0);

  const weekly = getWeeklyHours(tasks, CURRENT_WEEK, WEEKS_TO_SHOW);
  const heavyWeeks = getHeavyWeeks(tasks, CURRENT_WEEK, WEEKS_TO_SHOW);
  const byCourse = getHoursByCourse(tasks, courses);
  const completion = getCompletionByCourse(tasks, courses);

  const barData = {
    labels: weekly.map((w) => 'W' + w.week),
    datasets: [
      {
        data: weekly.map((w) => w.hours),
        // red bar for crunch weeks
        colors: weekly.map((w) => () => (w.hours > HEAVY_WEEK_HOURS ? COLORS.danger : COLORS.primary)),
      },
    ],
  };

  const pieData = byCourse.map((c) => ({
    name: c.code,
    hours: c.hours,
    color: c.color,
    legendFontColor: COLORS.text,
    legendFontSize: 13,
  }));

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
      <Header title="CrunchTime" subtitle={`Week ${CURRENT_WEEK} of ${TOTAL_WEEKS} · see your crunch weeks coming`} />

      <View style={styles.statRow}>
        <StatBox label="Pending" value={pending.length} />
        <StatBox label="Overdue" value={overdue.length} color={overdue.length > 0 ? COLORS.danger : COLORS.text} />
        <StatBox label="Hours this week" value={hoursThisWeek + 'h'} />
        <StatBox label="Completed" value={donePercent + '%'} color={COLORS.success} />
      </View>

      {/* warnings change depending on the data */}
      {overdue.length > 0 && (
        <Banner
          type="danger"
          title={`${overdue.length} task${overdue.length > 1 ? 's' : ''} overdue`}
          message={overdue.map((t) => `${t.course} ${t.title}`).join(', ')}
        />
      )}
      {heavyWeeks.map((w) => (
        <Banner
          key={w.week}
          type="warning"
          title={`Crunch week ahead: Week ${w.week} (${w.hours}h)`}
          message={`That's more than your ${HEAVY_WEEK_HOURS}h limit. Start some of it in week ${Math.max(CURRENT_WEEK, w.week - 1)}.`}
        />
      ))}
      {heavyWeeks.length === 0 && overdue.length === 0 && (
        <Banner type="success" title="No crunch weeks ahead" message="Your workload looks balanced. Nice." />
      )}

      <Text style={styles.sectionTitle}>Workload for the next {WEEKS_TO_SHOW} weeks</Text>
      <View style={styles.chartCard}>
        <BarChart
          data={barData}
          width={chartWidth - 16}
          height={210}
          chartConfig={chartConfig}
          yAxisLabel=""
          yAxisSuffix="h"
          fromZero
          showValuesOnTopOfBars
          withCustomBarColorFromData
          flatColor
        />
        <Text style={styles.caption}>Red bars are over the {HEAVY_WEEK_HOURS}h weekly limit</Text>
      </View>

      <Text style={styles.sectionTitle}>Pending hours by course</Text>
      {pieData.length === 0 ? (
        <EmptyState title="Nothing pending" message="All tasks are done. Add new ones as they come." />
      ) : (
        <View style={styles.chartCard}>
          <PieChart
            data={pieData}
            width={chartWidth - 16}
            height={180}
            chartConfig={chartConfig}
            accessor="hours"
            backgroundColor="transparent"
            paddingLeft="10"
          />
        </View>
      )}

      <Text style={styles.sectionTitle}>Tasks completed per course</Text>
      <CourseProgress items={completion} />

      <View style={{ marginTop: 10 }}>
        <AppButton title={`View all tasks (${tasks.length})`} onPress={() => onOpen('tasks')} />
        <AppButton title="Plan my study hours" onPress={() => onOpen('planner')} />
        <AppButton title="+ Add a deadline" onPress={() => onOpen('add')} outline />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  caption: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
});
