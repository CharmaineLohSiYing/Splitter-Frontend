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

import AddOrdersHeader from "../../../components/AddOrdersSubSectionHeader";
import Colors from "../../../constants/Colors";
import * as eventActions from "../../../store/actions/bill-event";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import AddOrdersSubSectionHeader from "../../../components/AddOrdersSubSectionHeader";
import OrderDisplay from "../../../components/OrderDisplay";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import ProceedBottomButton from "../../../components/UI/ProceedBottomButton";
import FormRow from "../../../components/UI/FormRow";
import LabelLeft from "../../../components/UI/LabelLeft";
import InputRight from "../../../components/UI/InputRight";
import DatePicker from "../../../components/UI/DatePicker";
import { Layout, Radio, CheckBox } from "@ui-kitten/components";
import CurrencyInput from "../../../components/UI/CurrencyInput";

const EnterBillDetailsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  var billDetails = null;
  billDetails = useSelector((state) => state.billEvent.billDetails);
  if (Object.keys(billDetails).length === 0) {
    billDetails = null;
  }

  props.navigation.setOptions({
    headerTitle: "Enter Bill Details",
    headerTitleStyle: {
      fontFamily: "roboto-regular",
      flex: 1,
      alignSelf: "center",
    },
  });
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
    //allow 1, 1.2 and .1
    // var currencyRegex = /(?<=^| )\d+(\.\d+)?(?=$| )|(?<=^| )\.\d+(?=$| )/;
    // if (currencyRegex.test(amount) || amount === "") {
    //   setDiscountAmount(amount);
    // } else {
    // }
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
    setNetBill(newTotal.toFixed(2));
  }, [
    totalBillFromStore,
    addGST,
    addServiceCharge,
    discountType,
    discountAmount,
  ]);
  useEffect(() => {
    if (totalBillFromStore) {
      setTotalBill(totalBillFromStore.toFixed(2));
    }
  }, [totalBillFromStore]);

  useEffect(() => {
    if (props.route.params && props.route.params.isEdit) {
      console.log("isEdit - add orders screen", props.route.params.isEdit);
      setIsEdit(true);
    }
  }, []);

  const updateDiscountTypeHandler = (type) => {
    setDiscountType(type);
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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={{ width: "90%" }}>
        <View style={styles.container}>
          <AddOrdersHeader
            header="Bill Information"
            subtitle={netBill}
            style={{ backgroundColor: Colors.lightBlue, alignItems: "center" }}
          />
          <View style={styles.contentContainer}>
            <FormRow>
              <LabelLeft label="Event Name" />
              <InputRight>
                <TextInput
                  style={{ textAlign: "right" }}
                  value={eventName}
                  onChangeText={setEventName}
                  placeholder="Optional"
                />
              </InputRight>
            </FormRow>
            <FormRow>
              <LabelLeft label="Event Date" />
              <InputRight>
                <DatePicker
                  date={eventDate}
                  onSelectDate={selectDateHandler}
                  formattedDate={formattedDate}
                />
              </InputRight>
            </FormRow>
            <FormRow style={{ backgroundColor: Colors.lightBlue, height: 40 }}>
              <LabelLeft
                label={"Add calculations to total bill ($" + totalBill + ")"}
                style={{ alignItems: "center" }}
              />
            </FormRow>
            <FormRow
              style={{
                flexDirection: "column",
                height: 60,
                justifyContent: "center",
              }}
            >
              <LabelLeft label="Extra Charges" />
              <InputRight>
                <Layout style={styles.layoutContainer}>
                  <CheckBox
                    style={styles.radio}
                    checked={addGST}
                    onChange={() => setAddGST((prev) => !prev)}
                  >
                    GST
                  </CheckBox>
                  <CheckBox
                    style={styles.radio}
                    checked={addServiceCharge}
                    onChange={() => setAddServiceCharge((prev) => !prev)}
                  >
                    Service Charge
                  </CheckBox>
                </Layout>
              </InputRight>
            </FormRow>
            <FormRow
              style={{
                flexDirection: "column",
                height: 60,
                justifyContent: "center",
              }}
            >
              <LabelLeft label="Discount" />
              <InputRight>
                <Layout style={styles.layoutContainer}>
                  <Radio
                    style={styles.radio}
                    checked={discountType === "NONE"}
                    onChange={() => updateDiscountTypeHandler("NONE")}
                  >
                    None
                  </Radio>
                  <Radio
                    style={styles.radio}
                    checked={discountType === "PERCENTAGE"}
                    onChange={() => updateDiscountTypeHandler("PERCENTAGE")}
                  >
                    Percentage
                  </Radio>
                  <Radio
                    style={styles.radio}
                    checked={discountType === "ABSOLUTE"}
                    onChange={() => updateDiscountTypeHandler("ABSOLUTE")}
                  >
                    Absolute Value
                  </Radio>
                </Layout>
              </InputRight>
            </FormRow>
            {discountType != "NONE" && (
              <FormRow>
                <LabelLeft
                  label={
                    discountType == "ABSOLUTE"
                      ? "Discount Amount ($)"
                      : "Discount Amount (%)"
                  }
                />
                <InputRight>
                  <CurrencyInput
                    autoFocus={true}
                    placeholder="0.00"
                    style={{ textAlign: "right" }}
                    value={discountAmount}
                    onChangeValue={discountAmountHandler}
                  />
                </InputRight>
              </FormRow>
            )}
          </View>
          <ProceedBottomButton proceedHandler={proceedHandler} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    marginVertical: 10,
    borderColor: Colors.lightBlue,
    borderWidth: 1,
    alignSelf: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
  },
  container: {
    marginVertical: 20,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
  layoutContainer: {
    height: 40,
    left: 5,
    justifyContent: "center",
    width: "100%",
    flexDirection: "row",
    paddingBottom: 5,
    backgroundColor: "transparent",
    // backgroundColor:'green',
  },
  radio: {
    height: "100%",
    //   backgroundColor:'yellow',
    margin: 1,
  },
  floatingButton: {
    backgroundColor: Colors.primary,
    position: "absolute",
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
    borderRadius: 35,
    zIndex: 1,
    flexDirection: "row",
  },
});

export default EnterBillDetailsScreen;
