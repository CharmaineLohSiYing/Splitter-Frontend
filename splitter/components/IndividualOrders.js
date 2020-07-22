import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList
} from "react-native";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import IndividualOrderDisplay from "./IndividualOrderDisplay";

const IndividualOrders = (props) => {

  const attendeesFromStore = useSelector((state) => state.billEvent.attendees);
  const [attendees, setAttendees] = useState(attendeesFromStore);
  const [displayPayers, setDisplayPayers] = useState(false);
  
  let { payers } = props
  
  useEffect(() => {
    if (payers){
      setDisplayPayers(true)
    }
  }, [displayPayers, payers]);

  useEffect(() => {
    setAttendees(attendeesFromStore);
  }, [attendeesFromStore]);

  const updateIndividualOrderHandler = (id) => {
    props.updateIndividualOrder(id)
  }

  const updatePaidAmountHandler = (id) => {
    props.updatePaidAmount(id)
  }

  return (
    <View style={styles.container}>
      {displayPayers ? <Text>Payment Distribution</Text> : <Text>Individual Orders</Text>}
      <View>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={Object.keys(attendees)}
          renderItem={({ item }) => (
            <IndividualOrderDisplay
              onSelect={displayPayers ? updatePaidAmountHandler : updateIndividualOrderHandler}
              id={item}
              name={attendees[item].name}
              amount={displayPayers ? attendees[item].paidAmount : attendees[item].amount}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    width: "90%",
    backgroundColor: "#ccc",
    alignSelf: "center",
    alignItems: "center",
    maxHeight:100
  },
});

export default IndividualOrders;
