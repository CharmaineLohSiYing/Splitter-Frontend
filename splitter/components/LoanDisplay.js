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
import Avatar from "./Avatar"

const LoanDisplay = (props) => {
  const [matchedName, setMatchedName] = useState("");
  const {debt, friendUserId, friendName} = props;
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
      style={[styles.container]}
      onPress={() =>
        props.navigate("ViewContactLoans", {
          matchedName: friendName,
          friendUserId: friendUserId,
          debt: debt,
        })
      }
    >
      <View style={{flexDirection:'row', alignItems: 'center', flex: 1}}>
        <Avatar height={30}/>
        <Text style={[styles.text, {color: props.nameColor}]}>{friendName}</Text>
      </View>
      <View style={{flex: 1, paddingLeft: 70}}>
          <Text style={styles.text}>${debt.toFixed(2)}</Text>
      </View>
      
      
    </TouchableOpacity>
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
  text: {
    fontWeight:'bold',
    textAlign:'left'
  }
});

export default LoanDisplay;
