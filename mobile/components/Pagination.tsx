import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePrev}
        disabled={currentPage === 1}
        style={[styles.navButton, currentPage === 1 && styles.disabledButton]}
      >
        <Ionicons name="chevron-back" size={20} color="#1c5461" />
      </TouchableOpacity>

      <View style={styles.pageNumbers}>
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <Text key={`ellipsis-${index}`} style={styles.ellipsis}>
                ...
              </Text>
            );
          }
          return (
            <TouchableOpacity
              key={page}
              onPress={() => onPageChange(page as number)}
              style={[
                styles.pageButton,
                currentPage === page && styles.activePage,
              ]}
            >
              <Text
                style={[
                  styles.pageText,
                  currentPage === page && styles.activePageText,
                ]}
              >
                {page}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={handleNext}
        disabled={currentPage === totalPages}
        style={[styles.navButton, currentPage === totalPages && styles.disabledButton]}
      >
        <Ionicons name="chevron-forward" size={20} color="#1c5461" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 8,
  },
  navButton: {
    backgroundColor: "#e0f2f1",
    padding: 8,
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: "#f1f5f9",
  },
  pageNumbers: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pageButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#e0f2f1",
  },
  activePage: {
    backgroundColor: "#287674",
  },
  pageText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1c5461",
  },
  activePageText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  ellipsis: {
    paddingHorizontal: 6,
    fontSize: 16,
    color: "#64748b",
  },
});
