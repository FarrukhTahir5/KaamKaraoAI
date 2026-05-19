import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import colors from "../theme/colors";
import StatusPill from "./StatusPill";

export default function TraceLogCard({ trace }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.agentTag}>
          <Text style={styles.agentText}>{trace.agent.toUpperCase()}</Text>
        </View>
        <StatusPill type="status" value={trace.status} />
      </View>
      
      <Text style={styles.timestamp}>SYS_TIME // {trace.timestamp.toUpperCase()}</Text>
      
      <View style={styles.actionContainer}>
        <Text style={styles.actionLabel}>ACTION_EXECUTED</Text>
        <Text style={styles.actionText}>{trace.action.toUpperCase()}</Text>
      </View>
      
      <View style={styles.detailsRow}>
        <View style={styles.box}>
          <Text style={styles.boxLabel}>INPUT_PAYLOAD</Text>
          <Text style={styles.boxText}>"{trace.input}"</Text>
        </View>
        
        <View style={styles.box}>
          <Text style={styles.boxLabel}>REASONING_RESONANCE</Text>
          <Text style={[styles.boxText, { color: colors.primary }]}>"{trace.output}"</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderColor: colors.border,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  agentTag: {
    backgroundColor: "rgba(213, 195, 255, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderColor: "rgba(213, 195, 255, 0.3)",
    borderWidth: 1,
  },
  agentText: {
    color: colors.accent,
    fontWeight: "900",
    fontSize: 10,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  timestamp: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 8,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  actionContainer: {
    marginTop: 10,
  },
  actionLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.textMuted,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  actionText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "700",
    marginTop: 2,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  detailsRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  box: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderColor: colors.border,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    minHeight: 60,
  },
  boxLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.textMuted,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  boxText: {
    fontSize: 10,
    color: colors.text,
    marginTop: 4,
    lineHeight: 14,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontStyle: "italic",
  },
});
