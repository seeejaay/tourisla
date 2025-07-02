import React, { useState } from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";

interface Props {
  text: string;
  wordLimit?: number;
  style?: any;
}

export default function ExpandableText({ text, wordLimit = 30, style }: Props) {
  const [expanded, setExpanded] = useState(false);

  const words = text.trim().split(/\s+/);
  const shouldTruncate = words.length > wordLimit;
  const preview = words.slice(0, wordLimit).join(" ");

  return (
    <>
      <Text style={style}>
        {expanded || !shouldTruncate ? text : `${preview}...`}
      </Text>
      {shouldTruncate && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.toggleWrapper}>
            <Text style={styles.toggleText}>
              {expanded ? "Show less" : "Read more"}
            </Text>{" "}
            <Text style={styles.icon}>{expanded ? "▲" : "▼"}</Text>
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  toggleWrapper: {
    marginTop: 10,
    color: "#1c5461",
    fontWeight: "600",
  },
  toggleText: {
    textDecorationLine: "underline",
    color: "#1c5461",
    fontWeight: "600",
  },
  icon: {
    color: "#1c5461",
    fontWeight: "600",
    textDecorationLine: "none", // ensure no underline
  },
});
