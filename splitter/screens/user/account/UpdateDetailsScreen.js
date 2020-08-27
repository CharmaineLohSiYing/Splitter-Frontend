import React, { useState, useEffect, useReducer, useCallback, useRef } from "react";
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
import * as authActions from "../../../store/actions/auth";
import Screen from "../../../components/UI/Screen";
import Content from "../../../components/UI/Content";
import LongButton from "../../../components/UI/LongButton";
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

const UpdateDetailsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);
  const [displayFieldError, setDisplayFieldError] = useState(false);

  const lastNameRef = useRef(null);

  useEffect(() => {
    if (flashMessage) {
      setTimeout(() => {
        setFlashMessage(null);
      }, 3000);
    }
  }, [flashMessage]);

  const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      firstName: props.route.params.firstName,
      lastName: props.route.params.lastName,
    },
    inputValidities: {
      firstName: true,
      lastName: true,
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
    if (formState.formIsValid){
    setIsLoading(true);
    try {
      await dispatch(
        authActions.updateDetails(
          formState.inputValues.firstName,
          formState.inputValues.lastName
        )
      );
      setIsLoading(false);
      props.navigation.navigate('Settings', {editDetailsSuccess: true});
    } catch (err) {
      setIsLoading(false);
      setFlashMessage("Something went wrong while updating your details")
    }
    }
    
  };

  return (
    <Screen
      // behavior="padding"
      keyboardVerticalOffset={0}
      style={styles.screen}
    >
      <Content style={{ justifyContent: "space-between", paddingVertical: 20 }}>
        <View>
          <Input
            horizontal={true}
            id="firstName"
            label="First Name"
            required
            displayError={displayFieldError}
            autoCapitalize="words"
            errorText="Please enter a valid first name."
            onInputChange={inputChangeHandler}
            initialValue={props.route.params.firstName}
            initiallyValid={true}
            onSubmitEditing={() => lastNameRef.current.focus()}
          />
          <Input
            horizontal={true}
            id="lastName"
            label="Last Name"
            required
            ref={lastNameRef}
            onSubmitEditing={() => lastNameRef.current.blur()}
            displayError={displayFieldError}
            autoCapitalize="words"
            errorText="Please enter a valid last name."
            onInputChange={inputChangeHandler}
            initialValue={props.route.params.lastName}
            initiallyValid={true}
          />
        </View>

        <LongButton
          text="Save Changes"
          onPress={submitHandler}
          isLoading={isLoading}
          containerStyle={{ marginBottom: 10 }}
        />
      </Content>
      {flashMessage && <FlashMessage text={flashMessage} type={"error"}/>}
    </Screen>
  );
};

UpdateDetailsScreen.navigationOptions = {
  headerTitle: "Authenticate",
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
});

export default UpdateDetailsScreen;
