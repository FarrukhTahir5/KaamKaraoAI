import React from "react";
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity } from "react-native";
import colors from "../theme/colors";
import PrimaryButton from "../components/PrimaryButton";

export default function BookingConfirmationScreen({ bookingData, onNext, onRestart }) {
  const { booking, confirmation_message } = bookingData || {
    booking: {
      booking_id: "KK-1024",
      service_type: "AC Logistics",
      provider: { name: "Ali AC Services" }
    },
    confirmation_message: "Mission initialized. I have dispatched your request to Ali AC Services."
  };

  const bookingId = booking?.booking_id || "KK-1024";
  const serviceName = booking?.service_type || "AC Logistics";
  const providerName = booking?.provider?.name || "Ali AC Services";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      
      {/* Immersive Success Header */}
      <View style={styles.successHeader}>
        <View style={styles.glowingRingOuter}>
          <View style={styles.glowingRingInner}>
            <Text style={styles.checkMarkIcon}>✅</Text>
          </View>
        </View>
        <Text style={styles.successTitle}>Mission Deployed</Text>
        <Text style={styles.successSubtitle}>
          Your request has been successfully transmitted to the agent network.
        </Text>
      </View>

      {/* Grid Container */}
      <View style={styles.gridContainer}>
        
        {/* Receipt/Log Card */}
        <View style={styles.receiptCard}>
          <View style={styles.greenTopLine} />
          
          <View style={styles.receiptHeaderRow}>
            <Text style={styles.receiptIcon}>📋</Text>
            <h2 style={styles.receiptTitle}>Mission Log</h2>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>MISSION ID</Text>
            <Text style={styles.receiptValue}>{bookingId}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>SERVICE</Text>
            <Text style={styles.receiptValue}>{serviceName}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>PROVIDER</Text>
            <Text style={styles.receiptValue}>{providerName}</Text>
          </View>

          <View style={styles.receiptFooter}>
            <Text style={styles.statusLabel}>STATUS: DEPLOYED</Text>
            <View style={styles.dotsIndicator}>
              <View style={[styles.indicatorDot, { backgroundColor: colors.success }]} />
              <View style={[styles.indicatorDot, { backgroundColor: colors.success, opacity: 0.5 }]} />
              <View style={[styles.indicatorDot, { backgroundColor: colors.success, opacity: 0.2 }]} />
            </View>
          </View>
        </View>

        {/* Secure AI Comm Card */}
        <View style={styles.commCard}>
          <View style={styles.commHeader}>
            <View style={styles.robotAvatar}>
              <Text style={styles.robotIcon}>🤖</Text>
            </View>
            <View>
              <Text style={styles.agentTitle}>System AI Agent</Text>
              <Text style={styles.agentSub}>Secure Comm Channel</Text>
            </View>
          </View>

          <View style={styles.chatBubble}>
            <Text style={styles.chatMessage}>
              {confirmation_message || "Mission initialized. I have dispatched your request to Ali AC Services. Standby for agent telemetry and live tracing."}
            </Text>
            <Text style={styles.chatTimestamp}>JUST NOW</Text>
          </View>
        </View>

      </View>

      {/* Navigation CTA Area */}
      <View style={styles.actionsContainer}>
        <PrimaryButton
          title="Track Mission Progress 🗺️"
          onPress={() => onNext("follow_up")}
          style={styles.actionBtn}
        />
        
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onNext("trace")}
          style={styles.traceButton}
        >
          <Text style={styles.traceButtonText}>Examine Agent Trace 💻</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onRestart}
          style={styles.restartButton}
        >
          <Text style={styles.restartButtonText}>Launch New Objective 🔄</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 60,
  },
  successHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  glowingRingOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(74, 225, 118, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  glowingRingInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(23, 31, 51, 0.9)",
    borderColor: "rgba(74, 225, 118, 0.4)",
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  checkMarkIcon: {
    fontSize: 32,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  gridContainer: {
    gap: 16,
    marginBottom: 32,
  },
  receiptCard: {
    backgroundColor: "rgba(23, 31, 51, 0.6)",
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    position: "relative",
    overflow: "hidden",
  },
  greenTopLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.success,
  },
  receiptHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  receiptIcon: {
    fontSize: 16,
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 12,
  },
  receiptLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
  },
  receiptValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  receiptFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.success,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  dotsIndicator: {
    flexDirection: "row",
    gap: 4,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  commCard: {
    backgroundColor: "rgba(23, 31, 51, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  commHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  robotAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(142, 213, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(142, 213, 255, 0.3)",
  },
  robotIcon: {
    fontSize: 18,
  },
  agentTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.primary,
  },
  agentSub: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  chatBubble: {
    backgroundColor: "rgba(6, 14, 32, 0.6)",
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    padding: 16,
    position: "relative",
  },
  chatMessage: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 6,
  },
  chatTimestamp: {
    fontSize: 8,
    color: colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    alignSelf: "flex-end",
  },
  actionsContainer: {
    gap: 12,
  },
  actionBtn: {
    marginVertical: 4,
  },
  traceButton: {
    backgroundColor: "rgba(142, 213, 255, 0.08)",
    borderColor: "rgba(142, 213, 255, 0.3)",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  traceButtonText: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  restartButton: {
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  restartButtonText: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
});
