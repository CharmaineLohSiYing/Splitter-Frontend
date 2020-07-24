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
import moment from "moment";
import Colors from '../constants/Colors'

const EventItemDisplay = (props) => {
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
        <Text style={styles.eventName}>{props.eventName ? props.eventName : "Event"}</Text>
        <View style={styles.netBillContainer}>
          <Text>${props.netBill.toFixed(2)}</Text>
        </View>
      </View>
      <Text>
        Spent ${totalExpenditure} on {moment(new Date(props.date)).format("D MMM YYYY")}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderColor: Colors.primary,
    borderWidth: 1,
    padding: 10,
  },
  eventName:{
    fontWeight: 'bold',
    fontSize: 18
  },
  firstRow:{
    height: 30,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom: 5
  },
  netBillContainer:{
    minWidth: 100,
    padding:5,
    backgroundColor: Colors.accent,
    alignItems:'center'
  }
});

export default EventItemDisplay;
