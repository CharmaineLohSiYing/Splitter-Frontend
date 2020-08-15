import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  FlatList,
  Switch,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  Share,
  TouchableWithoutFeedback,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";

import AddOrdersHeader from "../../../components/AddOrdersSubSectionHeader";
import Colors from "../../../constants/Colors";
import * as billActions from "../../../store/actions/bill";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import FormRow from "../../../components/UI/FormRow";
import LabelLeft from "../../../components/UI/LabelLeft";
import InputRight from "../../../components/UI/InputRight";
import DatePicker from "../../../components/UI/DatePicker";
import { Layout, Radio, CheckBox } from "@ui-kitten/components";
import CurrencyInput from "../../../components/UI/CurrencyInput";
import CreateBillHeader from "../../../components/CreateBillHeader";
import Screen from "../../../components/UI/Screen"

const EnterBillDetailsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  var billDetails = null;
  billDetails = useSelector((state) => state.bill.billDetails);
  if (Object.keys(billDetails).length === 0) {
    billDetails = null;
  }

  const currentFullDate = new Date();
  const currentFormattedDate = moment().format("D MMM YYYY");

  const [billName, setBillName] = useState(() => {
    return billDetails ? billDetails.billName : "";
  });
  const [formattedDate, setFormattedDate] = useState(() => {
    return billDetails
      ? moment(new Date(billDetails.formattedDate)).format("D MMM YYYY")
      : currentFormattedDate;
  });
  const [billDate, setBillDate] = useState(() => {
    return billDetails ? billDetails.billDate : currentFullDate;
  });
  const [totalBill, setTotalBill] = useState(
    billDetails ? billDetails.totalBill : 0
  );
  const [addGST, setAddGST] = useState(() => {
    return billDetails ? billDetails.addGST : false;
  });
  const [addServiceCharge, setAddServiceCharge] = useState(() => {
    return billDetails ? billDetails.addServiceCharge : false;
  });

  const discountType = "NONE";
  const discountAmount = null;
  // const [discountType, setDiscountType] = useState(() => {
  //   return billDetails ? billDetails.discountType : "NONE";
  // });
  // const [discountAmount, setDiscountAmount] = useState(() => {
  //   return billDetails ? billDetails.discountAmount : null;
  // });
  const [netBill, setNetBill] = useState(() => {
    return billDetails ? billDetails.netBill : 0;
  });

  const [hasDiscount, setHasDiscount] = useState(false);

  const proceedHandler = () => {
    dispatch(
      billActions.updateBillDetails(
        billName,
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

  const totalBillFromStore = useSelector((state) => state.bill.totalBill);

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
    // if (discountType === "PERCENTAGE") {
    //   calculatedDiscount = discountAmount * 0.01 * newTotal;
    // } else if (discountType === "ABSOLUTE") {
    //   calculatedDiscount = discountAmount;
    // }

    var newTotal = multiplier * totalBillFromStore - calculatedDiscount;
    setNetBill(newTotal.toFixed(2));
  }, [
    totalBillFromStore,
    addGST,
    addServiceCharge,
    // discountType,
    // discountAmount,
  ]);
  useEffect(() => {
    if (totalBillFromStore) {
      setTotalBill(totalBillFromStore.toFixed(2));
    }
  }, [totalBillFromStore]);

  useEffect(() => {
    if (props.route.params && props.route.params.isEdit) {
      // console.log("isEdit - add orders screen", props.route.params.isEdit);
      setIsEdit(true);
    }
  }, []);

  // const updateDiscountTypeHandler = (type) => {
  //   setDiscountType(type);
  // };

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
    <Screen style={{paddingTop: 0}}>
      <CreateBillHeader
        displayProceed={true}
        progress={3}
        proceedHandler={proceedHandler}
        title="Bill Details"
      />
      <View style={{ paddingHorizontal: "5%", paddingVertical: 20 }}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <FormRow>
              <LabelLeft label="Event Name" />
              <InputRight style={{ flex: 2 }}>
                <TextInput
                  style={{ flex: 1, textAlign: "right", borderRadius: 15, paddingHorizontal: 10 }}
                  value={billName}
                  onChangeText={setBillName}
                  placeholder="Optional"
                  backgroundColor={Colors.gray5}
                />
              </InputRight>
            </FormRow>
            <FormRow>
              <LabelLeft label="Date" />
              <InputRight style={{ flex: 2 }}>
                <View style={{ flex: 1 }}>
                  <DatePicker
                    date={billDate}
                    onSelectDate={selectDateHandler}
                    formattedDate={formattedDate}
                  />
                </View>
              </InputRight>
            </FormRow>
            <FormRow>
              <LabelLeft label="Total Bill before taxes" />
              <InputRight style={{paddingRight: 15}}>
                <Text>$ {totalBill}</Text>
              </InputRight>
            </FormRow>
            <FormRow>
              <LabelLeft label="GST" />
              <InputRight style={{paddingRight: 15}}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={addGST ?  Colors.blue1 : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setAddGST((prev) => !prev)}
                  value={addGST}
                />
              </InputRight>
            </FormRow>
            <FormRow>
              <LabelLeft label="Service Charge" />
              <InputRight style={{paddingRight: 15}}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={addServiceCharge ? Colors.blue1 : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setAddServiceCharge((prev) => !prev)}
                  value={addServiceCharge}
                />
              </InputRight>
            </FormRow>
            {/* <FormRow>
              <LabelLeft label="Discount" />
              <InputRight>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={hasDiscount ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setHasDiscount((prev) => !prev)}
                  value={hasDiscount}
                />
              </InputRight>
            </FormRow> */}
            <FormRow style={{backgroundColor:Colors.blue4Rgba}}>
              <View style={{flex: 1, padding: 10}}>
                <Text style={{fontStyle:'italic', fontSize: 16, fontWeight:'bold'}}>Total Paid</Text>
              </View>
              <View style={{flex: 1, paddingVertical: 10, paddingHorizontal: 15, alignItems:'flex-end'}}>
                <Text style={{fontStyle:'italic', fontSize: 16, fontWeight:'bold'}}>$ {netBill}</Text>
              </View>
            </FormRow>
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
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
    backgroundColor: Colors.blue1,
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
    borderRadius: 30,
    zIndex: 1,
    flexDirection: "row",
  },
});

export default EnterBillDetailsScreen;
