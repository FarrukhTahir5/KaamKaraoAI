import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import colors from "../theme/colors";
import PrimaryButton from "../components/PrimaryButton";
import { bookProvider } from "../api/client";

export default function RecommendationScreen({ matchData, selectedId, requestId, onNext }) {
  const [loading, setLoading] = useState(false);

  const recommendation = matchData.recommended_provider || {
    name: "Ali AC Services",
    trust_score: 92,
    reason: "Selected provider matches your requirement.",
    why_not_others: []
  };

  const handleConfirm = async () => {
    setLoading(true);
    const bookingRes = await bookProvider(requestId, selectedId || recommendation.id);
    setLoading(false);
    onNext(bookingRes);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>🧠 AI Recommendation</Text>
      <Text style={styles.subtitle}>
        Decision Agent details the ranking rationale and contrast comparisons.
      </Text>

      <View style={styles.card}>
        <View style={styles.scoreRow}>
          <View style={styles.recContainer}>
            <Text style={styles.recLabel}>AI SELECTION</Text>
            <Text style={styles.recVal}>{recommendation.name}</Text>
          </View>

          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>TRUST SCORE</Text>
            <Text style={styles.scoreVal}>{recommendation.trust_score}</Text>
          </View>
        </View>

        <Text style={styles.reasonHeader}>Why this provider?</Text>
        <Text style={styles.reasonText}>{recommendation.reason}</Text>
      </View>

      <Text style={styles.contrastHeader}>Why not other options?</Text>

      {recommendation.why_not_others && recommendation.why_not_others.map((contrast, idx) => (
        <View key={idx} style={styles.contrastCard}>
          <Text style={styles.contrastProv}>{contrast.provider}</Text>
          <Text style={styles.contrastReason}>{contrast.reason}</Text>
        </View>
      ))}

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <PrimaryButton
          title="Confirm Simulation Booking"
          onPress={handleConfirm}
          style={styles.btn}
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
    backgroundColor: "rgba(22, 163, 74, 0.06)",
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#151c27",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recContainer: {
    flex: 1,
    marginRight: 10,
  },
  recLabel: {
    fontSize: 8,
    color: colors.primary,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  recVal: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 2,
  },
  scoreBox: {
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 12,
    minWidth: 80,
  },
  scoreLabel: {
    fontSize: 8,
    color: colors.textMuted,
    fontWeight: "bold",
  },
  scoreVal: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.primary,
    marginTop: 2,
  },
  reasonHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 18,
    marginBottom: 6,
  },
  reasonText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  contrastHeader: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
    marginTop: 10,
  },
  contrastCard: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginVertical: 5,
  },
  contrastProv: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.text,
  },
  contrastReason: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
  btn: {
    marginTop: 20,
    marginBottom: 40,
  },
  loader: {
    marginVertical: 20,
  },
});
