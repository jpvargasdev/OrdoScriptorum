import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SignScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Pantalla de registro</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default SignScreen;
