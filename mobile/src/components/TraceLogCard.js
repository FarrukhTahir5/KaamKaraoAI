import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../theme/colors";
import StatusPill from "./StatusPill";

export default function TraceLogCard({ trace }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.agentTag}>
          <Text style={styles.agentText}>{trace.agent}</Text>
        </View>
        <StatusPill type="status" value={trace.status} />
      </View>
      
      <Text style={styles.timestamp}>Timestamp: {trace.timestamp}</Text>
      
      <View style={styles.actionContainer}>
        <Text style={styles.actionLabel}>ACTION EXECUTED</Text>
        <Text style={styles.actionText}>{trace.action}</Text>
      </View>
      
      <View style={styles.detailsRow}>
        <View style={styles.box}>
          <Text style={styles.boxLabel}>INPUT RECEIVED</Text>
          <Text style={styles.boxText}>{trace.input}</Text>
        </View>
        
        <View style={styles.box}>
          <Text style={styles.boxLabel}>REASONING OUTPUT</Text>
          <Text style={[styles.boxText, { color: colors.primary }]}>{trace.output}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    borderColor: colors.border,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  agentTag: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderColor: colors.accent,
    borderWidth: 0.5,
  },
  agentText: {
    color: colors.accent,
    fontWeight: "bold",
    fontSize: 12,
  },
  timestamp: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 8,
  },
  actionContainer: {
    marginTop: 10,
  },
  actionLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
    marginTop: 2,
  },
  detailsRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },
  box: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    padding: 10,
    borderRadius: 8,
    minHeight: 60,
  },
  boxLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  boxText: {
    fontSize: 11,
    color: colors.text,
    marginTop: 4,
    lineHeight: 14,
  },
});
