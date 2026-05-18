import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import colors from "../theme/colors";
import PrimaryButton from "../components/PrimaryButton";
import { submitRequest } from "../api/client";

export default function HomeScreen({ onNext }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDemoPress = (text) => {
    setInput(text);
  };

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const data = await submitRequest(input);
    setLoading(false);
    onNext(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.logo}>KaamKarao AI</Text>
          <Text style={styles.tagline}>Bas kaam batao, AI banda dhoond dega.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>What service do you need today?</Text>
          <Text style={styles.cardSub}>Describe your service request in English, Roman Urdu, or Urdu.</Text>
          
          <TextInput
            style={styles.input}
            placeholder="e.g., Mujhe kal subah G-13 mein AC technician chahiye"
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            numberOfLines={3}
          />

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : (
            <PrimaryButton
              title="Find Service Provider"
              onPress={handleSearch}
              disabled={!input.trim()}
            />
          )}
        </View>

        <Text style={styles.sectionHeader}>💡 Quick Hackathon Demo Scenarios</Text>
        
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleDemoPress("Mujhe kal subah G-13 mein AC technician chahiye")}
          style={styles.demoCard}
        >
          <Text style={styles.demoTitle}>AC Technician Demo (Main)</Text>
          <Text style={styles.demoText}>"Mujhe kal subah G-13 mein AC technician chahiye"</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleDemoPress("Aaj electrician chahiye socket spark kar raha hai G-13 mein")}
          style={styles.demoCard}
        >
          <Text style={[styles.demoTitle, { color: colors.urgencyHigh }]}>Emergency Electrician Demo</Text>
          <Text style={styles.demoText}>"Aaj electrician chahiye socket spark kar raha hai G-13 mein"</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleDemoPress("Grade 9 maths tutor chahiye near F-10")}
          style={styles.demoCard}
        >
          <Text style={styles.demoTitle}>Grade 9 Math Tutor Demo</Text>
          <Text style={styles.demoText}>"Grade 9 maths tutor chahiye near F-10"</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleDemoPress("Mujhe plumber chahiye")}
          style={styles.demoCard}
        >
          <Text style={styles.demoTitle}>Edge Case (Clarification Required)</Text>
          <Text style={styles.demoText}>"Mujhe plumber chahiye" (Missing Location)</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 6,
    textAlign: "center",
    fontWeight: "500",
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    borderColor: colors.border,
    borderWidth: 1,
    marginBottom: 24,
    shadowColor: "#151c27",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  cardSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    color: colors.text,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  loader: {
    marginVertical: 14,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
    marginTop: 10,
  },
  demoCard: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    shadowColor: "#151c27",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.primary,
  },
  demoText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    fontStyle: "italic",
  },
});

