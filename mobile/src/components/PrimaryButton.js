import React from "react";
import { StyleSheet, Text, TouchableOpacity, Platform } from "react-native";
import colors from "../theme/colors";

export default function PrimaryButton({ title, onPress, disabled, style, textStyle }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        disabled && styles.disabledButton,
        style
      ]}
    >
      <Text style={[
        styles.text, 
        disabled && styles.disabledText,
        textStyle
      ]}>
        {title.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
    width: "100%",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(142, 213, 255, 0.4)",
  },
  disabledButton: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    color: "#00354a", // Deep contrast slate blue
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1.5,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  disabledText: {
    color: "rgba(255, 255, 255, 0.2)",
  },
});
