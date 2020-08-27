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
import Screen from "../../../components/UI/Screen";
import Content from "../../../components/UI/Content";
import * as authActions from "../../../store/actions/auth";
import FlashMessage from "../../../components/FlashMessage";

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
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const [displayFieldError, setDisplayFieldError] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);

  useEffect(() => {
    if (flashMessage) {
      setTimeout(() => {
        setFlashMessage(null);
      }, 3000);
    }
  }, [flashMessage]);

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

  const submitHandler = async () => {
    setDisplayFieldError(true);
    if (formState.formIsValid) {
      setIsLoading(true);
      try {
        await dispatch(authActions.updateEmail(formState.inputValues.email));
        setIsLoading(false);
        props.navigation.navigate('Settings', {editEmailSuccess: true});
      } catch (err) {
        setIsLoading(false);
        setFlashMessage("Something went wrong while updating your email address")
      }
    }
  };

  return (
    <Screen>
      <Content style={{ paddingVertical: 20, justifyContent: "space-between" }}>
        <Input
          id="email"
          autoFocus={true}
          horizontal={true}
          label="New Email"
          keyboardType="email-address"
          required
          displayError={displayFieldError}
          email
          autoCapitalize="none"
          errorText="Please enter a valid email address."
          onInputChange={inputChangeHandler}
          initialValue={props.route.params.email}
          initiallyValid={true}
        />
        <LongButton
          containerStyle={{ marginBottom: 10 }}
          text="Save Changes "
          onPress={submitHandler}
          isLoading={isLoading}
        />
      </Content>
      {flashMessage && <FlashMessage text={flashMessage} type={"error"} />}
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default UpdateEmailScreen;
