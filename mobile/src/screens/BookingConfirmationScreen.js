import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import colors from "../theme/colors";
import PrimaryButton from "../components/PrimaryButton";
import ConfirmationCard from "../components/ConfirmationCard";

export default function BookingConfirmationScreen({ bookingData, onNext, onRestart }) {
  const { booking, confirmation_message } = bookingData;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>🎉 Booking Confirmed!</Text>
      <Text style={styles.subtitle}>
        Booking simulated, status updated in database, and copy action configured.
      </Text>

      <ConfirmationCard
        booking={booking}
        smsMessage={confirmation_message}
      />

      <View style={styles.actions}>
        <PrimaryButton
          title="View Follow-Up Timeline"
          onPress={() => onNext("follow_up")}
          style={styles.primaryBtn}
        />

        <PrimaryButton
          title="View Agent Trace Logs"
          onPress={() => onNext("trace")}
          style={styles.accentBtn}
        />

        <PrimaryButton
          title="New Booking Request"
          onPress={onRestart}
          style={styles.cancelBtn}
          textStyle={{ color: colors.textMuted }}
        />
      </View>
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
  actions: {
    marginVertical: 10,
    gap: 8,
    marginBottom: 40,
  },
  primaryBtn: {
    marginVertical: 4,
  },
  accentBtn: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    marginVertical: 4,
  },
  cancelBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 4,
  },
});
