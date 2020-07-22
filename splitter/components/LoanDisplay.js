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
import Colors from '../constants/Colors'

const LoanDisplay = (props) => {
  const [matchedName, setMatchedName] = useState("");
  const { debt } = props;
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => props.navigate('ViewContactLoans', {matchedName, friendUserId: debt.userId, debt: debt.debt})}>
        <Text style={styles.friend}>{matchedName}</Text>
        <Text style={styles.friend}>DEBT: ${debt.debt}</Text>
      </TouchableOpacity>
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
    backgroundColor: '#ccc',
    textAlign:'center',
    marginVertical: 10
  }
});

export default LoanDisplay;
