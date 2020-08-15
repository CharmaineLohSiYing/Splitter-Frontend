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
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Colors from "../constants/Colors";
import { BoxShadow } from "react-native-shadow";
const screenWidth = Dimensions.get("window").width;

const shadowOpt = {
  width: screenWidth,
  height: 40,
  color: "#000",
  border: 2,
  radius: 3,
  opacity: 0.1,
  x: 0,
  y: 1,
};

const BillItemDisplay = (props) => {
  let totalExpenditure = props.individualOrderAmount;
  const sharedOrders = props.sharedOrders;
  sharedOrders.forEach((order) => {
    totalExpenditure += parseFloat(
      (order.amount / order.users.length).toFixed(2)
    );
  });

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={props.onSelect}
    >
      <View style={styles.firstRow}>
        <Text style={styles.billName}>
          {props.billName ? props.billName : "Bill"}
        </Text>
        <View style={styles.netBillContainer}>
          <Text>${totalExpenditure.toFixed(2)}</Text>
        </View>
      </View> 
      <Text>
        Net Bill: <Text style={{fontWeight:'bold'}}>${props.netBill.toFixed(2)}</Text> on{" "}
        {moment(new Date(props.date)).format("D MMM YYYY")}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingHorizontal:15,
    backgroundColor: Colors.blue5,
    elevation: 3,
    marginBottom: 20
  },
  billName: {
    fontSize: 18,
  },
  firstRow: {
    height: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  netBillContainer: {
    minWidth: 100,
    paddingHorizontal: 5,
    paddingVertical:3,
    backgroundColor: Colors.blue3,
    alignItems: "center",
    borderRadius: 15,
  },
});

export default BillItemDisplay;
