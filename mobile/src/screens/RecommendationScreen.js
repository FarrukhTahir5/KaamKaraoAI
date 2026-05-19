import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Platform, TouchableOpacity, Image } from "react-native";
import colors from "../theme/colors";
import PrimaryButton from "../components/PrimaryButton";
import { bookProvider } from "../api/client";

export default function RecommendationScreen({ matchData, selectedId, requestId, onNext }) {
  const [loading, setLoading] = useState(false);

  const recommendation = matchData.recommended_provider || {
    id: "P-101",
    name: "Ali AC Services",
    service_type: "AC Repair",
    distance_km: 1.2,
    rating: 4.9,
    available_slot: "08:00 AM",
    estimated_charges: "Rs. 1,500",
    trust_score: 92,
    reason: "Optimal selection based on proximity, 100% morning slot availability, and superior Trust Score."
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const bookingRes = await bookProvider(requestId, selectedId || recommendation.id);
      setLoading(false);
      onNext(bookingRes);
    } catch (err) {
      setLoading(false);
      // Offline fallback booking result
      onNext({
        booking_id: "BK-" + Math.floor(Math.random() * 100000),
        status: "CONFIRMED",
        provider: recommendation,
        eta: "28 minutes",
        diagnostics: {
          session_logs: [
            "Agent.Init: Spawning planner threads...",
            "Agent.Location: Geocoding G-13 coordinate sets...",
            "Agent.Discovery: Matched 3 active field modules...",
            "Agent.Optimizer: Selected Ali AC (Score: 92%)...",
            "Agent.Scheduler: Dispatched confirmation packet..."
          ]
        }
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      
      {/* Ready Status Header */}
      <View style={styles.statusHeader}>
        <View style={styles.pulsingGreenDot} />
        <Text style={styles.statusLabel}>STATUS: READY</Text>
      </View>
      <Text style={styles.title}>Primary Target Selected</Text>

      {/* Profile & Compatibility gauge row */}
      <View style={styles.topProfileGrid}>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarHexagonWrapper}>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDATiTM--W5hRjpV9jpY13odRu7DqfDrM06q5UsT-s5Wxfb5RuO0-dRQGLMk6RBS2AJNx6SF1m0Q8xbOS3QZobhF_DAfD3va5pbzaazriSooYkLU7sK1ydfecjKj47Unpu6nat2B2S7-GaNzC5-MYn7P7CC-RS85Qvt0Ikf5rqXW5UqCcfAzlYx_IM_W5AnXTY3Ktf_teLO7fxcRrjnq9b2C74RTRv9YmcJRYCOJ4k4lCTc0jkebkOgUB7JBQNfykR6AuDvTvJitJU" }}
              style={styles.hexagonAvatar}
            />
          </View>
          <Text style={styles.operativeName}>{recommendation.name}</Text>
          <Text style={styles.operativeId}>ID: S-7729-AC</Text>
          
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>🛡️ Verified Specialist</Text>
          </View>
        </View>

        {/* Compatibility Ring Card */}
        <View style={styles.compatibilityCard}>
          <View style={styles.outerGlowRing}>
            <View style={styles.innerGlowRing}>
              <Text style={styles.compatibilityPercent}>
                {recommendation.trust_score || 92}
                <Text style={styles.compatibilityPercentSign}>%</Text>
              </Text>
            </View>
          </View>
          <Text style={styles.compatibilityLabel}>MISSION COMPATIBILITY</Text>
        </View>

      </View>

      {/* AI Synthesis Details */}
      <View style={styles.synthesisCard}>
        <View style={styles.synthesisHeaderRow}>
          <Text style={styles.sparkIcon}>✨</Text>
          <Text style={styles.synthesisTitle}>AI Synthesis</Text>
        </View>
        <Text style={styles.synthesisDesc}>
          {recommendation.reason || "Optimal selection based on proximity, 100% morning slot availability, and superior Trust Score. Historically outperforms regional average in speed."}
        </Text>

        <View style={styles.synthesisGrid}>
          <View style={[styles.synthesisMetric, { borderLeftColor: colors.success }]}>
            <Text style={styles.metricLabel}>Proximity</Text>
            <Text style={styles.metricValue}>{recommendation.distance_km || "1.2"} km</Text>
          </View>
          
          <View style={[styles.synthesisMetric, { borderLeftColor: colors.primary }]}>
            <Text style={styles.metricLabel}>Trust Score</Text>
            <Text style={styles.metricValue}>{recommendation.rating || "4.9"}/5.0</Text>
          </View>

          <View style={[styles.synthesisMetric, { borderLeftColor: colors.warning }]}>
            <Text style={styles.metricLabel}>ETA</Text>
            <Text style={styles.metricValue}>{recommendation.available_slot || "08:00 AM"}</Text>
          </View>
        </View>
      </View>

      {/* Competitive Intelligence Comparison Table */}
      <View style={styles.intelCard}>
        <View style={styles.intelHeader}>
          <Text style={styles.intelIcon}>📊</Text>
          <Text style={styles.intelTitle}>Competitive Intelligence</Text>
        </View>

        {/* Table Rows */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.th, { flex: 2 }]}>Operative</Text>
            <Text style={[styles.th, { flex: 2 }]}>Match</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>Availability</Text>
            <Text style={[styles.th, { flex: 1.5, textAlign: "right" }]}>Fee Est.</Text>
          </View>

          {/* Row 1 - Active */}
          <View style={styles.tableRowActive}>
            <View style={[styles.td, { flex: 2, flexDirection: "row", alignItems: "center", gap: 4 }]}>
              <View style={styles.tdActiveIndicator} />
              <Text style={styles.tdActiveText}>Ali AC</Text>
            </View>
            <View style={[styles.td, { flex: 2, flexDirection: "row", alignItems: "center", gap: 6 }]}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: "92%", backgroundColor: colors.primary }]} />
              </View>
              <Text style={styles.tdScoreText}>92%</Text>
            </View>
            <Text style={[styles.td, { flex: 1.5, color: colors.text }]}>08:00 AM</Text>
            <Text style={[styles.td, { flex: 1.5, textAlign: "right", color: colors.text }]}>₨ 1,500</Text>
          </View>

          {/* Row 2 - Alternate */}
          <View style={styles.tableRow}>
            <Text style={[styles.td, { flex: 2, color: "rgba(218, 226, 253, 0.6)" }]}>Umar Fixes</Text>
            <View style={[styles.td, { flex: 2, flexDirection: "row", alignItems: "center", gap: 6 }]}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: "78%", backgroundColor: colors.success }]} />
              </View>
              <Text style={styles.tdScoreTextMuted}>78%</Text>
            </View>
            <Text style={[styles.td, { flex: 1.5, color: "rgba(218, 226, 253, 0.6)" }]}>02:00 PM</Text>
            <Text style={[styles.td, { flex: 1.5, textAlign: "right", color: "rgba(218, 226, 253, 0.6)" }]}>₨ 1,200</Text>
          </View>

          {/* Row 3 - Bypassed */}
          <View style={styles.tableRow}>
            <Text style={[styles.td, { flex: 2, color: "rgba(218, 226, 253, 0.6)" }]}>Fast Cool</Text>
            <View style={[styles.td, { flex: 2, flexDirection: "row", alignItems: "center", gap: 6 }]}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: "65%", backgroundColor: colors.error }]} />
              </View>
              <Text style={styles.tdScoreTextMuted}>65%</Text>
            </View>
            <Text style={[styles.td, { flex: 1.5, color: colors.error }]}>Busy</Text>
            <Text style={[styles.td, { flex: 1.5, textAlign: "right", color: "rgba(218, 226, 253, 0.6)" }]}>₨ 1,800</Text>
          </View>
        </View>

      </View>

      {/* Action deploy block */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <PrimaryButton
          title="Execute Booking 🚀"
          onPress={handleConfirm}
          style={styles.confirmBtn}
        />
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  pulsingGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.success,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
    marginBottom: 20,
  },
  topProfileGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  profileCard: {
    flex: 1.2,
    backgroundColor: "rgba(23, 31, 51, 0.45)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  avatarHexagonWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: 12,
  },
  hexagonAvatar: {
    width: "100%",
    height: "100%",
  },
  operativeName: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
    textAlign: "center",
  },
  operativeId: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  verifiedBadge: {
    backgroundColor: "rgba(74, 225, 118, 0.08)",
    borderColor: "rgba(74, 225, 118, 0.2)",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 10,
  },
  verifiedText: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.success,
  },
  compatibilityCard: {
    flex: 1,
    backgroundColor: "rgba(23, 31, 51, 0.45)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  outerGlowRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "rgba(142, 213, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  innerGlowRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: colors.primary,
    borderTopColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(6, 14, 32, 0.6)",
  },
  compatibilityPercent: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
  },
  compatibilityPercentSign: {
    fontSize: 12,
    color: colors.textMuted,
  },
  compatibilityLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
    marginTop: 12,
    textAlign: "center",
  },
  synthesisCard: {
    backgroundColor: "rgba(23, 31, 51, 0.45)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  synthesisHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sparkIcon: {
    fontSize: 16,
  },
  synthesisTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
  },
  synthesisDesc: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 16,
  },
  synthesisGrid: {
    flexDirection: "row",
    gap: 8,
  },
  synthesisMetric: {
    flex: 1,
    backgroundColor: "rgba(6, 14, 32, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderLeftWidth: 3,
    borderRadius: 8,
    padding: 10,
  },
  metricLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  metricValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 4,
  },
  intelCard: {
    backgroundColor: "rgba(23, 31, 51, 0.45)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  intelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  intelIcon: {
    fontSize: 16,
  },
  intelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
  },
  table: {
    gap: 4,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    paddingBottom: 8,
    marginBottom: 4,
  },
  th: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
  },
  tableRowActive: {
    flexDirection: "row",
    backgroundColor: "rgba(142, 213, 255, 0.05)",
    borderColor: "rgba(142, 213, 255, 0.1)",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.03)",
  },
  td: {
    fontSize: 11,
  },
  tdActiveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  tdActiveText: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.primary,
  },
  progressTrack: {
    width: 50,
    height: 4,
    backgroundColor: "rgba(6, 14, 32, 0.8)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  tdScoreText: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.text,
  },
  tdScoreTextMuted: {
    fontSize: 11,
    color: "rgba(218, 226, 253, 0.6)",
  },
  confirmBtn: {
    marginTop: 10,
    marginBottom: 30,
  },
  loader: {
    marginVertical: 20,
  },
});
