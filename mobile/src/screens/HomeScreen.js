import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from "react-native";
import colors from "../theme/colors";

export default function HomeScreen({ onNext }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleDemoPress = (text) => {
    setInput(text);
  };

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    // Simulate short network delay for telemetry visualization
    setTimeout(async () => {
      try {
        const { submitRequest } = require("../api/client");
        const data = await submitRequest(input);
        setLoading(false);
        onNext(data);
      } catch (err) {
        setLoading(false);
        // Fallback matching
        onNext({
          request_id: "REQ-" + Math.floor(Math.random() * 10000),
          original_message: input,
          workflow_plan: ["parse_intent", "resolve_location", "match_provider"],
          requires_clarification: false,
          extracted: {
            service_type: "ac technician",
            resolved_location: "G-13 Sector",
            time_text: "tomorrow morning",
            suggested_slot: "10:00 AM AST",
            urgency: "standard",
            language: "roman_urdu"
          }
        });
      }
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerIcon}>⚙️</Text>
            <Text style={styles.logo}>
              KaamKarao <Text style={styles.logoGreen}>AI</Text>
            </Text>
          </View>
          
          <View style={styles.profileContainer}>
            <View style={styles.avatarBorder}>
              <Image
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC12YJ73E-BnCCmGoOmQDIZURKlTe-npWuQMfpovkHRIowMcrWzP_e3KgggP7A_BTp_-2Kz8RUgRRkE0kDNyf31NqUvX6VekOSQUWLcKQuOh8SDPB_jOaFh-h5snGH8_tTltFoX2qraaprTfhc3e2iqrUrrotrBlo0m4IqctVMUbS3aXT6mCTXZjpD4v-Qk8s0SxyHN4LfiZp4z_v7wuBfZP0G-tLDruC2L7-9d8uI6aOhWD7HSH1H5FaWcbYK_f60JVqS-WsOld-Ma" }}
                style={styles.avatar}
              />
            </View>
            <View style={styles.statusDot} />
          </View>
        </View>

        {/* Hero Search Section */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>I am looking for:</Text>
          <Text style={styles.heroSubtitle}>apko kis kaam ke liye banda chaiye?</Text>
          
          <View style={[styles.searchContainer, isFocused && styles.searchFocused]}>
            <TextInput
              style={styles.input}
              placeholder="Explain your task..."
              placeholderTextColor="rgba(218, 226, 253, 0.4)"
              value={input}
              onChangeText={setInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {loading ? (
              <View style={styles.searchButton}>
                <ActivityIndicator size="small" color={colors.backgroundLowest} />
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSearch}
                disabled={!input.trim()}
                style={[styles.searchButton, !input.trim() && styles.searchButtonDisabled]}
              >
                <Text style={styles.searchButtonText}>⚡</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories / Suggestion Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          <TouchableOpacity
            style={styles.chip}
            activeOpacity={0.7}
            onPress={() => handleDemoPress("AC technician chahiye G-13 Islamabad")}
          >
            <Text style={styles.chipIcon}>🔧</Text>
            <Text style={styles.chipLabel}>PLUMBER</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chip}
            activeOpacity={0.7}
            onPress={() => handleDemoPress("Electrician required immediately F-10 socket sparks")}
          >
            <Text style={styles.chipIcon}>🔌</Text>
            <Text style={styles.chipLabel}>ELECTRICIAN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chip}
            activeOpacity={0.7}
            onPress={() => handleDemoPress("House cleaner required for full day tomorrow near DHA")}
          >
            <Text style={styles.chipIcon}>🧹</Text>
            <Text style={styles.chipLabel}>CLEANER</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chip}
            activeOpacity={0.7}
            onPress={() => handleDemoPress("Mason/painter needed in G-13 for house renovate")}
          >
            <Text style={styles.chipIcon}>🧱</Text>
            <Text style={styles.chipLabel}>MASON</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>People Near You</Text>
            <Text style={styles.sectionSubtitle}>Active providers in your radius</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={styles.mapButton}>
            <Text style={styles.mapButtonText}>MAP VIEW 📍</Text>
          </TouchableOpacity>
        </View>

        {/* Provider Cards */}
        <View style={styles.providersList}>
          {/* Arshad Ali */}
          <View style={styles.providerCard}>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn-KZqrTuqbNiqFKG2cLZu5_9ywdY4xS9-vGOBwUiaVZZzAtUTi22qVeaGpYkVkQiRgzSXB9Mfw7maYGKlO-3JAVL0dCbxE8l0QhzRRq8j4xVKbRTNaDgr2fOyxt2YakRtSofxA_8Gn3ZSmKGVjJFcCyIKeXr1eQ2n48j-XG-WknI9TDBCBSvxEP7AiZaMs16AWJgWOwuyiBarg2IF1d2yzvJTVCAG_VWvU4UzOIR-234GpoMetJtYG8P68IVVTfSYHHrxF8ydTFtW" }}
              style={styles.providerImage}
            />
            <View style={styles.providerDetails}>
              <View style={styles.providerHeader}>
                <Text style={styles.providerName}>Arshad Ali</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.starIcon}>⭐</Text>
                  <Text style={styles.ratingText}>4.9</Text>
                </View>
              </View>

              <View style={styles.providerMeta}>
                <Text style={styles.providerService}>Plumber</Text>
                <View style={styles.dot} />
                <Text style={styles.providerDistance}>1.2km</Text>
              </View>

              <View style={styles.badgeRow}>
                <Text style={styles.successBadge}>🛡️ PREMIUM PARTNER</Text>
              </View>
            </View>
          </View>

          {/* Kashif Volt */}
          <View style={styles.providerCard}>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn-KZqrTuqbNiqFKG2cLZu5_9ywdY4xS9-vGOBwUiaVZZzAtUTi22qVeaGpYkVkQiRgzSXB9Mfw7maYGKlO-3JAVL0dCbxE8l0QhzRRq8j4xVKbRTNaDgr2fOyxt2YakRtSofxA_8Gn3ZSmKGVjJFcCyIKeXr1eQ2n48j-XG-WknI9TDBCBSvxEP7AiZaMs16AWJgWOwuyiBarg2IF1d2yzvJTVCAG_VWvU4UzOIR-234GpoMetJtYG8P68IVVTfSYHHrxF8ydTFtW" }}
              style={styles.providerImage}
            />
            <View style={styles.providerDetails}>
              <View style={styles.providerHeader}>
                <Text style={styles.providerName}>Kashif Volt</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.starIcon}>⭐</Text>
                  <Text style={styles.ratingText}>4.7</Text>
                </View>
              </View>

              <View style={styles.providerMeta}>
                <Text style={styles.providerService}>Electrician</Text>
                <View style={styles.dot} />
                <Text style={styles.providerDistance}>0.8km</Text>
              </View>

              <View style={styles.badgeRow}>
                <Text style={styles.primaryBadge}>🛰️ VERIFIED PROVIDER</Text>
              </View>
            </View>
          </View>

          {/* Zainab Safai */}
          <View style={styles.providerCard}>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn-KZqrTuqbNiqFKG2cLZu5_9ywdY4xS9-vGOBwUiaVZZzAtUTi22qVeaGpYkVkQiRgzSXB9Mfw7maYGKlO-3JAVL0dCbxE8l0QhzRRq8j4xVKbRTNaDgr2fOyxt2YakRtSofxA_8Gn3ZSmKGVjJFcCyIKeXr1eQ2n48j-XG-WknI9TDBCBSvxEP7AiZaMs16AWJgWOwuyiBarg2IF1d2yzvJTVCAG_VWvU4UzOIR-234GpoMetJtYG8P68IVVTfSYHHrxF8ydTFtW" }}
              style={styles.providerImage}
            />
            <View style={styles.providerDetails}>
              <View style={styles.providerHeader}>
                <Text style={styles.providerName}>Zainab Safai</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.starIcon}>⭐</Text>
                  <Text style={styles.ratingText}>4.8</Text>
                </View>
              </View>

              <View style={styles.providerMeta}>
                <Text style={styles.providerService}>Cleaner</Text>
                <View style={styles.dot} />
                <Text style={styles.providerDistance}>2.5km</Text>
              </View>

              <View style={styles.badgeRow}>
                <Text style={styles.successBadge}>🛡️ TRUSTED PARTNER</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Sparkle Button */}
      <TouchableOpacity activeOpacity={0.85} style={styles.floatingButton}>
        <Text style={styles.floatingButtonText}>✨</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIcon: {
    fontSize: 22,
    color: colors.primary,
  },
  logo: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.primary,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
    letterSpacing: -0.5,
  },
  logoGreen: {
    color: colors.success,
  },
  profileContainer: {
    position: "relative",
  },
  avatarBorder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: "rgba(142, 213, 255, 0.4)",
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  statusDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.background,
  },
  heroCard: {
    backgroundColor: "rgba(45, 52, 73, 0.35)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
    marginBottom: 2,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 20,
    fontWeight: "400",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(6, 14, 32, 0.6)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 16,
    paddingRight: 6,
    height: 56,
  },
  searchFocused: {
    borderColor: colors.primary,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 10,
  },
  searchButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonDisabled: {
    backgroundColor: "rgba(142, 213, 255, 0.4)",
  },
  searchButtonText: {
    fontSize: 18,
    color: colors.backgroundLowest,
  },
  chipsContainer: {
    paddingVertical: 4,
    marginBottom: 24,
    gap: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(23, 31, 51, 0.8)",
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
  },
  chipIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  chipLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1.2,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    opacity: 0.7,
    marginTop: 2,
  },
  mapButton: {
    backgroundColor: "rgba(142, 213, 255, 0.08)",
    borderColor: "rgba(142, 213, 255, 0.2)",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  mapButtonText: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 1,
  },
  providersList: {
    gap: 12,
  },
  providerCard: {
    backgroundColor: "rgba(45, 52, 73, 0.3)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  providerImage: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  providerDetails: {
    flex: 1,
  },
  providerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Sora" : "sans-serif-medium",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(6, 14, 32, 0.5)",
    borderColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 2,
  },
  starIcon: {
    fontSize: 10,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.text,
  },
  providerMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  providerService: {
    fontSize: 12,
    color: colors.success,
    fontWeight: "500",
  },
  dot: {
    width: 3,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 1.5,
    marginHorizontal: 8,
  },
  providerDistance: {
    fontSize: 12,
    color: colors.textMuted,
  },
  badgeRow: {
    flexDirection: "row",
  },
  successBadge: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.success,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
  },
  primaryBadge: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.success,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  floatingButtonText: {
    fontSize: 22,
    color: "#003915",
  },
});
