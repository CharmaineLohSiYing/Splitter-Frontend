import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  Button,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import Input from "../../../components/UI/Input";
import Card from "../../../components/UI/Card";
import Colors from "../../../constants/Colors";
import LongButton from "../../../components/UI/LongButton";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import Screen from "../../../components/UI/Screen";
import Content from "../../../components/UI/Content";
import * as authActions from "../../../store/actions/auth";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const UpdateMobileNumberScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const userId = useSelector((state) => state.auth.userId);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      mobileNumber: props.route.params.mobileNumber,
    },
    inputValidities: {
      mobileNumber: true,
    },
    formIsValid: true,
  });

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = async () => {
    // console.log('request otp')
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://192.168.1.231:5000/auth/requestOTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            mobileNumber: formState.inputValues.mobileNumber,
          }),
        }
      );

      if (!response.ok) {
        setIsLoading(false);
        setError(await response.json());
      } else {
        setIsLoading(false);
        props.navigation.navigate("AccountOTP", { changeMobileNumber: true, mobileNumber: formState.inputValues.mobileNumber });
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  return (
    <Screen>
      <Content style={{paddingVertical:20, justifyContent: 'space-between'}}>
        <Input
          horizontal={true}
          id="mobileNumber"
          label="New Number"
          keyboardType="number-pad"
          required
          numbers
          minLength={8}
          maxLength={8}
          errorText="Please enter a valid mobile number."
          onInputChange={inputChangeHandler}
          initialValue={props.route.params.mobileNumber.toString()}
          initiallyValid={true}
        />
        <LongButton
          containerStyle={{marginBottom: 10}}
          text="Send OTP to new number"
          onPress={submitHandler}
          isLoading={isLoading}
          disabled={!formState.formIsValid}
        />
      </Content>
    </Screen>
  );
};

UpdateMobileNumberScreen.navigationOptions = {
  headerTitle: "Authenticate",
};

const styles = StyleSheet.create({
});

export default UpdateMobileNumberScreen;
