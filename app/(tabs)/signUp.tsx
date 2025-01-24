import React from 'react';
import { CommonColors } from "@/constants/Colors";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const LoginScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>SIGN UP</Text>
            <View style={styles.form}>
                <View style={styles.input}>
                    <TextInput placeholder='Email' placeholderTextColor={CommonColors.primary_opacity}/>
                </View>
                <View style={styles.input}>
                    <TextInput placeholder='Password' placeholderTextColor={CommonColors.primary_opacity}/>
                </View>
                <View style={styles.contentButton}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.textButton}>Sing Up</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.textSignin}>
                    <Text>Allready have an account? </Text>
                    <TouchableOpacity onPress={() => router.navigate("/(tabs)/login")}>
                        <Text style={styles.singin}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    textSignin:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'center',
    },
    singin:{
        color: CommonColors.Secondary,
    },
    contentButton: {
        marginTop: 16,
        width: 310,
    },
    button:{
        backgroundColor: CommonColors.Secondary,
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
    },
    textButton: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    form:{
        display: 'flex',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 16,
    },
    input: {
        borderBottomColor: CommonColors.Secondary,
        borderBottomWidth: 1,
        padding: 5,
        borderRadius: 10,
        width: 310,
        marginBottom: 30,
        color: CommonColors.primary_opacity,
    },
    container: {
        flex: 1,
        backgroundColor: CommonColors.Primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        color: CommonColors.white,
        marginBottom: 30,
        display: "flex",
        textAlign: "right"
    },
});

export default LoginScreen;
