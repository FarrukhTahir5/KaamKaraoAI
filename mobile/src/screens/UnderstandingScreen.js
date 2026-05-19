import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TextInput, ScrollView, ActivityIndicator, Animated, Platform, TouchableOpacity } from "react-native";
import colors from "../theme/colors";
import PrimaryButton from "../components/PrimaryButton";
import { submitRequest, matchProviders } from "../api/client";

export default function UnderstandingScreen({ requestData, onNext, onRestart }) {
  const [clarifyLocation, setClarifyLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(requestData);
  const [isFocused, setIsFocused] = useState(false);

  // Scanning anim value
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scanAnim]);

  const handleClarify = async () => {
    if (!clarifyLocation.trim()) return;
    setLoading(true);
    const combinedMsg = `${currentRequest.original_message} in ${clarifyLocation}`;
    try {
      const data = await submitRequest(combinedMsg);
      setCurrentRequest(data);
    } catch (err) {
      // Offline fallback
      setCurrentRequest({
        ...currentRequest,
        requires_clarification: false,
        extracted: {
          ...currentRequest.extracted,
          resolved_location: clarifyLocation
        }
      });
    }
    setLoading(false);
  };

  const handleNextStep = async () => {
    setLoading(true);
    try {
      const matchData = await matchProviders(currentRequest.request_id);
      setLoading(false);
      onNext(matchData, currentRequest.request_id);
    } catch (err) {
      setLoading(false);
      // Offline fallback match data
      onNext({
        request_id: currentRequest.request_id,
        recommended_provider: {
          id: "P-101",
          name: "Ali AC Services",
          service_type: "AC Repair",
          distance_km: 1.2,
          rating: 4.9,
          available_slot: "08:00 AM",
          estimated_charges: "Rs. 1,500"
        },
        providers: [
          {
            id: "P-101",
            name: "Ali AC Services",
            service_type: "AC Repair",
            distance_km: 1.2,
            rating: 4.9,
            available_slot: "08:00 AM",
            estimated_charges: "Rs. 1,500",
            is_recommended: true,
            trust_score: 92
          },
          {
            id: "P-102",
            name: "Umar Cooling",
            service_type: "AC Maintenance",
            distance_km: 2.1,
            rating: 4.8,
            available_slot: "02:00 PM",
            estimated_charges: "Rs. 1,200",
            is_recommended: false,
            trust_score: 87
          },
          {
            id: "P-103",
            name: "Fast Repair",
            service_type: "AC General",
            distance_km: 4.8,
            rating: 4.6,
            available_slot: "Busy",
            estimated_charges: "Rs. 1,800",
            is_recommended: false,
            trust_score: 81
          }
        ]
      }, currentRequest.request_id);
    }
  };

  const isClarification = currentRequest.requires_clarification;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      
      {/* breadcrumb navigation */}
      <View style={styles.breadcrumbRow}>
        <View style={styles.breadcrumbStep}>
          <Text style={styles.checkIcon}>✅</Text>
          <Text style={styles.breadcrumbTextDone}>REQUEST</Text>
        </View>
        <View style={styles.breadcrumbDivider} />
        <View style={styles.breadcrumbStep}>
          <Text style={styles.pulseIcon}>🔄</Text>
          <Text style={styles.breadcrumbTextActive}>UNDERSTANDING</Text>
        </View>
        <View style={styles.breadcrumbDivider} />
        <View style={styles.breadcrumbStep}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.breadcrumbTextPending}>MATCH</Text>
        </View>
      </View>

      {/* Cyber Sweep Scan Area */}
      <View style={styles.scannerWrapper}>
        <Animated.View
          style={[
            styles.scannerBeam,
            {
              transform: [
                {
                  translateY: scanAnim.interpolate({
                    inputRange: [0, 1],
                    inputRange: [0, 1],
                    outputRange: [0, 150], // height of scanning wrapper
                  }),
                },
              ],
            },
          ]}
        />
        
        <View style={styles.pulseRing}>
          <Text style={styles.signalIcon}>🎙️</Text>
        </View>

        <Text style={styles.scanningTitle}>Analyzing Request...</Text>
        <Text style={styles.scanningDesc}>
          Deconstructing intent, mapping coordinates, and verifying temporal constraints to execute a precision match.
        </Text>
      </View>

      {isClarification ? (
        <View style={styles.clarifyCard}>
          <View style={styles.neonTopLineError} />
          <Text style={styles.clarifyTitle}>⚠️ TELEMETRY RESOLUTION ERROR</Text>
          <Text style={styles.clarifyMsg}>{currentRequest.message || "Location coordinates are missing from the command input."}</Text>
          
          <TextInput
            style={[
              styles.input,
              isFocused && styles.inputFocused
            ]}
            placeholder="Type your area (e.g. G-13, F-10, DHA)"
            placeholderTextColor="rgba(218, 226, 253, 0.4)"
            value={clarifyLocation}
            onChangeText={setClarifyLocation}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : (
            <PrimaryButton
              title="Lock Coordinates & Retry"
              onPress={handleClarify}
              disabled={!clarifyLocation.trim()}
            />
          )}

          <TouchableOpacity activeOpacity={0.7} onPress={onRestart} style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>TERMINATE AND RESTART</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.bentoSection}>
          <Text style={styles.bentoTitle}>PARSED ENTITY BENTO</Text>
          
          <View style={styles.bentoRow}>
            {/* Service Pod */}
            <View style={[styles.bentoCard, { width: "100%" }]}>
              <View style={styles.bentoHeaderRow}>
                <View style={styles.iconWrapper}>
                  <Text style={styles.vectorIcon}>❄️</Text>
                </View>
                <View>
                  <Text style={styles.bentoMeta}>IDENTIFIED VECTOR</Text>
                  <Text style={styles.bentoHeaderVal}>
                    {currentRequest.extracted.service_type ? currentRequest.extracted.service_type.toUpperCase() : "AC TECH"}
                  </Text>
                </View>
              </View>
              <View style={styles.terminalPanel}>
                <Text style={styles.terminalText}>
                  &gt;_ SYSTEM.EXTRACT(DOMAIN="HVAC", REPAIR_TYPE="COOLING_UNIT")
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.bentoRow}>
            {/* Intent Status */}
            <View style={[styles.bentoCard, { width: "100%" }]}>
              <Text style={styles.bentoMeta}>MISSION STATUS</Text>
              <View style={styles.intentLockedRow}>
                <View style={styles.pulsingGreenDot} />
                <Text style={styles.intentLockedText}>Intent Locked</Text>
              </View>
              <View style={styles.confidenceRow}>
                <Text style={styles.confidenceLabel}>Confidence Score</Text>
                <Text style={styles.confidenceValue}>98.4%</Text>
              </View>
            </View>
          </View>

          <View style={styles.bentoGrid}>
            {/* Coordinates */}
            <View style={styles.bentoGridCard}>
              <Text style={styles.bentoMeta}>COORDINATES</Text>
              <Text style={styles.coordinateMain}>
                {currentRequest.extracted.resolved_location || "G-13 Sector"}
              </Text>
              <Text style={styles.coordinateSub}>Islamabad, Capital Territory</Text>
            </View>

            {/* Time Window */}
            <View style={styles.bentoGridCard}>
              <Text style={styles.bentoMeta}>TEMPORAL FRAME</Text>
              <Text style={styles.coordinateMain}>
                {currentRequest.extracted.time_text ? currentRequest.extracted.time_text.toUpperCase() : "TOMORROW"}
              </Text>
              <Text style={styles.coordinateSub}>10:00 AM AST</Text>
            </View>
          </View>

          {/* Complexity Slider */}
          <View style={styles.bentoCard}>
            <Text style={styles.bentoMeta}>JOB COMPLEXITY</Text>
            <View style={styles.complexityInfo}>
              <Text style={styles.complexityValText}>Level 2</Text>
              <Text style={styles.complexityLabelText}>/ Standard</Text>
            </View>
            <View style={styles.sliderTrack}>
              <View style={styles.sliderFill} />
            </View>
          </View>

          {/* Raw Command transcript */}
          <View style={styles.transcriptCard}>
            <Text style={styles.transcriptLabel}>&gt;_ RAW_COMMAND_TRANSCRIPT</Text>
            <Text style={styles.transcriptVal}>"{currentRequest.original_message}"</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : (
            <PrimaryButton
              title="Activate Matching Protocol 🛰️"
              onPress={handleNextStep}
            />
          )}
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
    paddingBottom: 40,
  },
  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 6,
  },
  breadcrumbStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  checkIcon: {
    fontSize: 12,
  },
  pulseIcon: {
    fontSize: 12,
  },
  lockIcon: {
    fontSize: 12,
  },
  breadcrumbTextDone: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.textMuted,
    opacity: 0.6,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
  },
  breadcrumbTextActive: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
  },
  breadcrumbTextPending: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.textMuted,
    opacity: 0.3,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
  },
  breadcrumbDivider: {
    width: 14,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  scannerWrapper: {
    backgroundColor: "rgba(23, 31, 51, 0.45)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    minHeight: 230,
    marginBottom: 20,
  },
  scannerBeam: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
    opacity: 0.7,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  pulseRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "rgba(6, 14, 32, 0.6)",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  signalIcon: {
    fontSize: 26,
  },
  scanningTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
    marginBottom: 8,
    textAlign: "center",
  },
  scanningDesc: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  bentoSection: {
    gap: 12,
  },
  bentoTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  bentoRow: {
    flexDirection: "row",
    gap: 12,
  },
  bentoCard: {
    backgroundColor: "rgba(23, 31, 51, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  bentoHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(142, 213, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(142, 213, 255, 0.2)",
    borderWidth: 1,
  },
  vectorIcon: {
    fontSize: 18,
  },
  bentoMeta: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.8,
  },
  bentoHeaderVal: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
  },
  terminalPanel: {
    backgroundColor: "rgba(6, 14, 32, 0.6)",
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  terminalText: {
    fontSize: 10,
    color: colors.primary,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  intentLockedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(74, 225, 118, 0.08)",
    borderColor: "rgba(74, 225, 118, 0.25)",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  pulsingGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  intentLockedText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.success,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  confidenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    marginTop: 16,
    paddingTop: 12,
  },
  confidenceLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "500",
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  bentoGrid: {
    flexDirection: "row",
    gap: 12,
  },
  bentoGridCard: {
    flex: 1,
    backgroundColor: "rgba(23, 31, 51, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  coordinateMain: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
    marginTop: 6,
    marginBottom: 2,
  },
  coordinateSub: {
    fontSize: 10,
    color: colors.textMuted,
    opacity: 0.8,
  },
  complexityInfo: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    marginTop: 6,
  },
  complexityValText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  complexityLabelText: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: "rgba(6, 14, 32, 0.8)",
    borderRadius: 3,
    marginTop: 12,
    overflow: "hidden",
  },
  sliderFill: {
    width: "40%",
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  transcriptCard: {
    backgroundColor: "rgba(6, 14, 32, 0.6)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    marginBottom: 16,
  },
  transcriptLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  transcriptVal: {
    fontSize: 12,
    color: colors.text,
    fontStyle: "italic",
    lineHeight: 18,
  },
  clarifyCard: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    position: "relative",
    overflow: "hidden",
  },
  neonTopLineError: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.error,
  },
  clarifyTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.error,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  clarifyMsg: {
    color: colors.warning,
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
    fontStyle: "italic",
  },
  input: {
    backgroundColor: colors.backgroundLowest,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    color: colors.text,
    fontSize: 14,
    marginBottom: 16,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  loader: {
    marginVertical: 14,
  },
  cancelBtn: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderRadius: 12,
  },
  cancelBtnText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
});
