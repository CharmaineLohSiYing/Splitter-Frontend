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
import CurrencyInput from "./UI/CurrencyInput";
import loan from "../store/reducers/loan";
import Colors from "../constants/Colors";

const LoanDisplay = (props) => {
  const [matchedName, setMatchedName] = useState("");
  const {debt, userId} = props.debt;
  const { contacts } = useSelector((state) => state.auth);

  useEffect(() => {
    if (contacts) {
      const matchedContact = contacts[props.friendMobileNumber];
      if (matchedContact) {
        setMatchedName(matchedContact.name);
      } else {
        setMatchedName(props.friendMobileNumber);
      }
    }
  }, [contacts]);

  return (
    <TouchableOpacity
      style={[styles.container, debt <= 0 ? styles.notInDebt : styles.inDebt]}
      onPress={() =>
        props.navigate("ViewContactLoans", {
          matchedName,
          friendUserId: userId,
          debt: debt,
        })
      }
    >
      <Text style={styles.friend}>{matchedName}</Text>
      <Text style={styles.friend}>DEBT: ${debt}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    paddingHorizontal: 10,
  },
  friend: {
    textDecorationStyle: "solid",
  },
  notInDebt: {
    backgroundColor: Colors.lightBlue,
  },
  inDebt: {
    backgroundColor: Colors.lightRed,
  },
});

export default LoanDisplay;
