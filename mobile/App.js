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
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Dynamic Navigation Header */}
      <View style={styles.headerBar}>
        {showBackButton ? (
          <TouchableOpacity activeOpacity={0.7} onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyHeader} />
        )}
        
        <Text style={styles.headerTitle}>
          {currentScreen.replace("_", " ").toUpperCase()}
        </Text>
        
        {currentScreen !== "home" ? (
          <TouchableOpacity activeOpacity={0.7} onPress={handleRestart} style={styles.resetBtn}>
            <Text style={styles.resetText}>Restart</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyHeader} />
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
    height: 56,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  backText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 1,
  },
  resetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
  },
  resetText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyHeader: {
    width: 60,
  },
  content: {
    flex: 1,
  },
});
