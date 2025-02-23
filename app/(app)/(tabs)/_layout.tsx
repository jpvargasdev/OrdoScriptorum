import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { BlurView } from "expo-blur";

export default function TabLayout() {
	const tintColor = useThemeColor({}, "textPrimary");

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: tintColor as string,
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarStyle: {
					position: "absolute",
				},
				tabBarBackground: () => (
					<BlurView
						tint="regular"
						intensity={80}
						style={{
							...StyleSheet.absoluteFillObject,
							overflow: "hidden",
							backgroundColor: "transparent",
						}}
					/>
				),
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Dashboard",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="house.fill" color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name="transactions"
				options={{
					title: "Transactions",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="arrow.2.circlepath" color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name="accounts"
				options={{
					title: "Accounts",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="banknote" color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="gear" color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
