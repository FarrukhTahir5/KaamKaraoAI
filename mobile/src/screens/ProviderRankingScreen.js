import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity, Image } from "react-native";
import colors from "../theme/colors";
import PrimaryButton from "../components/PrimaryButton";

export default function ProviderRankingScreen({ matchData, onNext }) {
  const [selectedId, setSelectedId] = useState(
    matchData.recommended_provider ? matchData.recommended_provider.id : "P-101"
  );

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleConfirm = () => {
    onNext(selectedId);
  };

  const hasProviders = matchData.providers && matchData.providers.length > 0;

  // Find currently selected provider details
  const activeProvider = hasProviders 
    ? matchData.providers.find(p => p.id === selectedId) || matchData.providers[0]
    : null;

  // Alt list (excluding the active one)
  const altProviders = hasProviders 
    ? matchData.providers.filter(p => p.id !== selectedId)
    : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      
      {/* Interactive Concentric Radar Dashboard */}
      <View style={styles.radarDashboard}>
        <View style={styles.radarGridBackground} />
        {/* Concentric rings */}
        <View style={[styles.radarCircle, { width: 80, height: 80 }]} />
        <View style={[styles.radarCircle, { width: 140, height: 140 }]} />
        <View style={[styles.radarCircle, { width: 200, height: 200 }]} />
        <View style={[styles.radarCircle, { width: 260, height: 260 }]} />
        
        {/* Blinking signal dots */}
        <View style={[styles.signalDot, styles.signalDotGreen, { top: "45%", left: "52%" }]} />
        <View style={[styles.signalDot, styles.signalDotBlue, { top: "30%", left: "40%" }]} />
        <View style={[styles.signalDot, styles.signalDotPurple, { top: "60%", left: "65%" }]} />
        
        <Text style={styles.radarScanningText}>🛰️ RADAR STREAM ACTIVE</Text>
      </View>

      {/* Status Banner */}
      <View style={styles.statusBanner}>
        <Text style={styles.statusTitle}>MISSION PROGRESS:</Text>
        <Text style={styles.statusValue}>MATCH [ACTIVE]</Text>
      </View>

      {hasProviders && activeProvider ? (
        <View style={styles.contentWrapper}>
          {/* Target Locked - Primary Highlight Card */}
          <View style={styles.lockedCard}>
            <View style={styles.cardHeaderTopLine} />
            <View style={styles.lockedCardHeader}>
              <View style={styles.lockedTextContainer}>
                <View style={styles.targetLockedBadge}>
                  <Text style={styles.targetLockedIcon}>📍</Text>
                  <Text style={styles.targetLockedText}>TARGET LOCKED</Text>
                </View>
                <Text style={styles.activeName}>{activeProvider.name}</Text>
                <Text style={styles.activeService}>{activeProvider.service_type || "AC Service"}</Text>
              </View>

              {/* 92% Glow Score Ring */}
              <View style={styles.matchScoreRing}>
                <View style={styles.matchScoreInner}>
                  <Text style={styles.matchScoreNumber}>
                    {activeProvider.trust_score || 92}
                    <Text style={styles.matchScorePercent}>%</Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* Bento details pods */}
            <View style={styles.detailPodsGrid}>
              <View style={styles.detailPod}>
                <Text style={styles.detailPodIcon}>📏</Text>
                <Text style={styles.detailPodValue}>{activeProvider.distance_km || "1.2"}km</Text>
              </View>
              
              <View style={styles.detailPod}>
                <Text style={styles.detailPodIcon}>⭐</Text>
                <Text style={styles.detailPodValue}>{activeProvider.rating || "4.9"}</Text>
              </View>

              <View style={styles.detailPod}>
                <Text style={styles.detailPodIcon}>💳</Text>
                <Text style={styles.detailPodValue}>{activeProvider.estimated_charges || "Rs. 1,500"}</Text>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.8} onPress={handleConfirm} style={styles.selectionLogicBtn}>
              <Text style={styles.selectionLogicBtnIcon}>⚙️</Text>
              <Text style={styles.selectionLogicBtnText}>VIEW SELECTION LOGIC</Text>
            </TouchableOpacity>
          </View>

          {/* Alternative Targets */}
          {altProviders.length > 0 && (
            <View style={styles.altSection}>
              <Text style={styles.altSectionTitle}>🔍 ALTERNATIVE TARGETS</Text>
              
              {altProviders.map((provider) => (
                <TouchableOpacity
                  key={provider.id}
                  activeOpacity={0.8}
                  onPress={() => handleSelect(provider.id)}
                  style={[
                    styles.altCard,
                    provider.id === selectedId && styles.altCardSelected
                  ]}
                >
                  <View style={styles.altDetails}>
                    <Text style={styles.altName}>{provider.name}</Text>
                    <View style={styles.altMetaRow}>
                      <Text style={styles.altMetaText}>📍 {provider.distance_km}km</Text>
                      <Text style={styles.altMetaText}>⭐ {provider.rating}</Text>
                    </View>
                  </View>

                  {/* Match percentage pill */}
                  <View style={styles.altScorePill}>
                    <Text style={styles.altScoreText}>{provider.trust_score || 85}%</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Locked Core Confirm CTA */}
          <PrimaryButton
            title="Lock Protocol & Proceed"
            onPress={handleConfirm}
            style={styles.confirmBtn}
          />
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <View style={styles.neonTopLineWarning} />
          <Text style={styles.emptyHeader}>⚠️ ZERO MATCH PROTOCOL TRIGGERED</Text>
          <Text style={styles.emptyText}>
            {matchData.message || "Unable to match automatic providers with current intent vector."}
          </Text>
          
          {matchData.alternate_option && (
            <View style={styles.alternateBox}>
              <Text style={styles.altLabel}>PROPOSED ALTERNATE PROVIDER</Text>
              <Text style={styles.altVal}>{matchData.alternate_option.provider.toUpperCase()}</Text>
              
              <Text style={styles.altLabel}>AVAILABLE LOGISTIC SLOT</Text>
              <Text style={styles.altVal}>{matchData.alternate_option.slot.toUpperCase()}</Text>
              
              <Text style={styles.altLabel}>AI SYSTEM RATIONALE</Text>
              <Text style={styles.altReason}>"{matchData.alternate_option.reason}"</Text>
            </View>
          )}

          <PrimaryButton
            title="Accept Alternate Protocol"
            onPress={handleConfirm}
            style={styles.confirmBtn}
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
    paddingTop: 16,
    paddingBottom: 60,
  },
  radarDashboard: {
    height: 180,
    backgroundColor: "rgba(6, 14, 32, 0.5)",
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderRadius: 20,
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  radarGridBackground: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.1,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  radarCircle: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(142, 213, 255, 0.08)",
  },
  signalDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  signalDotGreen: {
    backgroundColor: colors.success,
    shadowColor: colors.success,
  },
  signalDotBlue: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
  },
  signalDotPurple: {
    backgroundColor: colors.warning,
    shadowColor: colors.warning,
  },
  radarScanningText: {
    position: "absolute",
    bottom: 12,
    fontSize: 9,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 1.5,
    opacity: 0.7,
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(23, 31, 51, 0.6)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 8,
  },
  statusTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  statusValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.success,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  contentWrapper: {
    gap: 20,
  },
  lockedCard: {
    backgroundColor: "rgba(23, 31, 51, 0.5)",
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    position: "relative",
    overflow: "hidden",
  },
  cardHeaderTopLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.success,
  },
  lockedCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  lockedTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  targetLockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  targetLockedIcon: {
    fontSize: 12,
  },
  targetLockedText: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.success,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 1,
  },
  activeName: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
  },
  activeService: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  matchScoreRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.success,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  matchScoreInner: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
    backgroundColor: "rgba(23, 31, 51, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  matchScoreNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
  },
  matchScorePercent: {
    fontSize: 10,
    color: colors.textMuted,
  },
  detailPodsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  detailPod: {
    flex: 1,
    backgroundColor: "rgba(6, 14, 32, 0.45)",
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  detailPodIcon: {
    fontSize: 14,
  },
  detailPodValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  selectionLogicBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74, 225, 118, 0.08)",
    borderColor: colors.success,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  selectionLogicBtnIcon: {
    fontSize: 14,
    color: colors.success,
  },
  selectionLogicBtnText: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.success,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 1.2,
  },
  altSection: {
    gap: 10,
  },
  altSectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.8,
  },
  altCard: {
    backgroundColor: "rgba(23, 31, 51, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  altCardSelected: {
    borderColor: colors.primary,
    backgroundColor: "rgba(142, 213, 255, 0.08)",
  },
  altDetails: {
    flex: 1,
  },
  altName: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
  },
  altMetaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  altMetaText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  altScorePill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(6, 14, 32, 0.8)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  altScoreText: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  confirmBtn: {
    marginTop: 10,
    marginBottom: 20,
  },
  emptyCard: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    position: "relative",
    overflow: "hidden",
  },
  neonTopLineWarning: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.warning,
  },
  emptyHeader: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.warning,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  alternateBox: {
    backgroundColor: "rgba(6, 14, 32, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  altLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
    marginTop: 8,
  },
  altVal: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 2,
  },
  altReason: {
    fontSize: 11,
    color: colors.text,
    fontStyle: "italic",
    marginTop: 6,
    lineHeight: 16,
  },
});
