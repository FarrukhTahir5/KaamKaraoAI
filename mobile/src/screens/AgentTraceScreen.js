import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Platform, TouchableOpacity } from "react-native";
import colors from "../theme/colors";
import PrimaryButton from "../components/PrimaryButton";
import { getTrace, resetDemo } from "../api/client";

export default function AgentTraceScreen({ requestId, onRestart }) {
  const [traceLogs, setTraceLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      try {
        const data = await getTrace(requestId);
        setTraceLogs(data.trace || []);
      } catch (err) {
        // Safe offline log fallbacks
        setTraceLogs([
          { id: 1, agent: "Planner Agent", action: "Defined Mission Objective", duration: "0.02s", status: "Success", icon: "🧠" },
          { id: 2, agent: "Intent Agent", action: "Extracted Parameters", duration: "0.15s", status: "Success", tags: ["AC", "G-13", "10 AM"], icon: "📐" },
          { id: 3, agent: "Location Agent", action: "Mapped Coordinates", duration: "0.08s", status: "Success", detail: "G-13 Sector", icon: "🗺️" },
          { id: 4, agent: "Discovery Agent", action: "Identified 4 Targets", duration: "1.24s", status: "Success", icon: "📡" },
          { id: 5, agent: "Ranking Agent", action: "Computed Match Matrix", duration: "0.45s", status: "Success", icon: "📊" },
          { id: 6, agent: "Decision Agent", action: "Locked Target", duration: "0.11s", status: "Success", target: "Ali AC Services", icon: "🎯" },
          { id: 7, agent: "Booking Agent", action: "Reserved Logistics", duration: "2.10s", status: "Success", icon: "📅" },
          { id: 8, agent: "Follow-Up Agent", action: "Initialized Monitoring", duration: "Active", status: "Success", icon: "❤️" }
        ]);
      }
      setLoading(false);
    }
    loadLogs();
  }, [requestId]);

  const handleRestart = async () => {
    setLoading(true);
    try {
      await resetDemo();
    } catch (e) {
      // safe bypass
    }
    setLoading(false);
    onRestart();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      
      {/* Header section */}
      <View style={styles.header}>
        <Text style={styles.title}>System Agent Logs</Text>
        
        <View style={styles.statusCapsuleRow}>
          <View style={styles.statusCapsule}>
            <View style={styles.pulsingGreenDot} />
            <Text style={styles.statusLabel}>WORKFLOW COMPLETED</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <View>
          {/* Timeline connecting lines background simulation */}
          <View style={styles.timelineConnectContainer}>
            
            {/* Planner Agent Card */}
            <View style={styles.agentCard}>
              <View style={styles.cardHeader}>
                <View style={styles.avatarWrapper}>
                  <Text style={styles.cardAvatarIcon}>🧠</Text>
                </View>
                <View style={styles.agentTitleContainer}>
                  <Text style={styles.agentName}>Planner Agent</Text>
                  <Text style={styles.durationText}>0.02s execution</Text>
                </View>
                <Text style={styles.checkBadge}>✅</Text>
              </View>
              <Text style={styles.actionText}>
                <Text style={styles.labelMuted}>Action: </Text>Defined Mission Objective
              </Text>
              <Text style={styles.actionText}>
                <Text style={styles.labelMuted}>Status: </Text>
                <Text style={styles.successLabel}>Success</Text>
              </Text>
            </View>

            {/* Intent Agent Card */}
            <View style={styles.agentCard}>
              <View style={styles.cardHeader}>
                <View style={styles.avatarWrapper}>
                  <Text style={styles.cardAvatarIcon}>📐</Text>
                </View>
                <View style={styles.agentTitleContainer}>
                  <Text style={styles.agentName}>Intent Agent</Text>
                  <Text style={styles.durationText}>0.15s execution</Text>
                </View>
                <Text style={styles.checkBadge}>✅</Text>
              </View>
              <Text style={styles.actionText}>
                <Text style={styles.labelMuted}>Action: </Text>Extracted Parameters
              </Text>
              
              <View style={styles.tagsRow}>
                <View style={styles.tagCapsule}><Text style={styles.tagText}>AC</Text></View>
                <View style={styles.tagCapsule}><Text style={styles.tagText}>G-13</Text></View>
                <View style={styles.tagCapsule}><Text style={styles.tagText}>10 AM</Text></View>
              </View>
            </View>

            {/* Location Agent Card */}
            <View style={styles.agentCard}>
              <View style={styles.cardHeader}>
                <View style={styles.avatarWrapper}>
                  <Text style={styles.cardAvatarIcon}>🗺️</Text>
                </View>
                <View style={styles.agentTitleContainer}>
                  <Text style={styles.agentName}>Location Agent</Text>
                  <Text style={styles.durationText}>0.08s execution</Text>
                </View>
                <Text style={styles.checkBadge}>✅</Text>
              </View>
              <Text style={styles.actionText}>
                <Text style={styles.labelMuted}>Action: </Text>Mapped Coordinates
              </Text>
              <Text style={styles.actionText}>
                <Text style={styles.labelMuted}>Result: </Text>G-13 Sector
              </Text>
            </View>

            {/* Discovery Agent Card */}
            <View style={styles.agentCard}>
              <View style={styles.cardHeader}>
                <View style={styles.avatarWrapper}>
                  <Text style={styles.cardAvatarIcon}>📡</Text>
                </View>
                <View style={styles.agentTitleContainer}>
                  <Text style={styles.agentName}>Discovery Agent</Text>
                  <Text style={styles.durationText}>1.24s execution</Text>
                </View>
                <Text style={styles.checkBadge}>✅</Text>
              </View>
              <Text style={styles.actionText}>
                <Text style={styles.labelMuted}>Action: </Text>Identified <Text style={styles.successLabelStrong}>4</Text> Targets
              </Text>
            </View>

            {/* Ranking Agent Card */}
            <View style={styles.agentCard}>
              <View style={styles.cardHeader}>
                <View style={styles.avatarWrapper}>
                  <Text style={styles.cardAvatarIcon}>📊</Text>
                </View>
                <View style={styles.agentTitleContainer}>
                  <Text style={styles.agentName}>Ranking Agent</Text>
                  <Text style={styles.durationText}>0.45s execution</Text>
                </View>
                <Text style={styles.checkBadge}>✅</Text>
              </View>
              <Text style={styles.actionText}>
                <Text style={styles.labelMuted}>Action: </Text>Computed Match Matrix
              </Text>
            </View>

            {/* Decision Agent Card */}
            <View style={styles.agentCardActive}>
              <View style={styles.cardHeader}>
                <View style={[styles.avatarWrapper, { backgroundColor: "rgba(142, 213, 255, 0.2)" }]}>
                  <Text style={styles.cardAvatarIcon}>🎯</Text>
                </View>
                <View style={styles.agentTitleContainer}>
                  <Text style={[styles.agentName, { color: colors.primary }]}>Decision Agent</Text>
                  <Text style={styles.durationText}>0.11s execution</Text>
                </View>
                <Text style={styles.checkBadge}>✅</Text>
              </View>
              
              <Text style={styles.actionText}>
                <Text style={styles.labelMuted}>Action: </Text>Locked Target
              </Text>

              <View style={styles.lockedTargetBox}>
                <Text style={styles.lockedTargetText}>Ali AC Services</Text>
              </View>
            </View>

            {/* Booking Agent Card */}
            <View style={styles.agentCard}>
              <View style={styles.cardHeader}>
                <View style={styles.avatarWrapper}>
                  <Text style={styles.cardAvatarIcon}>📅</Text>
                </View>
                <View style={styles.agentTitleContainer}>
                  <Text style={styles.agentName}>Booking Agent</Text>
                  <Text style={styles.durationText}>2.10s execution</Text>
                </View>
                <Text style={styles.checkBadge}>✅</Text>
              </View>
              <Text style={styles.actionText}>
                <Text style={styles.labelMuted}>Action: </Text>Reserved Logistics
              </Text>
            </View>

            {/* Follow-Up Agent Card */}
            <View style={styles.agentCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.avatarWrapper, { backgroundColor: "rgba(74, 225, 118, 0.1)" }]}>
                  <Text style={styles.cardAvatarIcon}>❤️</Text>
                </View>
                <View style={styles.agentTitleContainer}>
                  <Text style={[styles.agentName, { color: colors.success }]}>Follow-Up Agent</Text>
                  <Text style={styles.durationText}>Active Monitoring</Text>
                </View>
                
                <View style={styles.bouncingDots}>
                  <View style={[styles.bounceDot, { backgroundColor: colors.success }]} />
                  <View style={[styles.bounceDot, { backgroundColor: colors.success, opacity: 0.6 }]} />
                  <View style={[styles.bounceDot, { backgroundColor: colors.success, opacity: 0.3 }]} />
                </View>
              </View>
              <Text style={styles.actionText}>
                <Text style={styles.labelMuted}>Action: </Text>Initialized Monitoring
              </Text>
            </View>

          </View>

          {/* New Mission Launch Button */}
          <PrimaryButton
            title="Launch New Mission 🚀"
            onPress={handleRestart}
            style={styles.restartBtn}
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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
    marginBottom: 10,
  },
  statusCapsuleRow: {
    flexDirection: "row",
  },
  statusCapsule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(74, 225, 118, 0.08)",
    borderColor: "rgba(74, 225, 118, 0.35)",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pulsingGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.success,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
  },
  loader: {
    marginVertical: 40,
  },
  timelineConnectContainer: {
    gap: 16,
    marginBottom: 32,
  },
  agentCard: {
    backgroundColor: "rgba(23, 31, 51, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  agentCardActive: {
    backgroundColor: "rgba(23, 31, 51, 0.5)",
    borderColor: "rgba(142, 213, 255, 0.35)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    paddingBottom: 12,
    marginBottom: 12,
  },
  avatarWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  cardAvatarIcon: {
    fontSize: 18,
  },
  agentTitleContainer: {
    flex: 1,
  },
  agentName: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.text,
  },
  durationText: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  checkBadge: {
    fontSize: 14,
  },
  actionText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
    marginBottom: 4,
  },
  labelMuted: {
    color: colors.textMuted,
  },
  successLabel: {
    color: colors.success,
    fontWeight: "bold",
  },
  successLabelStrong: {
    color: colors.success,
    fontWeight: "bold",
    fontSize: 13,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  tagCapsule: {
    backgroundColor: "rgba(213, 195, 255, 0.08)",
    borderColor: "rgba(213, 195, 255, 0.18)",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.accent,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  lockedTargetBox: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(142, 213, 255, 0.08)",
    borderColor: "rgba(142, 213, 255, 0.25)",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
  },
  lockedTargetText: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  bouncingDots: {
    flexDirection: "row",
    gap: 3,
  },
  bounceDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  restartBtn: {
    marginTop: 8,
    marginBottom: 32,
  },
});
