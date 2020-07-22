import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Picker,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import FormRow from "../components/UI/FormRow";
import LabelLeft from "../components/UI/LabelLeft";
import InputRight from "../components/UI/InputRight";
import DatePicker from "../components/UI/DatePicker";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import CurrencyInput from "../components/UI/CurrencyInput";

import * as eventActions from "../store/actions/bill-event";

const BillInformation = (props) => {
  const [isEdit, setIsEdit] = useState(false) 
  const dispatch = useDispatch();
  
  var billDetails = null;
  useEffect(() => {
    if (props.edit){
      console.log('isEdit - billInformation', true)
      setIsEdit(true)
    }
  }, [props])
  billDetails = useSelector((state) => state.billEvent.billDetails);
  if (Object.keys(billDetails).length === 0){
    billDetails = null
  }

  const currentFullDate = new Date();
  const currentFormattedDate = moment().format("D MMM YYYY");

  const [eventName, setEventName] = useState(
    billDetails ? billDetails.eventName : ""
  );
  const [formattedDate, setFormattedDate] = useState(
    billDetails ? moment(billDetails.formattedDate).format("D MMM YYYY"): currentFormattedDate
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
    billDetails ? billDetails.discountAmount : 0
  );
  const [netBill, setNetBill] = useState(billDetails ? billDetails.netBill : 0);


  // const [eventName, setEventName] = useState("");
  // const [formattedDate, setFormattedDate] = useState(currentFormattedDate);
  // const [eventDate, setEventDate] = useState(currentFullDate);
  // const [totalBill, setTotalBill] = useState(0);
  // const [addGST, setAddGST] = useState(false);
  // const [addServiceCharge, setAddServiceCharge] = useState(false);
  // const [discountType, setDiscountType] = useState("NONE");
  // const [discountAmount, setDiscountAmount] = useState(0);
  // const [netBill, setNetBill] = useState(0);

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
    props.navigation.navigate("AddPayers", {isEdit, netBill});
  };

  const discountAmountHandler = (amount) => {
    setDiscountAmount(amount);
  };

  const selectDateHandler = (date) => {
    setFormattedDate(moment(new Date(date)).format("D MMM YYYY"));
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

  return (
    <View style={styles.container}>
      <Text>Bill Information</Text>
      <FormRow>
        <LabelLeft label="Event Name (Optional): " />
        <InputRight>
          <TextInput></TextInput>
        </InputRight>
      </FormRow>
      <FormRow>
        <LabelLeft label="Event Date: " />
        <InputRight>
          <DatePicker date={eventDate} onSelectDate={selectDateHandler} />
          <Text>{formattedDate}</Text>
        </InputRight>
      </FormRow>
      <FormRow>
        <LabelLeft label="Total Bill: " />
        <InputRight>
          <Text>$ {totalBill}</Text>
        </InputRight>
      </FormRow>
      <FormRow>
        <LabelLeft label="Add GST: " />
        <InputRight>
          <TouchableOpacity onPress={() => setAddGST((state) => !state)}>
            {addGST ? (
              <Ionicons name="ios-checkbox" size={24} color="black" />
            ) : (
              <Ionicons name="ios-square-outline" size={24} color="black" />
            )}
          </TouchableOpacity>
        </InputRight>
      </FormRow>
      <FormRow>
        <LabelLeft label="Add Service Charge: " />
        <InputRight>
          <TouchableOpacity
            onPress={() => setAddServiceCharge((state) => !state)}
          >
            {addServiceCharge ? (
              <Ionicons name="ios-checkbox" size={24} color="black" />
            ) : (
              <Ionicons name="ios-square-outline" size={24} color="black" />
            )}
          </TouchableOpacity>
        </InputRight>
      </FormRow>
      <FormRow>
        <LabelLeft label="Discount: " />
        <InputRight>
          <Picker
            selectedValue={discountType}
            style={{ flex: 1 }}
            onValueChange={(itemValue, itemIndex) => setDiscountType(itemValue)}
          >
            <Picker.Item label="None" value="NONE" />
            <Picker.Item label="Percentage" value="PERCENTAGE" />
            <Picker.Item label="Absolute Value" value="ABSOLUTE" />
          </Picker>
        </InputRight>
      </FormRow>
      {discountType != "NONE" && (
        <FormRow>
          <LabelLeft label="Discount Amount: " />
          <InputRight>
            {discountType == "ABSOLUTE" && <Text>$</Text>}
            <CurrencyInput
              value={discountAmount}
              onChangeValue={discountAmountHandler}
            />
            {discountType == "PERCENTAGE" && <Text>%</Text>}
          </InputRight>
        </FormRow>
      )}

      <FormRow>
        <LabelLeft label="Net Bill: " />
        <InputRight>
          <Text>$ {netBill}</Text>
        </InputRight>
      </FormRow>
      <Button title="Next" onPress={proceedHandler} />
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

export default BillInformation;
