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

const AccountOTPScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  // const [inputOTP, setInputOTP] = useState("");
  const dispatch = useDispatch();

  const mobileNumber = props.route.params.mobileNumber;

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      otp: "",
    },
    inputValidities: {
      otp: true,
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

  const otpSubmitHandler = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(authActions.updateMobileNumber(formState.inputValues.otp));
      setIsLoading(false);
      props.navigation.navigate("Settings");
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  return (
    <Screen>
      <Content style={{ paddingVertical: 20, justifyContent: "space-between" }}>
        <View>
          <Text style={styles.row}>An OTP has been sent to {mobileNumber}.</Text>
          <Text style={styles.row}>Enter OTP</Text>
          <Input
            horizontal={true}
            id="otp"
            keyboardType="number-pad"
            required
            numbers
            minLength={6}
            maxLength={6}
            errorText="Please enter a valid otp."
            onInputChange={inputChangeHandler}
            initialValue={""}
            initiallyValid={false}
          />
        </View>

        <LongButton
          containerStyle={{ marginBottom: 10 }}
          text="Verify"
          onPress={otpSubmitHandler}
          isLoading={isLoading}
          // disabled={!formState.formIsValid}
        />
      </Content>
    </Screen>
  );
};

AccountOTPScreen.navigationOptions = {
  headerTitle: "Authenticate",
};

const styles = StyleSheet.create({
  row: {
    paddingVertical: 10
  }
});

export default AccountOTPScreen;
