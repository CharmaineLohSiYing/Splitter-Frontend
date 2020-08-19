import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
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

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import Content from "../../components/UI/Content";
import Screen from "../../components/UI/Screen";
import LongButton from "../../components/UI/LongButton"
import * as authActions from "../../store/actions/auth";


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


const VerifyMobileNumberScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const userId = useSelector((state) => state.auth.userId);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      mobileNumber: "",
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

  const mobileNumberSubmitHandler = async () => {
    setError(null);
    setIsLoading(true);
    try {
        
      const response = await fetch(
        'http://192.168.1.190:5000/auth/requestOTP',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber: formState.inputValues.mobileNumber,
            userId,
          }),
        }
      );


      if (!response.ok) {
        const errorResData = await response.json();

        let message = "Something went wrong!";
        if (errorResData) {
          message = errorResData;
        }
        setIsLoading(false);
        setError(message);
      }
      setIsLoading(false);
      props.navigation.navigate("OTP");
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  };

  return (
    <Screen>
      <Content style={{ paddingTop: 100, paddingBottom: 20, justifyContent: "space-between" }}>
        <View>
          <Text style={styles.row}>Enter mobile number</Text>
          <Input
            horizontal={true}
            id="mobileNumber"
            keyboardType="number-pad"
            required
            numbers
            minLength={8}
            maxLength={8}
            errorText="Please enter a valid mobile number."
            onInputChange={inputChangeHandler}
            initialValue={""}
            initiallyValid={false}
          />
        </View>

        <LongButton
          containerStyle={{ marginBottom: 10 }}
          text="Verify"
          onPress={mobileNumberSubmitHandler}
          isLoading={isLoading}
          // disabled={!formState.formIsValid}
        />
      </Content>
    </Screen>
  );
};

VerifyMobileNumberScreen.navigationOptions = {
  headerTitle: "Verify Mobile Number",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default VerifyMobileNumberScreen;
