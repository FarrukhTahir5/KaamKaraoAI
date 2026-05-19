import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import colors from "../theme/colors";

export default function StatusPill({ type, value }) {
  let backgroundColor = colors.tint;
  let textColor = colors.primary;
  let borderColor = "rgba(142, 213, 255, 0.2)";

  const val = value ? value.toLowerCase() : "";

  if (type === "urgency") {
    if (val === "high") {
      backgroundColor = "rgba(255, 180, 171, 0.1)";
      textColor = colors.urgencyHigh;
      borderColor = "rgba(255, 180, 171, 0.3)";
    } else if (val === "normal") {
      backgroundColor = "rgba(142, 213, 255, 0.1)";
      textColor = colors.urgencyNormal;
      borderColor = "rgba(142, 213, 255, 0.3)";
    } else {
      backgroundColor = "rgba(74, 225, 118, 0.1)";
      textColor = colors.urgencyLow;
      borderColor = "rgba(74, 225, 118, 0.3)";
    }
  } else if (type === "status") {
    if (val === "confirmed" || val === "success") {
      backgroundColor = "rgba(74, 225, 118, 0.1)";
      textColor = colors.success;
      borderColor = "rgba(74, 225, 118, 0.3)";
    } else if (val === "pending" || val === "warning") {
      backgroundColor = "rgba(255, 180, 171, 0.1)";
      textColor = colors.warning;
      borderColor = "rgba(255, 180, 171, 0.3)";
    } else {
      backgroundColor = "rgba(255, 180, 171, 0.1)";
      textColor = colors.error;
      borderColor = "rgba(255, 180, 171, 0.3)";
    }
  }

  return (
    <View style={[styles.pill, { backgroundColor, borderColor }]}>
      <Text style={[styles.text, { color: textColor }]}>
        {value ? value.toUpperCase() : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
});
