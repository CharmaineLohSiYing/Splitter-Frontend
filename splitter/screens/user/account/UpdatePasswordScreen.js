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
import Screen from "../../../components/UI/Screen";
import Content from "../../../components/UI/Content";
import * as authActions from "../../../store/actions/auth";
import LongButton from "../../../components/UI/LongButton";
import ErrorMessage from "../../../components/UI/ErrorMessage";
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

const UpdatePasswordScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [displayFieldError, setDisplayFieldError] = useState(false);
  const userId = useSelector((state) => state.auth.userId);
  const [flashMessage, setFlashMessage] = useState(null);

  const newPasswordRef = useRef(null);
  const retypePasswordRef = useRef(null);

  useEffect(() => {
    if (flashMessage) {
      setTimeout(() => {
        setFlashMessage(null);
      }, 3000);
    }
  }, [flashMessage]);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      oldPassword: "",
      newPassword: "",
      passwordRetype: "",
    },
    inputValidities: {
      oldPassword: false,
      newPassword: false,
      passwordRetype: false,
    },
    formIsValid: false,
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
    if (
      formState.inputValues.newPassword ===
        formState.inputValues.passwordRetype &&
      formState.formIsValid
    ) {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://192.168.1.190:5000/api/auth/changePassword",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              oldPassword: formState.inputValues.oldPassword,
              newPassword: formState.inputValues.newPassword,
            }),
          }
        );
        if (!response.ok) {
          const errMessage = await response.json();
          if (errMessage === 'Input password is incorrect'){
            setFlashMessage(errMessage);
          } else {
            setFlashMessage("Oops, something went wrong! Try again later");
          }
          setIsLoading(false);
        } else {
          props.navigation.navigate("Settings", { editPasswordSuccess: true });
        }
      } catch (err) {
        setIsLoading(false);
        setFlashMessage("Oops, something went wrong! Try again later");
      }
    }
  };

  return (
    <Screen>
      <Content style={{ paddingVertical: 20, justifyContent: "space-between" }}>
        <View>
          <Input
            autoFocus={true}
            horizontal={true}
            id="oldPassword"
            label="Current Password"
            secureTextEntry
            required
            displayError={displayFieldError}
            minLength={5}
            autoCapitalize="none"
            errorText="Please enter a valid password."
            onInputChange={inputChangeHandler}
            initialValue=""
            onSubmitEditing={() => newPasswordRef.current.focus()}
          />
          <Input
            horizontal={true}
            id="newPassword"
            label="Password"
            ref={newPasswordRef}
            onSubmitEditing={() => retypePasswordRef.current.focus()}
            secureTextEntry
            required
            displayError={displayFieldError}
            minLength={5}
            autoCapitalize="none"
            errorText="Please enter a valid password."
            onInputChange={inputChangeHandler}
            initialValue=""
          />
          <Input
            horizontal={true}
            id="passwordRetype"
            label="Confirm New Password"
            retypePassword
            ref={retypePasswordRef}
            onSubmitEditing={() => retypePasswordRef.current.blur()}
            secureTextEntry
            displayError={displayFieldError}
            required
            autoCapitalize="none"
            errorText="Please enter a valid password"
            onInputChange={inputChangeHandler}
            initialValue=""
          />
          {formState.inputValues.passwordRetype !==
            formState.inputValues.newPassword && (
            <ErrorMessage text="New passwords do not match" />
          )}
        </View>

        <LongButton
          text="Save Changes"
          onPress={submitHandler}
          isLoading={isLoading}
          containerStyle={{ marginBottom: 10 }}
        />
      </Content>
      {flashMessage && <FlashMessage text={flashMessage} type={"error"} />}
    </Screen>
  );
};

UpdatePasswordScreen.navigationOptions = {
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
  buttonContainer: {
    marginTop: 10,
  },
});

export default UpdatePasswordScreen;
