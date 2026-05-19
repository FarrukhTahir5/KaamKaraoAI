import React, { useState } from "react";
import { StyleSheet, View, SafeAreaView, StatusBar, Text, TouchableOpacity, Platform } from "react-native";
import colors from "./src/theme/colors";

// Import Screens
import HomeScreen from "./src/screens/HomeScreen";
import UnderstandingScreen from "./src/screens/UnderstandingScreen";
import ProviderRankingScreen from "./src/screens/ProviderRankingScreen";
import RecommendationScreen from "./src/screens/RecommendationScreen";
import BookingConfirmationScreen from "./src/screens/BookingConfirmationScreen";
import FollowUpScreen from "./src/screens/FollowUpScreen";
import AgentTraceScreen from "./src/screens/AgentTraceScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [requestId, setRequestId] = useState("");
  const [requestData, setRequestData] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [bookingData, setBookingData] = useState(null);

  const handleRestart = () => {
    setRequestId("");
    setRequestData(null);
    setMatchData(null);
    setSelectedId("");
    setBookingData(null);
    setCurrentScreen("home");
  };

  const handleBack = () => {
    if (currentScreen === "understanding") setCurrentScreen("home");
    else if (currentScreen === "ranking") setCurrentScreen("understanding");
    else if (currentScreen === "recommendation") setCurrentScreen("ranking");
    else if (currentScreen === "confirmation") setCurrentScreen("recommendation");
    else if (currentScreen === "follow_up") setCurrentScreen("confirmation");
    else if (currentScreen === "trace") setCurrentScreen("confirmation");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen
            onNext={(data) => {
              setRequestData(data);
              setRequestId(data.request_id);
              setCurrentScreen("understanding");
            }}
          />
        );
      case "understanding":
        return (
          <UnderstandingScreen
            requestData={requestData}
            onRestart={handleRestart}
            onNext={(mDetails, reqId) => {
              setMatchData(mDetails);
              setRequestId(reqId);
              setCurrentScreen("ranking");
            }}
          />
        );
      case "ranking":
        return (
          <ProviderRankingScreen
            matchData={matchData}
            onNext={(provId) => {
              setSelectedId(provId);
              setCurrentScreen("recommendation");
            }}
          />
        );
      case "recommendation":
        return (
          <RecommendationScreen
            matchData={matchData}
            selectedId={selectedId}
            requestId={requestId}
            onNext={(bookDetails) => {
              setBookingData(bookDetails);
              setCurrentScreen("confirmation");
            }}
          />
        );
      case "confirmation":
        return (
          <BookingConfirmationScreen
            bookingData={bookingData}
            onRestart={handleRestart}
            onNext={(target) => setCurrentScreen(target)}
          />
        );
      case "follow_up":
        return (
          <FollowUpScreen
            bookingData={bookingData}
            onNext={() => setCurrentScreen("trace")}
          />
        );
      case "trace":
        return (
          <AgentTraceScreen
            requestId={requestId}
            onRestart={handleRestart}
          />
        );
      default:
        return <HomeScreen onNext={() => setCurrentScreen("understanding")} />;
    }
  };

  const showBackButton = currentScreen !== "home" && currentScreen !== "confirmation";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.backgroundLowest} />
      
      {/* Dynamic Futuristic Navigation Header */}
      <View style={styles.headerBar}>
        {showBackButton ? (
          <TouchableOpacity activeOpacity={0.7} onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backText}>← SYSTEM.BACK</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerTelemetryLeft}>
            <Text style={styles.telemetryIcon}>🛰️</Text>
            <Text style={styles.telemetryStatusGreen}>ONLINE</Text>
          </View>
        )}
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>
            {currentScreen === "home" ? "KAAMKARAO.AI" : `MISSION_${currentScreen.toUpperCase()}`}
          </Text>
        </View>
        
        {currentScreen !== "home" ? (
          <TouchableOpacity activeOpacity={0.7} onPress={handleRestart} style={styles.resetBtn}>
            <Text style={styles.resetText}>TERMINATE</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerTelemetryRight}>
            <Text style={styles.telemetryTime}>UTC +5:00</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>{renderScreen()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerBar: {
    height: 64,
    backgroundColor: colors.backgroundLowest,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  backText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.5,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 1.5,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    textShadowColor: "rgba(142, 213, 255, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  resetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 180, 171, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 180, 171, 0.2)",
  },
  resetText: {
    color: colors.error,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
  },
  headerTelemetryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: 80,
  },
  telemetryIcon: {
    fontSize: 12,
  },
  telemetryStatusGreen: {
    fontSize: 9,
    color: colors.success,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    letterSpacing: 0.5,
  },
  headerTelemetryRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    width: 80,
  },
  telemetryTime: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  content: {
    flex: 1,
  },
});
