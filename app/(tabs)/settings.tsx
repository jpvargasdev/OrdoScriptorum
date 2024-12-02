import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = ({ onDeleteAllData }: { onDeleteAllData: () => void }) => {
	const handleDeleteAllData = () => {
		Alert.alert(
			'Delete All Data',
			'Are you sure you want to delete all data? This action cannot be undone.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Delete', style: 'destructive', onPress: onDeleteAllData },
			]
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			{/* Settings Title */}
			<Text style={styles.header}>Settings</Text>

			{/* List of Settings Options */}
			<View style={styles.section}>
				<TouchableOpacity style={styles.option}>
					<Text style={styles.optionText}>Currency Settings</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.option}>
					<Text style={styles.optionText}>Budget Allocation</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.option}>
					<Text style={styles.optionText}>Notifications</Text>
				</TouchableOpacity>
			</View>

			{/* Delete All Data Button */}
			<TouchableOpacity
				style={styles.deleteButton}
				onPress={handleDeleteAllData}
			>
				<Text style={styles.deleteButtonText}>Delete All Data</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default SettingsScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F5F5',
		padding: 20,
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
		color: '#333',
	},
	section: {
		marginVertical: 20,
	},
	option: {
		backgroundColor: '#fff',
		padding: 15,
		marginBottom: 10,
		borderRadius: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	optionText: {
		fontSize: 16,
		color: '#333',
	},
	deleteButton: {
		backgroundColor: '#FF4D4D',
		padding: 15,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 20,
	},
	deleteButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
});