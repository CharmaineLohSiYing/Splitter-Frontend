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
import Avatar from "./Avatar";
import AppModal from "./UI/AppModal";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import GlobalStyles from "../assets/style"

const TransactionModal = (props) => {
  const [error, setError] = useState(null);
  const currUserId = useSelector((state) => state.auth.userId);
  const [amount, setAmount] = useState(null)
  const { friendUserId } = props;

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

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
      } else {
        props.onClose()
      }

    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <AppModal title={"Transfer to " + props.matchedName} onClose={props.onClose} onSubmit={createTransaction} rightButton="OK">
      <View style={{paddingVertical: 20}}>
         <TextInput
            autoFocus={true}
            style={GlobalStyles.modalTextInput}
            placeholder="$0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="number-pad"
          />
      </View>
         
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    padding: 10,
  },
  friend: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

});

export default TransactionModal;
