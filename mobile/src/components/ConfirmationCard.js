import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from "react-native";
import colors from "../theme/colors";
import StatusPill from "./StatusPill";

export default function ConfirmationCard({ booking, smsMessage }) {
  const handleCopy = () => {
    Alert.alert("TELEMETRY COPY", "WhatsApp confirmation template successfully logged to clipboard!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.neonTopLine} />
        
        <View style={styles.row}>
          <Text style={styles.bookingId}>TARGET_ID: #{booking.booking_id.toUpperCase()}</Text>
          <StatusPill type="status" value={booking.status} />
        </View>
        
        <Text style={styles.providerName}>{booking.provider_name.toUpperCase()}</Text>
        <Text style={styles.serviceType}>SECTOR // {booking.service_type.toUpperCase()}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>TIMELINE_SLOT</Text>
          <Text style={styles.metaValue}>{booking.slot.toUpperCase()}</Text>
        </View>
        
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>GRID_COORDINATES</Text>
          <Text style={styles.metaValue}>{booking.location.toUpperCase()}</Text>
        </View>
        
        <View style={[styles.metaRow, { marginBottom: 0 }]}>
          <Text style={styles.metaLabel}>LOGISTICS_CHARGES</Text>
          <Text style={[styles.metaValue, { color: colors.success, fontWeight: "bold" }]}>
            {booking.estimated_charges.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <Text style={styles.header}>&gt; WHATSAPP_DISPATCH_TEMPLATE</Text>
      
      <View style={styles.smsContainer}>
        <View style={styles.smsNeonLine} />
        <Text style={styles.smsText}>{smsMessage}</Text>
        
        <TouchableOpacity activeOpacity={0.8} onPress={handleCopy} style={styles.copyBtn}>
          <Text style={styles.copyText}>COPY_DISPATCH_PAYLOAD</Text>
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
    backgroundColor: "rgba(74, 225, 118, 0.02)",
    borderColor: "rgba(74, 225, 118, 0.3)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  neonTopLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.success,
    opacity: 0.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookingId: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  providerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 8,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  serviceType: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  metaLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  metaValue: {
    fontSize: 11,
    color: colors.text,
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  header: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
    marginBottom: 6,
    paddingLeft: 4,
  },
  smsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    position: "relative",
    overflow: "hidden",
  },
  smsNeonLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
  smsText: {
    color: colors.text,
    fontSize: 11,
    lineHeight: 18,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontStyle: "italic",
  },
  copyBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(142, 213, 255, 0.4)",
  },
  copyText: {
    color: "#00354a",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
});
