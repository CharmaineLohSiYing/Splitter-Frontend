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
import GlobalStyles from "../assets/style";

const LoanModal = (props) => {
  const [userIsBorrower, setUserIsBorrower] = useState(false);
  const [error, setError] = useState(null);
  const currUserId = useSelector((state) => state.auth.userId);
  const [amount, setAmount] = useState(null);
  const { friendUserId, friendMobileNumber } = props;
  const toggle = (isBorrower) => {
    setUserIsBorrower(isBorrower);
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const createLoan = async () => {
    var borrowerId = currUserId;
    let url =
      "http://192.168.1.190:5000/api/loan/" + currUserId + "/" + friendUserId;
    if (!friendUserId) {
      url =
        "http://192.168.1.190:5000/api/loan/" +
        currUserId +
        "/" +
        friendMobileNumber;
    }

    if (!userIsBorrower) {
      if (!friendUserId) {
        borrowerId = friendMobileNumber;
      } else {
        borrowerId = friendUserId;
      }
    }
    setError(null);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          borrower: borrowerId,
          mobileNumber: !friendUserId,
        }),
      });

      if (!response.ok) {
        const errorResData = await response.json();
        setError(errorResData);
        return;
      } else {
        if (!friendUserId) {
          const returnedId = (await response.json()).friendUserId;
          console.log("RETURNED ID", returnedId);
          props.setFriendUserId(returnedId);
        }
        props.onCreateLoanSuccess();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AppModal
      title="New Loan"
      onClose={props.onClose}
      onSubmit={createLoan}
      rightButton="OK"
    >
      <View style={{ paddingVertical: 20 }}>
        <View>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              toggle(false);
            }}
          >
            <Text>I am loaning {props.matchedName}</Text>
            <Ionicons
              name={
                userIsBorrower ? "md-radio-button-off" : "md-radio-button-on"
              }
              size={18}
              color={Colors.blue1}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              toggle(true);
            }}
          >
            <Text>{props.matchedName} is loaning me</Text>
            <Ionicons
              name={
                userIsBorrower ? "md-radio-button-on" : "md-radio-button-off"
              }
              size={18}
              color={Colors.blue1}
            />
          </TouchableOpacity>
          <TextInput
            style={GlobalStyles.modalTextInput}
            placeholder="$0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="number-pad"
            autoFocus={true}
          />
        </View>
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

export default LoanModal;
