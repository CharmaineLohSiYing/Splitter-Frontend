import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useRef,
} from "react";
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
  }
  return state;
};

const AuthScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [displayError, setDisplayError] = useState(false);
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

  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const mobileNumRef = useRef(null);
  const passwordRef = useRef(null);
  const retypePasswordRef = useRef(null);

  const focusNextTextInput = (type) => {
    switch (type) {
      case "lastName":
        lastNameRef.current.focus();
        break;
      case "email":
        emailRef.current.focus();
        break;
      case "mobileNum":
        mobileNumRef.current.focus();
        break;
      case "password":
        passwordRef.current.focus();
        break;
      case "retypePassword":
        retypePasswordRef.current.focus();
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = async () => {
    setDisplayError(true);
    if (formState.formIsValid) {
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
        await dispatch(action);
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
              blurOnSubmit={false}
              required
              onSubmitEditing={() => focusNextTextInput("lastName")}
              displayError={displayError}
              touched={formState.touched["firstName"]}
              autoCapitalize="words"
              errorText="Please enter your first name."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="lastName"
              label="Last Name"
              onSubmitEditing={() => focusNextTextInput("email")}
              ref={lastNameRef}
              blurOnSubmit={false}
              required
              displayError={displayError}
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
              onSubmitEditing={() => focusNextTextInput("mobileNum")}
              ref={emailRef}
              blurOnSubmit={false}
              displayError={displayError}
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
              blurOnSubmit={false}
              displayError={displayError}
              onSubmitEditing={() => focusNextTextInput("password")}
              ref={mobileNumRef}
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
              blurOnSubmit={false}
              onSubmitEditing={() => focusNextTextInput("retypePassword")}
              ref={passwordRef}
              touched={formState.touched["password"]}
              secureTextEntry
              required
              displayError={displayError}
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a password of at least 5 characters."
              onInputChange={inputChangeHandler}
              initialValue=""
            />

            <Input
              id="retypePassword"
              label="Retype Password"
              ref={retypePasswordRef}
              blurOnSubmit={false}
              onSubmitEditing={() => retypePasswordRef.current.blur()}
              touched={formState.touched["retypePassword"]}
              retypePassword
              displayError={displayError}
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
