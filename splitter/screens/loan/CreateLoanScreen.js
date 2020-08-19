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

const CreateLoanScreen = (props) => {
  const [error, setError] = useState();
  const currUserId = useSelector((state) => state.auth.userId);
  const { friendUserId, matchedName } = props.route.params;
  const [amount, setAmount] = useState("0");
  const [borrower, setBorrower] = useState(matchedName);

  const switchBorrower = () => {
      if (borrower === matchedName){
          setBorrower("Me")
      } else {
          setBorrower(matchedName)
      }
  }

  const createLoan = async  () => {

    var borrowerId = currUserId

    if (borrower === matchedName){
        borrowerId = friendUserId 
    }
    setError(null);
    try {
      const response = await fetch(
        "http://192.168.1.190:5000/loan/" +
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
            borrower: borrowerId
          }),
        }
      );

      if (!response.ok) {
        const errorResData = await response.json();
        setError(errorResData);
        return;
      }
      // console.log("loan created successfully");
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
      <Text>Create loan with {matchedName}</Text>
        <Text>Borrower: {borrower}</Text>
      <Button title="toggle" onPress={switchBorrower}/> 
      <Text>Amount:</Text>
      <TextInput
        value={amount}
        onChangeText={changeAmountHandler}
        keyboardType="number-pad"
      />
      <Button title="Confirm" onPress={createLoan} />
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

export default CreateLoanScreen;
