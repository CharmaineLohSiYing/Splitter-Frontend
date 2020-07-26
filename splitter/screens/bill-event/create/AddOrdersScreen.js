import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  Share,
  TouchableWithoutFeedback,
} from "react-native";

import BillInformation from "../../../components/BillInformation";
import IndividualOrders from "../../../components/IndividualOrders";
import SharedOrders from "../../../components/SharedOrders";

import Colors from "../../../constants/Colors";
import * as eventActions from "../../../store/actions/bill-event";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import AddOrdersSubSectionHeader from "../../../components/AddOrdersSubSectionHeader";
import OrderDisplay from "../../../components/OrderDisplay";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const AddOrdersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState(null);
  const sharedOrders = useSelector((state) => state.billEvent.sharedOrders);
  const attendees = useSelector((state) => state.billEvent.attendees);
  const [orders, setOrders] = useState(sharedOrders);
  const dispatch = useDispatch();

  var billDetails = null;
  billDetails = useSelector((state) => state.billEvent.billDetails);
  if (Object.keys(billDetails).length === 0) {
    billDetails = null;
  }
console.log('add orders')
  const currentFullDate = new Date();
  const currentFormattedDate = moment().format("D MMM YYYY");

  const [eventName, setEventName] = useState(
    billDetails ? billDetails.eventName : ""
  );
  const [formattedDate, setFormattedDate] = useState(
    billDetails
      ? moment(new Date(billDetails.formattedDate)).format("D MMM YYYY")
      : currentFormattedDate
  );
  const [eventDate, setEventDate] = useState(
    billDetails ? billDetails.eventDate : currentFullDate
  );
  const [totalBill, setTotalBill] = useState(
    billDetails ? billDetails.totalBill : 0
  );
  const [addGST, setAddGST] = useState(
    billDetails ? billDetails.addGST : false
  );
  const [addServiceCharge, setAddServiceCharge] = useState(
    billDetails ? billDetails.addServiceCharge : false
  );
  const [discountType, setDiscountType] = useState(
    billDetails ? billDetails.discountType : "NONE"
  );
  const [discountAmount, setDiscountAmount] = useState(
    billDetails ? billDetails.discountAmount : null
  );
  const [netBill, setNetBill] = useState(billDetails ? billDetails.netBill : 0);

  const proceedHandler = () => {
    dispatch(
      eventActions.updateBillDetails(
        eventName,
        formattedDate,
        addGST,
        addServiceCharge,
        discountType,
        discountAmount,
        netBill
      )
    );
    props.navigation.navigate("AddPayers", { isEdit, netBill });
  };


  const discountAmountHandler = (amount) => {
    console.log(amount)
    setDiscountAmount(amount);
  };

  const selectDateHandler = (date) => {
    setFormattedDate(date);
  };

  const totalBillFromStore = useSelector((state) => state.billEvent.totalBill);

  useEffect(() => {
    var multiplier = 1;
    if (addGST) {
      multiplier += 0.07;
    }
    if (addServiceCharge) {
      multiplier += 0.1;
    }

    var calculatedDiscount = 0;

    var newTotal = multiplier * totalBillFromStore;
    if (discountType === "PERCENTAGE") {
      calculatedDiscount = discountAmount * 0.01 * newTotal;
    } else if (discountType === "ABSOLUTE") {
      calculatedDiscount = discountAmount;
    }

    var newTotal = multiplier * totalBillFromStore - calculatedDiscount;

    setTotalBill(totalBillFromStore.toFixed(2));
    setNetBill(newTotal.toFixed(2));
  }, [
    totalBillFromStore,
    addGST,
    addServiceCharge,
    discountType,
    discountAmount,
  ]);

  useEffect(() => {
    if (props.route.params && props.route.params.isEdit) {
      console.log("isEdit - add orders screen", props.route.params.isEdit);
      setIsEdit(true);
    }
  }, []);

  useEffect(() => {
    setOrders(sharedOrders);
  }, [sharedOrders]);

  const deleteSharedOrderHandler = (id) => {
    dispatch(eventActions.removeSharedOrder(id));
  };

  const addSharedOrderHandler = () => {
    props.navigation.navigate("SelectSharers");
  };

  const emptyListComponent = () => {
    return (
      <View style={styles.emptyFlatlist}>
        <Text style={styles.noOrdersText}>No shared orders added yet</Text>
        <TouchableOpacity
          onPress={addSharedOrderHandler}
          style={styles.emptyAddButton}
        >
          <Text>Add a shared order</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const updateSharedOrderHandler = (id, sharers) => {
    props.navigation.navigate("SelectSharers", {
      updateSharedOrder: true,
      orderId: id,
      sharers: sharers,
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

  const footerComponent = () => {
    return (
      <>
        <IndividualOrders
          updateIndividualOrder={updateIndividualOrderHandler}
        />
        <TouchableOpacity
          onPress={proceedHandler}
          style={styles.proceedButton}
          activeOpacity={0.8}
        >
          <Text style={styles.proceedText}>Proceed</Text>
        </TouchableOpacity>
      </>
    );
  };

  const headerComponent = () => {
    return (
      <>
        <BillInformation
          formattedDate={formattedDate}
          eventName={eventName}
          eventDate={eventDate}
          totalBill={totalBill}
          addGST={addGST}
          addServiceCharge={addServiceCharge}
          discountType={discountType}
          discountAmount={discountAmount}
          netBill={netBill}
          totalBill={totalBill}
          onChangeDiscountAmount={discountAmountHandler}
          selectDateHandler={selectDateHandler}
          onChangeEventName={setEventName}
          onChangeGST={() => setAddGST((prev) => !prev)}
          onChangeServiceCharge={() => setAddServiceCharge((prev) => !prev)}
          onChangeDiscountType={setDiscountType}
        />
        <View style={{ flexDirection: "row", paddingRight: 10 }}>
          <AddOrdersSubSectionHeader
            header="Shared Orders"
            style={{ paddingVertical: 5, flex: 1 }}
          />
          <Ionicons
            name="md-add-circle-outline"
            size={28}
            color="black"
            onPress={addSharedOrderHandler}
          />
        </View>
      </>
    );
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
    <View style={{ alignItems: "center" }}>
      <View style={{ width: "90%" }}>
        <FlatList
          ListFooterComponent={footerComponent}
          ListHeaderComponent={headerComponent}
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
              edit={updateSharedOrderHandler}
              delete={deleteSharedOrderHandler}
            />
          )}
        />
      </View>
    </View>
  );
};

AddOrdersScreen.navigationOptions = {
  headerTitle: "Add Orders",
};

const styles = StyleSheet.create({
  screen: {
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
  proceedButton: {
    width: "100%",
    height: 40,
    marginBottom: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  proceedText: {
    color: "white",
    fontSize: 16,
  },
});

export default AddOrdersScreen;
