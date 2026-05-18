import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, ScrollView, ActivityIndicator } from "react-native";
import colors from "../theme/colors";
import PrimaryButton from "../components/PrimaryButton";
import StatusPill from "../components/StatusPill";
import { submitRequest, matchProviders } from "../api/client";

export default function UnderstandingScreen({ requestData, onNext, onRestart }) {
  const [clarifyLocation, setClarifyLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(requestData);

  const handleClarify = async () => {
    if (!clarifyLocation.trim()) return;
    setLoading(true);
    // Combine original with location and submit
    const combinedMsg = `${currentRequest.original_message} in ${clarifyLocation}`;
    const data = await submitRequest(combinedMsg);
    setCurrentRequest(data);
    setLoading(false);
  };

  const handleNextStep = async () => {
    setLoading(true);
    const matchData = await matchProviders(currentRequest.request_id);
    setLoading(false);
    onNext(matchData, currentRequest.request_id);
  };

  const isClarification = currentRequest.requires_clarification;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>🤖 AI Extraction Agent</Text>
      <Text style={styles.subtitle}>
        Understand user intent, resolve coordinates and plan execution steps.
      </Text>

      {isClarification ? (
        <View style={styles.card}>
          <Text style={styles.cardHeader}>📍 Clarification Required</Text>
          <Text style={styles.clarifyMsg}>{currentRequest.message}</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Type your area (e.g. G-13, F-10, DHA)"
            placeholderTextColor={colors.textMuted}
            value={clarifyLocation}
            onChangeText={setClarifyLocation}
          />

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : (
            <PrimaryButton
              title="Submit Area"
              onPress={handleClarify}
              disabled={!clarifyLocation.trim()}
            />
          )}

          <PrimaryButton
            title="Start Over"
            onPress={onRestart}
            style={styles.cancelBtn}
            textStyle={{ color: colors.textMuted }}
          />
        </View>
      ) : (
        <View>
          <View style={styles.planCard}>
            <Text style={styles.planHeader}>📋 Execution Steps Plan</Text>
            {currentRequest.workflow_plan.map((step, idx) => (
              <Text key={step} style={styles.stepText}>
                {idx + 1}. {step.replace("_", " ").toUpperCase()}
              </Text>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeader}>Understood Request Details</Text>
            
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>SERVICE TYPE</Text>
              <Text style={styles.metaVal}>{currentRequest.extracted.service_type || "Undetected"}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>RESOLVED LOCATION</Text>
              <Text style={styles.metaVal}>{currentRequest.extracted.resolved_location}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>PREFERRED TIME</Text>
              <Text style={styles.metaVal}>{currentRequest.extracted.time_text} ({currentRequest.extracted.suggested_slot})</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>URGENCY LEVEL</Text>
              <StatusPill type="urgency" value={currentRequest.extracted.urgency} />
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>LANGUAGE DETECTED</Text>
              <Text style={styles.metaVal}>{currentRequest.extracted.language}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>PROBLEM / ISSUE</Text>
              <Text style={styles.metaVal}>{currentRequest.extracted.issue}</Text>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : (
            <PrimaryButton
              title="Find Best Matching Provider"
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
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 18,
    borderColor: colors.border,
    borderWidth: 1,
    marginVertical: 10,
    shadowColor: "#151c27",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 14,
  },
  planCard: {
    backgroundColor: "rgba(22, 163, 74, 0.06)",
    borderColor: "rgba(22, 163, 74, 0.15)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    shadowColor: "#151c27",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  planHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  stepText: {
    color: colors.text,
    fontSize: 12,
    marginVertical: 3,
    fontWeight: "500",
  },
  clarifyMsg: {
    color: colors.warning,
    fontSize: 14,
    marginBottom: 14,
    lineHeight: 18,
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    color: colors.text,
    fontSize: 15,
    marginBottom: 16,
  },
  loader: {
    marginVertical: 14,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  metaVal: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "500",
  },
  cancelBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
});

