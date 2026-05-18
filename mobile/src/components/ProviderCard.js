import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import colors from "../theme/colors";

export default function ProviderCard({ provider, onSelect, selected }) {
  const isRec = provider.is_recommended;
  
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onSelect}
      style={[
        styles.card,
        isRec && styles.recommendedCard,
        selected && styles.selectedCard
      ]}
    >
      {isRec && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>AI RECOMMENDED</Text>
        </View>
      )}
      
      <View style={styles.row}>
        <View style={styles.leftCol}>
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.service}>{provider.service_type}</Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>TRUST SCORE</Text>
          <Text style={[styles.scoreValue, isRec && styles.recommendedScore]}>
            {provider.trust_score}
          </Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>DISTANCE</Text>
          <Text style={styles.detailVal}>{provider.distance_km} km away</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>RATING</Text>
          <Text style={styles.detailVal}>⭐ {provider.rating}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>SLOT</Text>
          <Text style={styles.detailVal}>{provider.available_slot}</Text>
        </View>
      </View>
      
      <View style={styles.chargesRow}>
        <Text style={styles.chargesLabel}>Estimated Charges:</Text>
        <Text style={styles.chargesValue}>{provider.estimated_charges}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
    overflow: "hidden",
  },
  recommendedCard: {
    borderColor: colors.primary,
    borderWidth: 1.5,
    backgroundColor: "#112620",
  },
  selectedCard: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftCol: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  service: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 8,
    borderRadius: 12,
    minWidth: 80,
  },
  scoreLabel: {
    fontSize: 8,
    color: colors.textMuted,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.accent,
    marginTop: 2,
  },
  recommendedScore: {
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: "bold",
  },
  detailVal: {
    fontSize: 13,
    color: colors.text,
    marginTop: 2,
    fontWeight: "500",
  },
  chargesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "rgba(0,0,0,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  chargesLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  chargesValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.primary,
  },
});
