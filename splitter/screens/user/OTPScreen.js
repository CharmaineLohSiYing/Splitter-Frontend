import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/auth";
import Content from "../../components/UI/Content";
import Screen from "../../components/UI/Screen";
import LongButton from "../../components/UI/LongButton"

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

const OTPScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [displayError, setdisplayError] = useState(false)
  const dispatch = useDispatch();

  const mobileNumber = props.route.params.mobileNumber;
  const userId = useSelector((state) => state.auth.userId);

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
    if (formState.formIsValid){
      let action = authActions.verifyOTP(formState.inputValues.otp, userId);
      setError(null);
      setIsLoading(true);
      try {
        await dispatch(action);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    } else {
      console.log('displayError')
      setdisplayError(true)
    }
     
  }
    
   

  return (
    <Screen>
      <Content style={{ paddingTop: 100, paddingBottom: 20, justifyContent: "space-between" }}>
        <View>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Almost there!</Text>
          </View>
          <Text style={styles.row}>An OTP has been sent to {mobileNumber}.</Text>
          <Text style={styles.row}>Enter OTP</Text>
          <Input
            horizontal={true}
            id="otp"
            keyboardType="number-pad"
            displayError={displayError}
            required
            numbers
            minLength={6}
            maxLength={6}
            errorText="Please enter a valid 6-digit otp."
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

OTPScreen.navigationOptions = {
  headerTitle: "Authenticate",
};

const styles = StyleSheet.create({
  row: {
    paddingVertical: 10
  },
  header:{
    alignItems:'center',
    justifyContent:'center',
    marginBottom: 20
  },
  headerTitle:{
    color: Colors.blue1,
    fontStyle:'italic',
    fontWeight:'bold',
    fontSize: 24
  }
});

export default OTPScreen;
