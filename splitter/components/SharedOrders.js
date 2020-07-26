import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  Button,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import OrderDisplay from "./OrderDisplay";
import * as eventActions from "../store/actions/bill-event";
import AddOrdersSubSectionHeader from "./AddOrdersSubSectionHeader";
import Colors from "../constants/Colors";
import IndividualOrders from "./IndividualOrders";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const SharedOrders = (props) => {
  const dispatch = useDispatch();
  const sharedOrders = useSelector((state) => state.billEvent.sharedOrders);
  const attendees = useSelector((state) => state.billEvent.attendees);
  const [orders, setOrders] = useState(sharedOrders);

  useEffect(() => {
    setOrders(sharedOrders);
  }, [sharedOrders]);

  const editSharedOrderHandler = (id, sharers) => {
    props.onUpdate(id, sharers);
  };

  const deleteSharedOrderHandler = (id) => {
    dispatch(eventActions.removeSharedOrder(id));
  };

  const emptyListComponent = () => {
    return (
      <View style={styles.emptyFlatlist}>
        <Text style={styles.noOrdersText}>No shared orders added yet</Text>
        <TouchableOpacity
          onPress={props.addSharedOrder}
          style={styles.emptyAddButton}
        >
          <Text>Add a shared order</Text>
        </TouchableOpacity>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", paddingRight: 10 }}>
        <AddOrdersSubSectionHeader
          header="Shared Orders"
          style={{ paddingVertical: 5, flex: 1 }}
        />
        <Ionicons name="md-add-circle-outline" size={28} color="black" />
      </View>
      <View>
        {/* <View style={styles.flatlist}> */}
        <FlatList
          ListFooterComponent={
            <IndividualOrders
              updateIndividualOrder={props.updateIndividualOrder}
            />
          }
          keyExtractor={(item, index) => index.toString()}
          data={orders}
          ListEmptyComponent={emptyListComponent}
          initialNumToRender={5}
          renderItem={({ item }) => (
            <OrderDisplay
              id={item.id}
              sharers={item.users}
              amount={item.amount}
              attendees={attendees}
              edit={editSharedOrderHandler}
              delete={deleteSharedOrderHandler}
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
    alignSelf: "center",
  },
  input: {
    flex: 1,
  },
  emptyAddButton: {
    alignSelf: "center",
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: 40,
    backgroundColor: Colors.lightBlue,
  },
  emptyFlatlist: {
    borderWidth: 1,
    borderColor: Colors.lightBlue,
    height: 90,
    padding: 10,
  },
  noOrdersText: {
    alignSelf: "center",
  },
});

export default React.memo(SharedOrders);
