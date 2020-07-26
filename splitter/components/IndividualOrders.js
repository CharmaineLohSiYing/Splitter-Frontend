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
  FlatList,
  TouchableOpacity
} from "react-native";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import OrderDisplay from "./OrderDisplay";
import AddOrdersSubSectionHeader from "./AddOrdersSubSectionHeader";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Colors from '../constants/Colors'

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
      <View style={{width:'100%'}}>
        <AddOrdersSubSectionHeader header="Individual Orders"/>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={Object.keys(attendees)}
          renderItem={({ item }) => (
            <OrderDisplay
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
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
  
});

export default IndividualOrders;
