import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
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
          <Text style={styles.badgeText}>RECOMMENDED_TARGET</Text>
        </View>
      )}
      
      <View style={styles.row}>
        <View style={styles.leftCol}>
          <Text style={styles.name}>{provider.name.toUpperCase()}</Text>
          <Text style={styles.service}>SECTOR // {provider.service_type.toUpperCase()}</Text>
        </View>
        
        <View style={[styles.scoreContainer, isRec && styles.recommendedScoreContainer]}>
          <Text style={styles.scoreLabel}>MATCH_VAL</Text>
          <Text style={[styles.scoreValue, isRec && styles.recommendedScore]}>
            {provider.trust_score}%
          </Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>DISTANCE</Text>
          <Text style={styles.detailVal}>{provider.distance_km} KM</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>RATING</Text>
          <Text style={styles.detailVal}>⭐ {provider.rating}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>AVAILABILITY</Text>
          <Text style={styles.detailVal}>{provider.available_slot.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.chargesRow}>
        <Text style={styles.chargesLabel}>ESTIMATED_LOGISTICS_COST</Text>
        <Text style={styles.chargesValue}>{provider.estimated_charges.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  recommendedCard: {
    borderColor: "rgba(74, 225, 118, 0.4)",
    borderWidth: 1,
    backgroundColor: "rgba(74, 225, 118, 0.03)",
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 1.5,
    backgroundColor: "rgba(142, 213, 255, 0.05)",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderBottomLeftRadius: 8,
  },
  badgeText: {
    color: "#003915",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
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
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
  },
  service: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  scoreContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderColor: colors.border,
    borderWidth: 1,
    padding: 6,
    borderRadius: 8,
    minWidth: 70,
  },
  recommendedScoreContainer: {
    borderColor: "rgba(74, 225, 118, 0.2)",
    backgroundColor: "rgba(74, 225, 118, 0.05)",
  },
  scoreLabel: {
    fontSize: 7,
    color: colors.textMuted,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
  },
  scoreValue: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.primary,
    marginTop: 1,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  recommendedScore: {
    color: colors.success,
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
    fontSize: 8,
    color: colors.textMuted,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  detailVal: {
    fontSize: 11,
    color: colors.text,
    marginTop: 2,
    fontWeight: "500",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  chargesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  chargesLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  chargesValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.success,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
});
