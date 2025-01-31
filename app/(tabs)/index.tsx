import { StyleSheet, Animated, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState, useRef } from "react";

export default function HomeScreen() {
  const [followMode, setFollowMode] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<string | null>(null);

  // Create animated values for each button
  const upAnimation = useRef(new Animated.Value(1)).current;
  const leftAnimation = useRef(new Animated.Value(1)).current;
  const rightAnimation = useRef(new Animated.Value(1)).current;
  const downAnimation = useRef(new Animated.Value(1)).current;

  const animatePress = (animation: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const createPressableButton = (
    direction: string,
    animation: Animated.Value
  ) => (
    <Animated.View style={{ transform: [{ scale: animation }] }}>
      <Pressable
        onPressIn={() => {
          if (!followMode) {
            animatePress(animation);
            setCurrentDirection(
              direction === "up"
                ? "Forward"
                : direction === "down"
                ? "Backward"
                : direction === "left"
                ? "Turning Left"
                : "Turning Right"
            );
          }
        }}
        onPressOut={() => setCurrentDirection(null)}
        style={({ pressed }) => [
          styles.button,
          pressed && !followMode && styles.buttonPressed,
          followMode && styles.buttonDisabled,
        ]}
        disabled={followMode}
      >
        <ThemedText
          style={[styles.buttonText, followMode && styles.buttonTextDisabled]}
        >
          {direction === "up"
            ? "▲"
            : direction === "down"
            ? "▼"
            : direction === "left"
            ? "◄"
            : "►"}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Fairway Finder Remote
      </ThemedText>

      <ThemedView style={styles.gamepadContainer}>
        {/* Connection lines */}
        <ThemedView
          style={[styles.connectionLine, styles.verticalLine, styles.topLine]}
        />
        <ThemedView
          style={[
            styles.connectionLine,
            styles.verticalLine,
            styles.bottomLine,
          ]}
        />
        <ThemedView
          style={[
            styles.connectionLine,
            styles.horizontalLine,
            styles.leftLine,
          ]}
        />
        <ThemedView
          style={[
            styles.connectionLine,
            styles.horizontalLine,
            styles.rightLine,
          ]}
        />

        {/* Center hub */}
        <ThemedView style={styles.centerHub} />

        {followMode && (
          <ThemedView style={styles.disabledOverlay}>
            <ThemedText style={styles.disabledText}>
              Manual control is disabled{"\n"}while follow mode is on
            </ThemedText>
          </ThemedView>
        )}

        <ThemedView style={styles.topRow}>
          {createPressableButton("up", upAnimation)}
        </ThemedView>

        <ThemedView style={styles.middleRow}>
          {createPressableButton("left", leftAnimation)}
          {createPressableButton("right", rightAnimation)}
        </ThemedView>

        <ThemedView style={styles.bottomRow}>
          {createPressableButton("down", downAnimation)}
        </ThemedView>
      </ThemedView>

      {/* Direction indicator */}
      <ThemedView style={styles.directionIndicator}>
        <ThemedText style={styles.directionText}>
          {currentDirection || "Stopped"}
        </ThemedText>
      </ThemedView>

      <Pressable
        style={({ pressed }) => [
          styles.followButton,
          followMode && styles.followButtonActive,
          pressed && styles.followButtonPressed,
        ]}
        onPress={() => setFollowMode(!followMode)}
      >
        <ThemedText style={styles.followButtonText}>
          {followMode ? "Turn off follow mode" : "Turn on follow mode"}
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    marginTop: 40,
    marginBottom: 80,
    fontSize: 32,
    fontWeight: "600",
  },
  gamepadContainer: {
    width: 360,
    height: 360,
    position: "relative",
    alignItems: "center",
  },
  topRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    height: "33.33%",
  },
  middleRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    height: "33.33%",
    gap: 180,
  },
  bottomRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    height: "33.33%",
  },
  centerHub: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1565C0",
    transform: [{ translateX: -35 }, { translateY: -35 }],
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  connectionLine: {
    position: "absolute",
    backgroundColor: "#1565C0",
    zIndex: -1,
  },
  verticalLine: {
    width: 14,
    height: "33.33%",
    left: "50%",
    marginLeft: -7,
  },
  horizontalLine: {
    height: 14,
    width: "40%",
    top: "50%",
    marginTop: -7,
  },
  topLine: {
    top: 0,
  },
  bottomLine: {
    bottom: 0,
  },
  leftLine: {
    left: 0,
  },
  rightLine: {
    right: 0,
  },
  button: {
    width: 110,
    height: 110,
    backgroundColor: "#2196F3",
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderBottomWidth: 4,
    borderBottomColor: "rgba(0,0,0,0.2)",
    borderTopColor: "#64B5F6",
    borderLeftColor: "#64B5F6",
    borderRightColor: "#1976D2",
  },
  buttonPressed: {
    backgroundColor: "#1976D2",
    borderBottomWidth: 2,
    transform: [{ translateY: 2 }],
  },
  buttonText: {
    fontSize: 40,
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  followButton: {
    position: "absolute",
    bottom: 40,
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderBottomWidth: 4,
    borderBottomColor: "rgba(0,0,0,0.2)",
  },
  followButtonActive: {
    backgroundColor: "#f44336",
  },
  followButtonPressed: {
    transform: [{ scale: 0.95 }],
    backgroundColor: "#388E3C",
  },
  followButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: "#B0BEC5",
    borderTopColor: "#CFD8DC",
    borderLeftColor: "#CFD8DC",
    borderRightColor: "#90A4AE",
    borderBottomColor: "#90A4AE",
    elevation: 4,
    shadowOpacity: 0.2,
  },
  buttonTextDisabled: {
    color: "rgba(255,255,255,0.6)",
    textShadowRadius: 0,
  },
  disabledOverlay: {
    position: "absolute",
    top: -40,
    left: -40,
    right: -40,
    bottom: -40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  disabledText: {
    fontSize: 20,
    color: "#455A64",
    textAlign: "center",
    padding: 24,
    fontWeight: "600",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    minWidth: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  directionIndicator: {
    position: "absolute",
    bottom: 120, // Position above the follow mode button
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  directionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
