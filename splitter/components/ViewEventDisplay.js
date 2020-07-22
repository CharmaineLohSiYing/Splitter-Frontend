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




const ViewEventDisplay = (props) => {
  var individualTotal = props.individualOrderAmount
  props.sharedOrders.forEach(sharedOrder => {
    individualTotal += parseFloat((sharedOrder.amount / sharedOrder.users.length).toFixed(2))
  })


  const loans = props.loans
  const matchedContacts = props.matchedContacts  

  const userName = matchedContacts[props.userId]

  const LoanDisplay = (amount, payerId, payeeId) => {
    
    var payer = matchedContacts[payerId]
    var payee = matchedContacts[payeeId]
    if (props.userId === payerId){
      return (
        <View>
          <Text>To pay {payee} ${amount.toString()}</Text>
        </View>
      )
    } else if (props.userId === payeeId) {
      return (
        <View>
          <Text>To receive ${amount.toString()} from {payer}</Text>
        </View>
      )
    }
    
    
  }
  
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
    >
      <Text>Name: {userName}</Text>
      <Text>Expenditure: ${individualTotal}</Text>
      <Text>Amount paid: ${props.amountPaid}</Text>
      <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={loans}
          renderItem={({ item }) => LoanDisplay(item.amount, item.payer, item.payee)}
        />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    backgroundColor: "#ccc",
  },
});

export default ViewEventDisplay;
