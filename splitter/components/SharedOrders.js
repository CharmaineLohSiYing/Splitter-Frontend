import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  Button,
  StyleSheet,
  FlatList,
  Text,
} from "react-native";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import SharedOrderDisplay from "./SharedOrderDisplay";
import * as eventActions from '../store/actions/bill-event'


const SharedOrders = (props) => {
  const dispatch = useDispatch()
  const sharedOrders = useSelector((state) => state.billEvent.sharedOrders);
  const [orders, setOrders] = useState(sharedOrders);

  
  useEffect(() => {
    setOrders(sharedOrders)

  }, [sharedOrders]);

  const editHandler = (id, sharers) => {
    props.onUpdate(id, sharers)
  }

  const deleteHandler = (id) => {
    dispatch(eventActions.removeSharedOrder(id))

  }

  return (
    <View style={styles.container}>
      <Text>Shared Orders</Text><Button title="Add" onPress={props.addSharedOrder} />
      {orders.length === 0 && <Text>No shared orders added yet</Text>}
      {orders.length > 0 && (
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={orders}
            initialNumToRender={5}
            renderItem={({ item }) => (
              <SharedOrderDisplay
                id={item.id}
                sharers={item.users}
                amount={item.amount}
                edit={editHandler}
                delete={deleteHandler}
              />
            )}
          />
      )}
      
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
  },
  input: {
    flex: 1,
  },
});

export default SharedOrders;
