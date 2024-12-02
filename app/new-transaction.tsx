import { addTransaction, getAccounts, getCategories } from "@/api";
import { ThemedText } from "@/components/ThemedText";
import CurrencySelect from "@/components/ui/CurrencySelect";
import DatePicker from "@/components/ui/DatePicker";
import Select from "@/components/ui/Select";
import { useAxios } from "@/hooks/useAxios";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

export default function NewTransaction() {
    const { data: categories } = useAxios<Category[]>(getCategories);
    const { data: accounts } = useAxios<Account[]>(getAccounts);

    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Add a category");
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState("");
    const [type, setType] = useState("Expense");
    const [currency, setCurrency] = useState("SEK");
    const [account, setAccount] = useState(accounts?.[0].name);

    const backgroundStyle = useMemo(() => {
        if (type === "Expense") {
            return "expenseBg";
        }
        if (type === "Transfer") {
            return "transferBg";
        }
        if (type === "Income") {
            return "incomeBg";
        }
        if (type === "Savings") {
            return "savingsBg";
        }
    }, [type]);

    const handleKeyPress = (key: string) => {
        if (key === "delete") {
            setAmount(amount.slice(0, -1));
        } else {
            setAmount(amount + key);
        }
    };

    const onSubmit = useCallback(async () => {
        const transaction: Omit<
            Transaction,
            | "id"
            | "amount_in_base_currency"
            | "exchange_rate"
            | "main_category"
            | "subcategory"
        > = {
            amount: type === "Expense" ? parseFloat(amount) * -1 : parseFloat(amount),
            date: Math.floor(date.getTime() / 1000),
            description,
            currency,
            category_id: categories?.find((c) => c.name === category)?.id,
            transaction_type: type,
            account_id: 1,
        };

        // validate transaction fields
        if (
            !transaction.amount ||
            !transaction.date ||
            !transaction.description ||
            !transaction.currency ||
            !transaction.category_id ||
            !transaction.transaction_type
        ) {
            alert("All fields are required");
            return;
        }

        try {
            await addTransaction(transaction);
        } catch (error) {
            console.log(error);
            alert("Error adding transaction");
            return;
        } finally {
            router.back();
        }
    }, [amount, category, date, description, type, currency, account]);

    return (
        <KeyboardAvoidingView
            style={{
                ...styles.container,
                ...styles[backgroundStyle as keyof typeof styles],
            }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* Header */}
            <View style={styles.header}>
                <ThemedText type="subtitle">Add Transaction</ThemedText>
            </View>

            {/* Amount Section */}
            <View style={styles.amountContainer}>
                <Text style={styles.amount}>
                    {type === "Expense" && "-"}
                    {amount.length > 0 ? amount : "0.00"}
                </Text>
                <CurrencySelect
                    onSelect={setCurrency}
                    currencies={["SEK", "USD", "EUR", "COP"]}
                    currency={currency}
                />
            </View>

            {/* Type */}
            <Select
                placeholder={"Transaction type"}
                items={["Expense", "Income", "Transfer", "Savings"]}
                onSelect={setType}
                value={type}
            />

            {/* Category */}
            <Select
                placeholder={"Category"}
                items={categories?.map((c) => c.name) || []}
                onSelect={setCategory}
                value={category}
            />

            {/* Account */}
            <Select
                placeholder={"Account"}
                items={accounts?.map((a) => a.name) || []}
                onSelect={setAccount}
                value={account}
            />

            {/* Date */}
            <DatePicker date={date} onChange={setDate} />

            {/* Description */}
            <View style={styles.row}>
                <TextInput
                    style={styles.notesInput}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                />
            </View>

            {/* Custom Keyboard */}
            <View style={styles.keyboardContainer}>
                <View style={styles.keyboard}>
                    {[
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        ".",
                        "0",
                        "delete",
                    ].map((key) => (
                        <TouchableOpacity
                            key={key}
                            style={styles.key}
                            onPress={() => handleKeyPress(key)}
                        >
                            <Text style={styles.keyText}>{key === "delete" ? "⌫" : key}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={onSubmit}>
                <ThemedText type="subtitle" style={styles.buttonText}>
                    Save
                </ThemedText>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#007AFF",
        borderRadius: 10,
        padding: 15,
        marginTop: 20,
        alignItems: "center",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F5F5F5",
    },
    keyboardContainer: {
        marginVertical: 20,
    },
    header: {
        marginBottom: 10,
    },
    amountContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },
    currency: {
        fontSize: 20,
        fontWeight: "600",
        marginRight: 10,
    },
    amount: {
        fontSize: 36,
        fontWeight: "bold",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 15,
        marginVertical: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    notesInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: "400",
        color: "#333",
    },
    keyboard: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        backgroundColor: "white",
    },
    key: {
        width: "33.33%",
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#ccc",
    },
    keyText: {
        fontSize: 24,
        fontWeight: "bold",
    },
    expenseBg: {
        backgroundColor: "#e74c3c",
    },
    incomeBg: {
        backgroundColor: "#2ecc71",
    },
    transactionBg: {
        backgroundColor: "#3498db",
    },
    savingsBg: {
        backgroundColor: "#f1c40f",
    },
});
