import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CurrencySelect from "@/components/ui/CurrencySelect";
import DatePicker from "@/components/ui/DatePicker";
import Select from "@/components/ui/Select";
import {
  useCreateTransaction,
  useCreateTransfer,
  useGetAccounts,
  useGetCategories,
} from "@/hooks/apiHooks";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
	ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewTransaction() {
  const { execute: executeTransaction } = useCreateTransaction();
	const { execute: executeTransfer } = useCreateTransfer();
  const { data: categories } = useGetCategories();
  const { data: accounts } = useGetAccounts();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Add a category");
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Expense");
  const [currency, setCurrency] = useState("SEK");
  const [account, setAccount] = useState<string>("Select Account");

  // New state for the destination account in case of Transfer
  const [transferAccount, setTransferAccount] = useState<string>(
    accounts && accounts[0] ? accounts[0].name : ""
  );

  const handleKeyPress = (key: string) => {
    if (key === "delete") {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount(amount + key);
    }
  };

  const onSubmit = useCallback(async () => {
    // basic validation
    if (!amount || !date || !description || !currency || !account || !type) {
      alert("All fields are required");
      return;
    }

    // Build the transaction object
    const transaction: Omit<
      Transaction,
      | "id"
      | "amount_in_base_currency"
      | "exchange_rate"
      | "main_category"
      | "subcategory"
    > = {
      amount: type === "Expense" ? -parseFloat(amount) : parseFloat(amount),
      date: Math.floor(date.getTime() / 1000),
      description,
      currency,
      category_id: categories?.find((c) => c.name === category)?.id,
      transaction_type: type,
      account_id: accounts?.find((a) => a.name === account)?.id,
    };

    // If user selected "Transfer," add related_account_id 
    if (type === "Transfer") {
      const destAccountId = accounts?.find(
        (a) => a.name === transferAccount
      )?.id;
      if (!destAccountId) {
        alert("Please select a valid account to transfer to.");
        return;
      }
      transaction.related_account_id = destAccountId;
    }

    try {
			if (type === "Transfer") {
				await executeTransfer({ data: transaction });
			} else {
      	await executeTransaction({ data: transaction });
			}
    } catch (error) {
      console.log(error);
      alert("Error adding transaction");
      return;
    } finally {
      router.back();
    }
  }, [
    amount,
    category,
    date,
    description,
    type,
    currency,
    account,
    transferAccount,
    accounts,
    categories,
    executeTransaction,
		executeTransfer
  ]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.form}>
          {/* Amount Section */}
          <View style={styles.amountContainer}>
            <ThemedText type="title">
              {type === "Expense" && "-"}
              {amount.length > 0 ? amount : "0.00"}
            </ThemedText>
            <CurrencySelect
              onSelect={setCurrency}
              currencies={["SEK", "USD", "EUR", "COP"]}
              currency={currency}
            />
          </View>

          {/* Transaction Type */}
          <Select
            placeholder={"Transaction type"}
            items={["Expense", "Income", "Transfer", "Savings"]}
            onSelect={setType}
            value={type}
          />

          {/* Category (only relevant for Expense/Income, but you can still allow for Transfer if you'd like) */}
          <Select
            placeholder={"Category"}
            items={categories?.map((c) => c.name) || []}
            onSelect={setCategory}
            value={category}
          />

          {/* From Account */}
          <Select
            placeholder={accounts && accounts[0] ? accounts[0].name : "Account"}
            items={accounts?.map((a) => a.name) || []}
            onSelect={setAccount}
            value={account}
          />

          {/* 
          * Destination Account if "Transfer" 
          */}
          {type === "Transfer" && (
            <Select
              placeholder={"Transfer To Account"}
              items={accounts?.map((a) => a.name) || []}
              onSelect={setTransferAccount}
              value={transferAccount}
            />
          )}

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
        </View>
        {/* Custom Keyboard */}
        <View style={styles.keyboardContainer}>
          <ThemedView style={styles.keyboard}>
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
                <ThemedText type="subtitle">
                  {key === "delete" ? "⌫" : key}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <ThemedText type="subtitle" style={styles.buttonText}>
              Save
            </ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
  button: {
    backgroundColor: "#FF4D4D",
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  keyboardContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
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
    padding: 15,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
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
  },
  key: {
    width: "33.33%",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
  },
});