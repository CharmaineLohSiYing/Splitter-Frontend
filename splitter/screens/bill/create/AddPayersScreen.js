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
  TouchableOpacity,
  FlatList,
} from "react-native";
import Colors from "../../../constants/Colors";

import IndividualOrders from "../../../components/IndividualOrders";
import * as billActions from "../../../store/actions/bill";
import Header from "../../../components/AddOrdersSubSectionHeader";
import ProceedBottomButton from "../../../components/UI/ProceedBottomButton";
import CreateBillHeader from "../../../components/CreateBillHeader";
import OrderDisplay from "../../../components/OrderDisplay";
import AddOrderModal from "../../../components/AddOrderModal";
import FormRow from "../../../components/UI/FormRow";
import LabelLeft from "../../../components/UI/LabelLeft";
import InputRight from "../../../components/UI/InputRight";
import Screen from "../../../components/UI/Screen"
import FlatListLineSeparator from "../../../components/UI/FlatListLineSeparator"

import { useSelector, useDispatch } from "react-redux";

const AddPayersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isEdit, setIsEdit] = useState();
  const attendeesFromStore = useSelector((state) => state.bill.attendees);
  const [attendees, setAttendees] = useState(attendeesFromStore);
  const [payerToUpdate, setPayerToUpdate] = useState(null);
  const unpaidAmount = useSelector((state) => state.bill.unpaidAmount);
  const netBill = useSelector((state) => state.bill.billDetails.netBill);

  useEffect(() => {
    setAttendees(attendeesFromStore);
  }, [attendeesFromStore]);

  props.navigation.setOptions({
    headerTitle: "Select Payers",
    headerTitleStyle: {
      fontFamily: "roboto-regular",
      flex: 1,
      alignSelf: "center",
    },
  });

  useEffect(() => {
    if (props.route.params) {
      if (props.route.params.isEdit) {
        setIsEdit(true);
      }
    }
  }, [props.route.params]);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const dispatch = useDispatch();

  const updatePaidAmountHandler = (id) => {
    setPayerToUpdate(id);
  };

  const createBillHandler = async () => {
    if (unpaidAmount > 0) {
      console.log('unpaid amount',unpaidAmount)
      setError("Numbers do not tally");
    } else {
      setError(null);
      setIsLoading(true);
      try {
        // console.log("before dispatch");
        // console.log("isedit", isEdit);
        if (isEdit) {
          await dispatch(billActions.editBill());
        } else {
          await dispatch(billActions.createBill());
        }
        // console.log("after dispatch");
        props.navigation.navigate("Bills");
      } catch (err) {
        setError("Error");
        // console.log("error caught");
      }
      setIsLoading(false);
    }
  }

  const PayerHeader = () => {
    return <View
    style={{
      backgroundColor: Colors.blue4Rgba,
      height: 50,
      marginBottom: 20,
    }}
  >
    <FormRow>
      <View style={{ flex: 1, padding: 10 }}>
        <Text
          style={{
            fontStyle: "italic",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Unsettled Amount
        </Text>
      </View>
      <View style={{ flex: 1, padding: 10, alignItems: "flex-end" }}>
        <Text
          style={{
            fontStyle: "italic",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          $ {unpaidAmount} / {netBill}
        </Text>
      </View>
    </FormRow>
  </View>
  }

  return (
    <Screen>
      <CreateBillHeader
        progress={4}
        displayProceed={true}
        proceedHandler={createBillHandler}
        title="Last thing, who settled the bill?"
      />

      
      <FlatList
        ListHeaderComponent={PayerHeader}
        style={{width:'100%'}}
        contentContainerStyle={{paddingHorizontal:'5%', paddingVertical:20 }}
        ItemSeparatorComponent={FlatListLineSeparator}
        keyExtractor={(item, index) => index.toString()}
        data={Object.keys(attendees)}
        renderItem={({ item }) => (
          <OrderDisplay
            style={{
              backgroundColor:
                attendees[item].paidAmount > 0 ? "white" : Colors.gray5,
            }}
            nameTextColor={attendees[item].paidAmount > 0 ? "black" : Colors.gray2}
            onSelect={updatePaidAmountHandler}
            id={item}
            name={attendees[item].name}
            amount={attendees[item].paidAmount}
          />
        )}
      />

      {payerToUpdate && (
        <AddOrderModal
          updatePayer={true}
          user={payerToUpdate}
          unpaidAmount={unpaidAmount}
          onClose={() => {
            setPayerToUpdate(null);
          }}
        />
      )}
    </Screen>
  );
};

AddPayersScreen.navigationOptions = {
  headerTitle: "Add Orders",
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginVertical: 10,
    padding: 10,
  },
  screen: {
    flex: 1,
    alignItems: "center"
  },
});
export default AddPayersScreen;
