import { View, StyleSheet } from "react-native";

export default function Overlay() {
  return (
    <>
      {/* top overlay */}
      <View style={styles.topOverlay} />
      {/* left overlay */}
      <View style={styles.leftOverlay} />
      {/* right overlay */}
      <View style={styles.rightOverlay} />
      {/* bottom overlay */}
      <View style={styles.bottomOverlay} />
    </>
  );
}
const boxSize = 250;
const styles = StyleSheet.create({
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "35%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
  leftOverlay: {
    position: "absolute",
    top: "35%",
    left: 0,
    width: "16%",
    height: "30%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
  rightOverlay: {
    position: "absolute",
    top: "35%",
    right: 0,
    width: "16%",
    height: "30%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "35%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
});
