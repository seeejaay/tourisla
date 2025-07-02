// components/FilterSection.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface Props {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const FILTER_CATEGORIES = [
  'EVENTS', 'FIESTA', 'CULTURAL_TOURISM', 'ENVIRONMENTAL_COASTAL',
  'HOLIDAY_SEASONAL', 'GOVERNMENT_PUBLIC_SERVICE', 'STORM_SURGE', 'TSUNAMI',
  'GALE_WARNING', 'MONSOON_LOW_PRESSURE', 'RED_TIDE', 'JELLYFISH_BLOOM', 'FISH_KILL',
  'PROTECTED_WILDLIFE', 'OIL_SPILL', 'COASTAL_EROSION', 'CORAL_BLEACHING',
  'HEAT_WAVE', 'FLOOD_LANDSLIDE', 'DENGUE_WATERBORNE', 'POWER_INTERRUPTION',
];

export const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    EVENTS: "#4f46e5",
    FIESTA: "#f59e0b",
    CULTURAL_TOURISM: "#10b981",
    ENVIRONMENTAL_COASTAL: "#059669",
    HOLIDAY_SEASONAL: "#f97316",
    GOVERNMENT_PUBLIC_SERVICE: "#6366f1",
    STORM_SURGE: "#dc2626",
    TSUNAMI: "#b91c1c",
    GALE_WARNING: "#ef4444",
    MONSOON_LOW_PRESSURE: "#7c3aed",
    RED_TIDE: "#c026d3",
    JELLYFISH_BLOOM: "#8b5cf6",
    FISH_KILL: "#ec4899",
    PROTECTED_WILDLIFE: "#14b8a6",
    OIL_SPILL: "#4b5563",
    COASTAL_EROSION: "#78716c",
    CORAL_BLEACHING: "#f43f5e",
    HEAT_WAVE: "#f97316",
    FLOOD_LANDSLIDE: "#0ea5e9",
    DENGUE_WATERBORNE: "#84cc16",
    POWER_INTERRUPTION: "#64748b",
  };

  return colors[category] || "#6b7280";
};

export default function FilterSection({
  selectedCategory,
  setSelectedCategory,
  showFilters,
  setShowFilters,
}: Props) {
  return (
    <View style={{ borderRadius: 0, marginBottom: 12 }}>
      {/* Filter Toggle */}
      <View style={styles.filterToggleRow}>
        <Pressable style={styles.filterToggleButton} onPress={() => setShowFilters(!showFilters)}>
          <Icon name={showFilters ? "chevron-up" : "chevron-down"} size={16} color="#475569" style={{ marginRight: 4 }} />
          <Text style={styles.filterToggleText}>{showFilters ? "Hide Filters" : "Show Filters"}</Text>
          {selectedCategory && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>1</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Filter Section */}
      {showFilters && (
        <View style={styles.filtersSection}>
          <View style={styles.filterContainer}>
            {FILTER_CATEGORIES.map((category) => (
              <Pressable
                key={category}
                style={[styles.filterTag, selectedCategory === category && styles.filterTagSelected]}
                onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                <Text style={[styles.filterTagText, selectedCategory === category && styles.filterTagTextSelected]}>
                  {category.replace(/_/g, ' ')}
                </Text>
                {selectedCategory === category && (
                  <Icon name="x" size={12} color="#fff" style={styles.filterTagIcon} />
                )}
              </Pressable>
            ))}
          </View>

          {/* Clear Button */}
          {selectedCategory && (
            <Pressable style={styles.clearFiltersButton} onPress={() => setSelectedCategory(null)}>
              <Text style={styles.clearFiltersText}>Clear Filter</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  filterToggleRow: {
    marginVertical: 12,
  },
  filterToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    alignSelf: 'flex-start',
    position: 'relative',
  },
  filterToggleText: {
    color: '#224d57',
    fontSize: 14,
    fontWeight: '700',
  },
  filterBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  filtersSection: {
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  filterTag: {
    backgroundColor: '#d1d5db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  filterTagSelected: {
    backgroundColor: '#b6a59e',
  },
  filterTagText: {
    fontSize: 10,
    color: '#374151',
  },
  filterTagTextSelected: {
    color: '#fff',
  },
  filterTagIcon: {
    marginLeft: 4,
  },
  clearFiltersButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearFiltersText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
