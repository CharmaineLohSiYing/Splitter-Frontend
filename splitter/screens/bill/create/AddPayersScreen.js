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
import Colors from "../../../constants/Colors";

import IndividualOrders from "../../../components/IndividualOrders";
import * as billActions from "../../../store/actions/bill";
import Header from "../../../components/AddOrdersSubSectionHeader";
import ProceedBottomButton from '../../../components/UI/ProceedBottomButton'

import { useSelector, useDispatch } from "react-redux";

const AddPayersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isEdit, setIsEdit] = useState();

  const unpaidAmount = useSelector((state) => state.bill.unpaidAmount);

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
    props.navigation.navigate("Calculator", {
      updatePaidAmount: true,
      userId: id,
      unpaidAmount,
    });
  };

  const createBillHandler = useCallback(async () => {
    if (unpaidAmount != 0.0) {
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
  }, [dispatch, props.navigation, isEdit]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Header
          header={"Unpaid amount: $" + unpaidAmount}
          style={{ alignItems: "center", borderWidth: 2, borderColor:Colors.blue1 }}
        />
        <View style={styles.flatlistContainer}>
          <IndividualOrders payers updatePaidAmount={updatePaidAmountHandler} />
        </View>
        <View>
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.blue1} />
          ) : (
            <ProceedBottomButton proceedHandler={createBillHandler}/> 
          )}
        </View>
       
      </View>

    </SafeAreaView>
  );
};

AddPayersScreen.navigationOptions = {
  headerTitle: "Add Orders",
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: '60%',
    borderWidth: 1,
    borderColor: Colors.blue2,
    marginVertical: 10,
    padding: 10,
  },
  screen:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  flatlistContainer:{
    flex: 1
  }
});
export default AddPayersScreen;
