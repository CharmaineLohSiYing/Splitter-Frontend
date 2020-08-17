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

const UpdateEmailScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: props.route.params.email,
    },
    inputValidities: {
      email: true,
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
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(authActions.updateEmail(formState.inputValues.email));
      setIsLoading(false);
      props.navigation.goBack();
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  return (
    <Screen>
      <Content style={{ paddingVertical: 20, justifyContent: "space-between" }}>
        <Input
          id="email"
          horizontal={true}
          label="New Email"
          keyboardType="email-address"
          required
          email
          autoCapitalize="none"
          errorText="Please enter a valid email address."
          onInputChange={inputChangeHandler}
          initialValue={props.route.params.email}
          initiallyValid={true}
        />
        <LongButton
          containerStyle={{marginBottom: 10}}
          text="Save Changes "
          onPress={submitHandler}
          isLoading={isLoading}
          disabled={!formState.formIsValid}
        />
      </Content>
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default UpdateEmailScreen;
