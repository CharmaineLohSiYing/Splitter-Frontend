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


const UpdatePasswordScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const userId = useSelector((state) => state.auth.userId);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      oldPassword: "",
      newPassword:"",
      passwordRetype:"",
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


  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = async () => {

    if (formState.inputValues.newPassword !== formState.inputValues.passwordRetype){
      setError('New passwords do not match')
    } else {
      setError(null);
      setIsLoading(true);
      try {
        const response = await fetch("http://192.168.1.190:5000/auth/changePassword", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              oldPassword: formState.inputValues.oldPassword,
              newPassword: formState.inputValues.newPassword
            }),
          });
        if (!response.ok) {
          setError(await response.json());
          setIsLoading(false);
        } else {
          props.navigation.goBack();
        }
      } catch (err) {
        setError(err.message);
      }
    }
    
  };

  return (
    <KeyboardAvoidingView
      // behavior="padding"
      keyboardVerticalOffset={0}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
        <Input
              id="oldPassword"
              label="Current Password"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
              initiallyValid={true}
              
            />
        <Input
              id="newPassword"
              label="Password"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
              initiallyValid={true}
            />
            <Input
              id="passwordRetype"
              label="Retype Password"
              retypePassword
              secureTextEntry
              required
              autoCapitalize="none"
              errorText="Please enter a valid password"
              onInputChange={inputChangeHandler}
              initialValue=""
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
