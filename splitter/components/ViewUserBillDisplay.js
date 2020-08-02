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
import { MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";

const ViewUserBillDisplay = (props) => {
  const [expanded, setExpanded] = useState(false);

  var individualTotal = props.individualOrderAmount;
  props.sharedOrders.forEach((sharedOrder) => {
    individualTotal += parseFloat(
      (sharedOrder.amount / sharedOrder.users.length).toFixed(2)
    );
  });

  const loans = props.loans;
  const matchedContacts = props.matchedContacts;

  const userName = matchedContacts[props.userId];

  const LoanDisplay = (amount, payerId, payeeId) => {
    var payer = matchedContacts[payerId];
    var payee = matchedContacts[payeeId];
    if (props.userId === payerId) {
      return (
        <View>
          <Text>
            To pay {payee} ${amount.toString()}
          </Text>
        </View>
      );
    } else if (props.userId === payeeId) {
      return (
        <View>
          <Text>
            To receive ${amount.toString()} from {payer}
          </Text>
        </View>
      );
    }
  };

  const toggle = () => {
    setExpanded((x) => !x);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.mainContainer} onPress={toggle} activeOpacity={0.9}>
        <Text>{userName}</Text>
        {expanded ? (
          <Feather name="minus" size={24} color="black" style={styles.toggle} />
        ) : (
          <Ionicons
            name="md-add"
            size={24}
            color="black"
            style={styles.toggle}
          />
        )}
      </TouchableOpacity>
      {expanded && (
        <View style={styles.detailsContainer}>
          <Text>Expenditure: ${individualTotal}</Text>
          <Text>Amount paid: ${props.amountPaid}</Text>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={loans}
            renderItem={({ item }) =>
              LoanDisplay(item.amount, item.payer, item.payee)
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    borderColor: "#A9B7DB",
    borderWidth: 2,
  },
  mainContainer: {
    paddingLeft: 10,
    backgroundColor: "#A9B7DB",
    height: 30,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsContainer: {
    paddingVertical: 10,
    paddingLeft: 10,
  },
  toggle: {
    paddingRight: 10,
  },
});

export default ViewUserBillDisplay;
