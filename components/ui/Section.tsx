import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "./IconSymbol";
import { useState } from "react";

export default function Section({ text, children }: { text: string, children?: React.ReactNode }) {
  const titleColor = useThemeColor({}, 'textSecondary')
  const backgroundColor = useThemeColor({}, 'border')
  const [isOpen, setIsOpen] = useState(true);
  return (
    <View>
      <ThemedView lightColor={backgroundColor} darkColor={backgroundColor} style={styles.section}> 
        <TouchableOpacity style={styles.headerContainer} onPress={() => setIsOpen(!isOpen)}>
          <ThemedText type="defaultSemiBold" lightColor={titleColor} darkColor={titleColor}>{text}</ThemedText>
          <IconSymbol name="chevron.down" size={16} color={titleColor as string} />
        </TouchableOpacity>
      </ThemedView>
      {isOpen && children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
		borderTopWidth: StyleSheet.hairlineWidth,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
		paddingVertical: 12,
  }
})