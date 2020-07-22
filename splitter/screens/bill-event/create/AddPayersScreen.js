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
import Colors from '../../../constants/Colors'

import IndividualOrders from "../../../components/IndividualOrders";
import * as eventActions from "../../../store/actions/bill-event";

import { useSelector, useDispatch } from "react-redux";

const AddPayersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isEdit, setIsEdit] = useState();

  const unpaidAmount = useSelector(state => state.billEvent.unpaidAmount)

  useEffect(() => {
    if (props.route.params){
      if (props.route.params.isEdit){
        setIsEdit(true)
      }
    }

  }, [props.route.params])

  

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
      unpaidAmount
    });
  };

  const createEventHandler = useCallback(async () => {
    if (unpaidAmount != 0.00){
      setError('Numbers do not tally')
    } else {
      setError(null)
      setIsLoading(true);
      try {
        console.log('before dispatch')
        console.log('isedit', isEdit)
        if (isEdit){
          await dispatch(eventActions.editEvent());
        } else {
          await dispatch(eventActions.createEvent());
        }        
        console.log('after dispatch')
        props.navigation.navigate("Events");
        
      } catch (err) {
        
        setError('Error');
        console.log('error caught')
      }
      setIsLoading(false);
      
    }
    
  }, [dispatch, props.navigation, isEdit]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Who paid for the bill?</Text>
      <Text>Unpaid amount: ${unpaidAmount}</Text>
      <IndividualOrders payers updatePaidAmount={updatePaidAmountHandler} />
      {isLoading ? (
        <ActivityIndicator size="small" color={Colors.primary} />
      ) : (
        <Button title="Proceed" onPress={createEventHandler} />
      )}
    </SafeAreaView>
  );
};

AddPayersScreen.navigationOptions = {
  headerTitle: "Add Orders",
};

export default AddPayersScreen;
