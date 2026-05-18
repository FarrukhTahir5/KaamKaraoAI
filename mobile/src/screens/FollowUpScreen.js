import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import colors from "../theme/colors";
import PrimaryButton from "../components/PrimaryButton";

export default function FollowUpScreen({ bookingData, onNext }) {
  const { follow_up, booking } = bookingData;
  const reminders = follow_up.reminders || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>⏰ Follow-Up Schedule</Text>
      <Text style={styles.subtitle}>
        Automated post-booking coordinator scheduled subsequent checkpoints in reminders.json
      </Text>

      <View style={styles.timeline}>
        {reminders.map((reminder, idx) => (
          <View key={idx} style={styles.timelineItem}>
            <View style={styles.bulletContainer}>
              <View style={styles.bullet} />
              {idx < reminders.length - 1 && <View style={styles.line} />}
            </View>

            <View style={styles.contentCard}>
              <View style={styles.timeRow}>
                <Text style={styles.typeText}>{reminder.type.replace("_", " ").toUpperCase()}</Text>
                <Text style={styles.timeText}>{reminder.scheduled_for}</Text>
              </View>
              <Text style={styles.messageText}>{reminder.message}</Text>
            </View>
          </View>
        ))}
      </View>

      <PrimaryButton
        title="View Agent Trace Logs"
        onPress={onNext}
        style={styles.btn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 20,
  },
  timeline: {
    marginVertical: 14,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  bulletContainer: {
    alignItems: "center",
    marginRight: 14,
    width: 20,
  },
  bullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    zIndex: 2,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    position: "absolute",
    top: 10,
    bottom: -16,
    zIndex: 1,
  },
  contentCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  typeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.primary,
  },
  timeText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  messageText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  btn: {
    marginTop: 20,
    marginBottom: 40,
  },
});
