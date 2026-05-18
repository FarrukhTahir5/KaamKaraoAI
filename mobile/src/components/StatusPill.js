import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../theme/colors";

export default function StatusPill({ type, value }) {
  let backgroundColor = colors.tint;
  let textColor = colors.primary;

  const val = value ? value.toLowerCase() : "";

  if (type === "urgency") {
    if (val === "high") {
      backgroundColor = "rgba(239, 68, 68, 0.2)";
      textColor = colors.urgencyHigh;
    } else if (val === "normal") {
      backgroundColor = "rgba(59, 130, 246, 0.2)";
      textColor = colors.urgencyNormal;
    } else {
      backgroundColor = "rgba(16, 185, 129, 0.2)";
      textColor = colors.urgencyLow;
    }
  } else if (type === "status") {
    if (val === "confirmed" || val === "success") {
      backgroundColor = "rgba(16, 185, 129, 0.2)";
      textColor = colors.success;
    } else if (val === "pending" || val === "warning") {
      backgroundColor = "rgba(245, 158, 11, 0.2)";
      textColor = colors.warning;
    } else {
      backgroundColor = "rgba(239, 68, 68, 0.2)";
      textColor = colors.error;
    }
  }

  return (
    <View style={[styles.pill, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>
        {value ? value.toUpperCase() : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
