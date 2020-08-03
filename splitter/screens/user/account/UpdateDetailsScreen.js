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


const UpdateDetailsScreen = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch()

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      firstName: props.route.params.firstName,
      lastName:props.route.params.lastName,
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


  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(authActions.updateDetails(formState.inputValues.firstName, formState.inputValues.lastName))
      setIsLoading(false)
      props.navigation.goBack()
    } catch (err) {
      setIsLoading(false)
      setError(err.message);
    }
  }


  return (
    <KeyboardAvoidingView
      // behavior="padding"
      keyboardVerticalOffset={0}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <Input
              id="firstName"
              label="First Name"
              required
              autoCapitalize="words"
              errorText="Please enter a valid first name."
              onInputChange={inputChangeHandler}
              initialValue={props.route.params.firstName}
              initiallyValid={true}
            />
          <Input
              id="lastName"
              label="Last Name"
              required
              autoCapitalize="words"
              errorText="Please enter a valid last name."
              onInputChange={inputChangeHandler}
              initialValue={props.route.params.lastName}
              initiallyValid={true}
            />
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.blue1} />
            ) : (
              <Button
                title="Update"
                color={Colors.blue1}
                onPress={submitHandler}
                disabled={!formState.formIsValid}
              />
            )}
          </View>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
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
  buttonContainer: {
    marginTop: 10,
  },
});

export default UpdateDetailsScreen;
