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


const EventItemDisplay = (props) => {

  let totalExpenditure = props.individualOrderAmount
  const sharedOrders = props.sharedOrders
  sharedOrders.forEach(order => {
    totalExpenditure += parseFloat((order.amount / order.users.length).toFixed(2))
  })

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={props.onSelect}>
      <Text>
          Event: {props.eventName}
      </Text>
      <Text>Date: {props.date}</Text>
      <Text>Net Bill: ${props.netBill}</Text>
      <Text>Individual expenditure: ${totalExpenditure}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
 container:{
     margin: 10,
     backgroundColor:'#ccc'
 }
});

export default EventItemDisplay;
