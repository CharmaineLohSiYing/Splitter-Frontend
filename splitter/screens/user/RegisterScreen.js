import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
} from "react-native";
import { useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/auth";
import Content from "../../components/UI/Content";
import LongButton from "../../components/UI/LongButton";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
const SET_ALL_TOUCHED = "SET_ALL_TOUCHED";

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
    const updatedTouched = {
      ...state.touched,
      [action.input]: true,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
      touched: updatedTouched,
    };
  } else if (action.type === SET_ALL_TOUCHED) {
    const updatedTouched = { ...state.touched };
    for (const key in updatedTouched) {
      updatedTouched[key] = true;
    }
    return {
      ...state,
      touched: updatedTouched,
    };
  }
  return state;
};

const AuthScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      retypePassword: "",
      mobileNumber: "",
    },
    inputValidities: {
      firstName: false,
      lastName: false,
      mobileNumber: false,
      email: false,
      password: false,
      retypePassword: false,
    },
    touched: {
      firstName: false,
      lastName: false,
      mobileNumber: false,
      email: false,
      password: false,
      retypePassword: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = () => {
    if (!formState.formIsValid) {
      dispatchFormState({
        type: SET_ALL_TOUCHED,
      });
    } else {
      if (
        formState.inputValues.password !== formState.inputValues.retypePassword
      ) {
        setError("Passwords do not match");
        return;
      }

      setError(null);
      setIsLoading(true);

      let action;
      action = authActions.signup(
        formState.inputValues.firstName,
        formState.inputValues.lastName,
        formState.inputValues.email,
        formState.inputValues.password,
        formState.inputValues.mobileNumber
      );

      try {
        dispatch(action);
        setIsLoading(false);
        props.navigation.navigate("OTP", {
          mobileNumber: formState.inputValues.mobileNumber,
        });
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }
  };

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

  return (
    <KeyboardAwareScrollView
      // behavior="padding"
      style={styles.screen}
      contentContainerStyle={{ alignItems: "center" }}
      keyboardShouldPersistTaps={"always"}
    >
      <Content
        style={{
          width: "80%",
          paddingTop: 40,
          marginTop: 50,
          justifyContent: "space-between",
        }}
      >
        <View>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Hello there.</Text>
          </View>
          <View>
            <Input
              autoFocus={true}
              id="firstName"
              label="First Name"
              required
              touched={formState.touched["firstName"]}
              autoCapitalize="words"
              errorText="Please enter your first name."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="lastName"
              label="Last Name"
              required
              autoCapitalize="words"
              touched={formState.touched["lastName"]}
              errorText="Please enter your last name."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              touched={formState.touched["email"]}
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="mobileNumber"
              label="Mobile Number"
              keyboardType="number-pad"
              required
              numbers
              touched={formState.touched["mobileNumber"]}
              minLength={8}
              maxLength={8}
              errorText="Please enter a valid mobile number."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              touched={formState.touched["password"]}
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a password of at least 5 characters."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="retypePassword"
              label="Retype Password"
              touched={formState.touched["retypePassword"]}
              retypePassword
              secureTextEntry
              required
              autoCapitalize="none"
              errorText="Please enter a password of at least 5 characters."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
          </View>
        </View>
        <LongButton
          isLoading={isLoading}
          text="Next"
          onPress={authHandler}
          containerStyle={{ marginTop: 30, marginBottom: 20 }}
        />
      </Content>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // paddingTop: 40,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: Colors.blue1,
    fontStyle: "italic",
    fontWeight: "bold",
    fontSize: 24,
  },
});

export default AuthScreen;
