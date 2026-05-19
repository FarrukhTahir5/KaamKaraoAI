import React from "react";
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity } from "react-native";
import colors from "../theme/colors";
import PrimaryButton from "../components/PrimaryButton";

export default function FollowUpScreen({ bookingData, onNext }) {
  const providerName = bookingData?.booking?.provider?.name || "Ali AC Services";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      
      {/* Header section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mission Log</Text>
        <Text style={styles.headerSubtitle}>Real-time trace of AI deployment execution.</Text>
      </View>

      {/* Active Mission Tracker Card */}
      <View style={styles.trackerCard}>
        <View style={styles.glowActiveLine} />
        
        <View style={styles.trackerLeft}>
          <View style={styles.radarIconWrapper}>
            <Text style={styles.radarIcon}>📡</Text>
          </View>
          <View style={styles.trackerInfo}>
            <Text style={styles.activeLabel}>ACTIVE MISSION</Text>
            <Text style={styles.missionName}>Operation Alpha-Prime</Text>
            <Text style={styles.providerText}>Provider: {providerName}</Text>
          </View>
        </View>

        <View style={styles.etaBox}>
          <Text style={styles.etaLabel}>TIME TO ARRIVAL</Text>
          <Text style={styles.etaValue}>00:28:45</Text>
        </View>
      </View>

      {/* Vertical Timeline container */}
      <View style={styles.timelineContainer}>
        
        {/* Continuous background track line */}
        <View style={styles.timelineLineTrack}>
          <View style={styles.timelineLineProgress} />
        </View>

        {/* Step 1: Done */}
        <View style={styles.stepRow}>
          <View style={styles.bulletWrapper}>
            <View style={styles.bulletDone}>
              <View style={styles.bulletInnerDone} />
            </View>
          </View>
          <View style={[styles.stepCard, styles.stepCardDone]}>
            <View style={styles.stepHeaderRow}>
              <Text style={styles.stepTitleDone}>Deployment Reminder</Text>
              <Text style={styles.stepTime}>09:00 AM</Text>
            </View>
            <Text style={styles.stepDesc}>Automated ping sent to provider via secure channel.</Text>
          </View>
        </View>

        {/* Step 2: Active / Current */}
        <View style={styles.stepRow}>
          <View style={styles.bulletWrapper}>
            <View style={styles.bulletPulseContainer}>
              <View style={styles.bulletPulse} />
              <View style={styles.bulletActive}>
                <View style={styles.bulletInnerActive} />
              </View>
            </View>
          </View>
          <View style={[styles.stepCard, styles.stepCardActive]}>
            <View style={styles.activeBorderLeft} />
            <View style={styles.stepHeaderRow}>
              <Text style={styles.stepTitleActive}>Provider Signal Check</Text>
              <Text style={styles.stepTimeActive}>09:30 AM</Text>
            </View>
            <Text style={styles.stepDescActive}>Handshake initiated. Verifying telemetry data streams and latency.</Text>
            
            {/* Nested Mini Terminal Output */}
            <View style={styles.miniTerminal}>
              <Text style={styles.termLine}>&gt; PING syncsys.node.192 ... OK</Text>
              <Text style={styles.termLine}>&gt; LATENCY: 14ms (OPTIMAL)</Text>
              <Text style={[styles.termLine, { color: colors.success }]}>&gt; STATUS: CONNECTED_</Text>
            </View>
          </View>
        </View>

        {/* Step 3: Pending */}
        <View style={styles.stepRow}>
          <View style={styles.bulletWrapper}>
            <View style={styles.bulletPending} />
          </View>
          <View style={[styles.stepCard, styles.stepCardPending]}>
            <View style={styles.stepHeaderRow}>
              <Text style={styles.stepTitlePending}>Arrival</Text>
              <Text style={styles.stepTime}>10:00 AM</Text>
            </View>
            <Text style={styles.stepDesc}>Agent physical/virtual presence confirmed at target coordinates.</Text>
          </View>
        </View>

        {/* Step 4: Pending */}
        <View style={styles.stepRow}>
          <View style={styles.bulletWrapper}>
            <View style={styles.bulletPending} />
          </View>
          <View style={[styles.stepCard, styles.stepCardPending]}>
            <View style={styles.stepHeaderRow}>
              <Text style={styles.stepTitlePending}>Mission Debrief</Text>
              <Text style={styles.stepTime}>12:00 PM</Text>
            </View>
            <Text style={styles.stepDesc}>Post-mission log generation and telemetry archiving.</Text>
          </View>
        </View>

      </View>

      {/* CTA Button */}
      <PrimaryButton
        title="VIEW FULL AGENT TRACE ➡️"
        onPress={onNext}
        style={styles.ctaButton}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  trackerCard: {
    backgroundColor: "rgba(23, 31, 51, 0.6)",
    borderColor: "rgba(142, 213, 255, 0.4)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: "column",
    gap: 16,
    position: "relative",
    overflow: "hidden",
    marginBottom: 28,
  },
  glowActiveLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
  },
  trackerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radarIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderColor: "rgba(142, 213, 255, 0.3)",
    borderWidth: 1,
    backgroundColor: "rgba(142, 213, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  radarIcon: {
    fontSize: 18,
  },
  trackerInfo: {
    flex: 1,
  },
  activeLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 1,
    marginBottom: 2,
  },
  missionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  providerText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  etaBox: {
    backgroundColor: "rgba(6, 14, 32, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  etaLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  etaValue: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.success,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 1.5,
  },
  timelineContainer: {
    position: "relative",
    paddingLeft: 24,
    marginBottom: 32,
  },
  timelineLineTrack: {
    position: "absolute",
    left: 8,
    top: 12,
    bottom: 12,
    width: 2,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  timelineLineProgress: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 2,
    height: "45%",
    backgroundColor: colors.success,
  },
  stepRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  bulletWrapper: {
    width: 18,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 12,
  },
  bulletDone: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderColor: colors.success,
    borderWidth: 2,
    backgroundColor: "rgba(6, 14, 32, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
  bulletInnerDone: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  bulletPulseContainer: {
    position: "relative",
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  bulletPulse: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(74, 225, 118, 0.15)",
  },
  bulletActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderColor: colors.success,
    borderWidth: 2,
    backgroundColor: "rgba(6, 14, 32, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
  bulletInnerActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  bulletPending: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
    backgroundColor: "rgba(6, 14, 32, 1)",
  },
  stepCard: {
    flex: 1,
    backgroundColor: "rgba(23, 31, 51, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  stepCardDone: {
    opacity: 0.65,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  stepCardActive: {
    borderColor: "rgba(74, 225, 118, 0.25)",
    position: "relative",
    overflow: "hidden",
  },
  activeBorderLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.success,
  },
  stepCardPending: {
    opacity: 0.4,
  },
  stepHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  stepTitleDone: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.text,
  },
  stepTitleActive: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.success,
  },
  stepTitlePending: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.textMuted,
  },
  stepTime: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  stepTimeActive: {
    fontSize: 9,
    color: colors.success,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  stepDesc: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
  },
  stepDescActive: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  miniTerminal: {
    marginTop: 10,
    backgroundColor: "rgba(6, 14, 32, 0.8)",
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
  },
  termLine: {
    fontSize: 10,
    color: "rgba(142, 213, 255, 0.75)",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    lineHeight: 14,
  },
  ctaButton: {
    marginTop: 8,
    marginBottom: 32,
  },
});
