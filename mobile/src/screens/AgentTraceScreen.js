import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import colors from "../theme/colors";
import PrimaryButton from "../components/PrimaryButton";
import TraceLogCard from "../components/TraceLogCard";
import { getTrace, resetDemo } from "../api/client";

export default function AgentTraceScreen({ requestId, onRestart }) {
  const [traceLogs, setTraceLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      const data = await getTrace(requestId);
      setTraceLogs(data.trace || []);
      setLoading(false);
    }
    loadLogs();
  }, [requestId]);

  const handleRestart = async () => {
    await resetDemo();
    onRestart();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>🕵️ Google Antigravity Agent Trace</Text>
      <Text style={styles.subtitle}>
        Real-time visibility into the step-by-step thinking, extraction, scoring, and booking logic.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <View>
          <Text style={styles.countText}>TOTAL SEQUENCE STEPS: {traceLogs.length}</Text>
          {traceLogs.map((log) => (
            <TraceLogCard key={log.id} trace={log} />
          ))}

          <PrimaryButton
            title="Start New Demo Booking (Reset)"
            onPress={handleRestart}
            style={styles.btn}
          />
        </View>
      )}
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
  loader: {
    marginVertical: 40,
  },
  countText: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  btn: {
    marginTop: 20,
    marginBottom: 40,
  },
});
