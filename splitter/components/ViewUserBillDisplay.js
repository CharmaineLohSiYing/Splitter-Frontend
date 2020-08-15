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
import Colors from "../constants/Colors";
import Avatar from "../components/Avatar";
import GlobalStyles from "../assets/style"

const ViewUserBillDisplay = (props) => {
  const [expanded, setExpanded] = useState(false);
  const {loans, amountPaid} = props

  let individualTotal = props.individualOrderAmount;
  props.sharedOrders.forEach((sharedOrder) => {
    individualTotal += parseFloat(
      (sharedOrder.amount / sharedOrder.users.length).toFixed(2)
    );
  });

  const netDebt = individualTotal - amountPaid;
  
  const matchedContacts = props.matchedContacts;

  const userName = matchedContacts[props.userId];

  const LoanDisplay = (amount, payerId, payeeId) => {
    let payer = matchedContacts[payerId];
    let payee = matchedContacts[payeeId];
    if (props.userId === payerId) {
      return (
        <View>
          <Text>
            To pay {payee} <Text style={{fontWeight:'bold'}}>${amount.toString()}</Text>
          </Text>
        </View>
      );
    } else if (props.userId === payeeId) {
      return (
        <View>
          <Text>
            To collect from {payer} <Text style={{fontWeight:'bold'}}>${amount.toString()} </Text>
          </Text>
        </View>
      );
    }
  };

  const toggle = () => {
    setExpanded((x) => !x);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: expanded ? "white" : Colors.gray4 },
      ]}
      onPress={toggle}
      activeOpacity={0.9}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar />
          <Text style={{ fontWeight: "bold" }}>{userName}</Text>
        </View>
        <View style={[GlobalStyles.amountContainer, {borderWidth: 1, borderColor: netDebt > 0 ? Colors.red1 : Colors.green1, backgroundColor: netDebt > 0 ? Colors.red2 : Colors.green2}]}>
          <Text style={[{fontWeight: 'bold', color: netDebt > 0 ? Colors.red1 : Colors.green1}]}>${netDebt}</Text>
        </View>
      </View>

      {/* {expanded ? (
          <Feather name="minus" size={24} color="black" style={styles.toggle} />
        ) : (
          <Ionicons
            name="md-add"
            size={24}
            color="black"
            style={styles.toggle}
          />
        )} */}

      {expanded && (
        <View style={styles.detailsContainer}>
          {individualTotal > 0 && <Text>Spent ${individualTotal}</Text>}
          {props.amountPaid > 0 && <Text>Settled the bill ${props.amountPaid}</Text>}
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={loans}
            renderItem={({ item }) =>
              LoanDisplay(item.amount, item.payer, item.payee)
            }
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  detailsContainer: {
    paddingVertical: 10,
    paddingLeft: 50,
  },
  netAmount:{
    borderRadius: 15,
    borderWidth: 2,

  }
});

export default ViewUserBillDisplay;
