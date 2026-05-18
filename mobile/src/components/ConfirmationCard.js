import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from "react-native";
import colors from "../theme/colors";
import StatusPill from "./StatusPill";

export default function ConfirmationCard({ booking, smsMessage }) {
  const handleCopy = () => {
    // Basic platform-safe copy simulation
    Alert.alert("Success", "WhatsApp confirmation message copied to clipboard!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.bookingId}>ID: {booking.booking_id}</Text>
          <StatusPill type="status" value={booking.status} />
        </View>
        
        <Text style={styles.providerName}>{booking.provider_name}</Text>
        <Text style={styles.serviceType}>{booking.service_type}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Scheduled For:</Text>
          <Text style={styles.metaValue}>{booking.slot}</Text>
        </View>
        
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Location Address:</Text>
          <Text style={styles.metaValue}>{booking.location}</Text>
        </View>
        
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Estimated Charges:</Text>
          <Text style={[styles.metaValue, { color: colors.primary, fontWeight: "bold" }]}>
            {booking.estimated_charges}
          </Text>
        </View>
      </View>
      
      <Text style={styles.header}>WhatsApp-Style Message</Text>
      
      <View style={styles.smsContainer}>
        <Text style={styles.smsText}>{smsMessage}</Text>
        
        <TouchableOpacity activeOpacity={0.8} onPress={handleCopy} style={styles.copyBtn}>
          <Text style={styles.copyText}>Copy Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  card: {
    backgroundColor: "#112620", // Deep emerald tint
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookingId: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  providerName: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 8,
  },
  serviceType: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  metaLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  metaValue: {
    fontSize: 12,
    color: colors.text,
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  header: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  smsContainer: {
    backgroundColor: "#075E54", // WhatsApp Teal
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  smsText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: Platform.OS === "ios" ? "CourierNewPSMT" : "monospace",
  },
  copyBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 14,
  },
  copyText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "bold",
  },
});
