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
import AddOrdersHeader from "./AddOrdersSubSectionHeader";
import Colors from "../constants/Colors";
import { Layout, Radio, CheckBox } from "@ui-kitten/components";

import * as eventActions from "../store/actions/bill-event";

const BillInformation = (props) => {
  console.log('billinformation')
  const selectDateHandler = (date) => {
    props.selectDateHandler(date);
  };

  const discountAmountHandler = (amount) => {
    var currencyRegex = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;
    if (currencyRegex.test(amount) || amount === "") {
      props.onChangeDiscountAmount(amount);
      console.log('amount', amount)
    } else {
      console.log('else', amount)
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AddOrdersHeader
        header="Bill Information"
        subtitle={props.totalBill}
        style={{ backgroundColor: Colors.lightBlue, alignItems: "center" }}
      />
      <View style={styles.contentContainer}>
        <FormRow>
          <LabelLeft label="Event Name" />
          <InputRight>
            <TextInput
              style={{ textAlign: "right" }}
              value={props.eventName}
              onChangeText={() => props.onChangeEventName()}
              placeholder="Optional"
            />
          </InputRight>
        </FormRow>
        <FormRow>
          <LabelLeft label="Event Date" />
          <InputRight>
            <DatePicker
              date={props.eventDate}
              onSelectDate={selectDateHandler}
              formattedDate={props.formattedDate}
            />
          </InputRight>
        </FormRow>
        <FormRow style={{ backgroundColor: Colors.lightBlue, height: 40 }}>
          <LabelLeft
            label={"Add calculations to total bill ($" + props.totalBill + ")"}
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
                checked={props.addGST}
                onChange={props.onChangeGST}
              >
                GST
              </CheckBox>
              <CheckBox
                style={styles.radio}
                checked={props.addServiceCharge}
                onChange={props.onChangeServiceCharge}
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
                checked={props.discountType === "NONE"}
                onChange={() => props.onChangeDiscountType("NONE")}
              >
                None
              </Radio>
              <Radio
                style={styles.radio}
                checked={props.discountType === "PERCENTAGE"}
                onChange={() => props.onChangeDiscountType("PERCENTAGE")}
              >
                Percentage
              </Radio>
              <Radio
                style={styles.radio}
                checked={props.discountType === "ABSOLUTE"}
                onChange={() => props.onChangeDiscountType("ABSOLUTE")}
              >
                Absolute Value
              </Radio>
            </Layout>
          </InputRight>
        </FormRow>
        {props.discountType != "NONE" && (
          <FormRow>
            <LabelLeft
              label={
                props.discountType == "ABSOLUTE"
                  ? "Discount Amount ($)"
                  : "Discount Amount (%)"
              }
            />
            <InputRight>
              {/* <CurrencyInput
                placeholder="0.00"
                style={{ textAlign: "right" }}
                value={props.discountAmount}
                onChangeValue={discountAmountHandler}
              /> */}
              <TextInput
                placeholder="0.00"
                style={{ textAlign: "right", flex: 1 }}
                keyboardType="decimal-pad"
                value={props.discountAmount}
                onChangeText={() => props.onChangeDiscountAmount()}
              ></TextInput>
            </InputRight>
          </FormRow>
        )}
      </View>
    </ScrollView>
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
    left: 5,
    justifyContent: "center",
    width: "100%",
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingBottom: 5,
  },
  radio: {
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

export default BillInformation;
