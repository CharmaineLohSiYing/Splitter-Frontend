import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
  Share,
} from "react-native";

import BillInformation from "../../../components/BillInformation";
import IndividualOrders from "../../../components/IndividualOrders";
import SharedOrders from "../../../components/SharedOrders";

import * as eventActions from "../../../store/actions/bill-event";
import { useSelector, useDispatch } from "react-redux";

const AddOrdersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.route.params && props.route.params.isEdit) {
      console.log('isEdit - add orders screen',props.route.params.isEdit)
      setIsEdit(true);
    }
  }, [])

  const attendees = useSelector((state) => state.billEvent.attendees);

  const addSharedOrderHandler = () => {
    props.navigation.navigate("SelectSharers");
  };

  const updateSharedOrderHandler = (id, sharers) => {
    props.navigation.navigate("SelectSharers", {
      updateSharedOrder: true,
      orderId: id,
      sharers: sharers
    });
  };
  const updateIndividualOrderHandler = (id) => {
    const user = attendees[id];
    props.navigation.navigate("Calculator", {
      sharers: [user],
      updateIndividualOrder: true,
      userId: id,
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BillInformation navigation={props.navigation} edit={isEdit} />
      <SharedOrders
        addSharedOrder={addSharedOrderHandler}
        onUpdate={updateSharedOrderHandler}
      />
      <IndividualOrders updateIndividualOrder={updateIndividualOrderHandler} />
    </SafeAreaView>
  );
};

AddOrdersScreen.navigationOptions = {
  headerTitle: "Add Orders",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default AddOrdersScreen;
