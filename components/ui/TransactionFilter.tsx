import React from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export type TransactionFilterType =
  | "All"
  | "Incomes"
  | "Needs"
  | "Wants"
  | "Savings"
  | "Transfers";

interface TransactionFilterProps {
  selected: TransactionFilterType;
  onSelect: (filter: TransactionFilterType) => void;
}

const FILTERS: TransactionFilterType[] = [
  "All",
  "Incomes",
  "Needs",
  "Wants",
  "Savings",
  "Transfers",
];

export default function TransactionFilter({
  selected,
  onSelect,
}: TransactionFilterProps) {
  const backgroundColor = useThemeColor({}, "highlight");
  const textColor = useThemeColor({}, "textPrimary");

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTERS.map((filter) => {
          const isSelected = selected === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                isSelected && styles.filterButtonSelected,
                isSelected && { backgroundColor: textColor },
              ]}
              onPress={() => onSelect(filter)}
            >
              <ThemedText
                style={[
                  styles.filterText,
                  isSelected && { color: backgroundColor },
                ]}
                type={isSelected ? "defaultSemiBold" : "default"}
              >
                {filter}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "gray",
  },
  filterButtonSelected: {
    borderWidth: 0,
  },
  filterText: {
    fontSize: 14,
  },
});
