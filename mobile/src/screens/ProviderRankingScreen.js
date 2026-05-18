import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import colors from "../theme/colors";
import PrimaryButton from "../components/PrimaryButton";
import ProviderCard from "../components/ProviderCard";

export default function ProviderRankingScreen({ matchData, onNext }) {
  const [selectedId, setSelectedId] = useState(
    matchData.recommended_provider ? matchData.recommended_provider.id : ""
  );

  const handleNext = () => {
    // Navigate to next step
    onNext(selectedId);
  };

  const hasProviders = matchData.providers && matchData.providers.length > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>🏆 Provider Match & Rank</Text>
      <Text style={styles.subtitle}>
        AI Agent scanned baseline registry, checked slot overlaps, and formulated Trust Scores.
      </Text>

      {hasProviders ? (
        <View>
          <Text style={styles.sectionHeader}>MATCHING CANDIDATES (RANKED)</Text>
          {matchData.providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              selected={provider.id === selectedId}
              onSelect={() => setSelectedId(provider.id)}
            />
          ))}

          <PrimaryButton
            title="View AI Decision Reasoning"
            onPress={handleNext}
            style={styles.btn}
          />
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyHeader}>⚠️ Alternative Option Proposed</Text>
          <Text style={styles.emptyText}>{matchData.message}</Text>
          
          {matchData.alternate_option && (
            <View style={styles.alternateBox}>
              <Text style={styles.altLabel}>ALTERNATIVE PROVIDER</Text>
              <Text style={styles.altVal}>{matchData.alternate_option.provider}</Text>
              <Text style={styles.altLabel}>AVAILABLE SLOT</Text>
              <Text style={styles.altVal}>{matchData.alternate_option.slot}</Text>
              <Text style={styles.altReason}>{matchData.alternate_option.reason}</Text>
            </View>
          )}

          <PrimaryButton
            title="Select Alternative Provider"
            onPress={onNext}
            style={styles.btn}
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
  sectionHeader: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  btn: {
    marginTop: 16,
    marginBottom: 30,
  },
  emptyCard: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  emptyHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.warning,
  },
  emptyText: {
    color: colors.text,
    textAlign: "center",
    marginVertical: 12,
    lineHeight: 18,
  },
  alternateBox: {
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    marginVertical: 14,
    borderColor: colors.border,
    borderWidth: 0.5,
  },
  altLabel: {
    fontSize: 8,
    color: colors.textMuted,
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginTop: 6,
  },
  altVal: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "bold",
    marginTop: 2,
  },
  altReason: {
    fontSize: 11,
    color: colors.primary,
    fontStyle: "italic",
    marginTop: 10,
  },
});
