import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";

const CreateTransactionScreen = (props) => {
  const [error, setError] = useState();
  const currUserId = useSelector((state) => state.auth.userId);
  const { friendUserId, matchedName, debt } = props.route.params;
  const [amount, setAmount] = useState(debt.toString());

  const createTransaction = async  () => {
    setError(null);
    try {
      const response = await fetch(
        "http://192.168.1.190:5000/transaction/" +
          currUserId +
          "/" +
          friendUserId,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
          }),
        }
      );

      if (!response.ok) {
        const errorResData = await response.json();
        setError(errorResData);
        return;
      }
      console.log("transaction created successfully");
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
  }
    

  const changeAmountHandler = (amount) => {
    setAmount(amount);
  };

  return (
    <View style={styles.container}>
      <Text>Transfer to {matchedName}</Text>
      <TextInput
        value={amount}
        onChangeText={changeAmountHandler}
        keyboardType="number-pad"
      />
      <Button title="Confirm" onPress={createTransaction} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    backgroundColor: "#ccc",
  },
  friend: {
    textAlign: "center",
    textDecorationStyle: "solid",
  },
  header: {
    backgroundColor: "#ccc",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default CreateTransactionScreen;
