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
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  Button,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

import Input from "../../components/UI/Input";
import Content from "../../components/UI/Content";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/auth";
import LongButton from "../../components/UI/LongButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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

const LoginScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [displayErrors, setDisplayErrors] = useState(false);
  const dispatch = useDispatch();

  const passwordRef = useRef(null);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      if (error === "INVALID_CREDENTIALS") {
        Alert.alert(
          "Incorrect password",
          "The password you entered for " +
            formState.inputValues.email +
            " is incorrect.",
          [{ text: "Try Again" }]
        );
      } else {
        Alert.alert("Oh no", "Something went wrong!", [{ text: "Okay" }]);
      }
    }
  }, [error]);

  const authHandler = async () => {
    setDisplayErrors(true);
    if (formState.formIsValid) {
      setError(null);
      setIsLoading(true);
      try {
        await dispatch(
          authActions.login(
            formState.inputValues.email,
            formState.inputValues.password
          )
        );
      } catch (err) {
        // console.log('catch error', err)
        setIsLoading(false);
        if (err.message === "NOT_VERIFIED") {
          return props.navigation.navigate("Verify");
        } else {
          setError(err.message);
        }
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
    <LinearGradient
      colors={[
        "#3E7DD8",
        "#538BDC",
        "#81ABE6",
        "#90B6E9",
        "#A6C5EE",
        "#BCD3F2",
        "#C8DBF4",
        "#D5E3F7",
        "#fff",
      ]}
      style={styles.screen}
    >
      <KeyboardAwareScrollView
        // behavior="padding"
        keyboardVerticalOffset={0}
        contentContainerStyle={{flexGrow: 1}}
      >
        <Content style={{ justifyContent: "space-between", width: "80%", alignSelf: 'center', paddingTop: 120, paddingBottom: 50}}>
          <View>
            <View style={styles.logoContainer}>
              <View style={styles.logo}></View>
            </View>
            <View style={styles.loginForm}>
              <View
                style={[
                  styles.field,
                  {
                    borderWidth:
                      !formState.inputValidities["email"] && displayErrors
                        ? 2
                        : 0,
                  },
                ]}
              >
                <Ionicons
                  name="md-mail"
                  size={18}
                  color={
                    !formState.inputValidities["email"] && displayErrors
                      ? Colors.red1
                      : Colors.blue1
                  }
                  style={{ width: "10%" }}
                />
                <Input
                  style={{ flex: 1 }}
                  login
                  id="email"
                  label="E-Mail"
                  keyboardType="email-address"
                  displayErrors={displayErrors}
                  onSubmitEditing={() => passwordRef.current.focus()}
                  required
                  email
                  autoCapitalize="none"
                  // errorText="Please enter a valid email address."
                  onInputChange={inputChangeHandler}
                  initialValue=""
                />
              </View>
              {!formState.inputValidities["email"] && displayErrors && (
                <Text style={styles.errorText}>
                  Please enter a valid email address.
                </Text>
              )}
              <View
                style={[
                  styles.field,
                  {
                    borderWidth:
                      !formState.inputValidities["password"] && displayErrors
                        ? 2
                        : 0,
                  },
                ]}
              >
                <Ionicons
                  name="md-key"
                  size={18}
                  color={
                    !formState.inputValidities["password"] && displayErrors
                      ? Colors.red1
                      : Colors.blue1
                  }
                  style={{ width: "10%" }}
                />
                <Input
                  style={{ flex: 1 }}
                  login
                  ref={passwordRef}
                  id="password"
                  label="Password"
                  onSubmitEditing={() => passwordRef.current.blur()}
                  displayErrors={displayErrors}
                  keyboardType="default"
                  secureTextEntry={!showPassword}
                  required
                  autoCapitalize="none"
                  onInputChange={inputChangeHandler}
                  initialValue=""
                />
                <Ionicons
                  name={showPassword ? "md-eye" : "md-eye-off"}
                  onPress={() => {
                    setShowPassword((prev) => !prev);
                  }}
                  size={18}
                  color="black"
                  style={{ width: "10%" }}
                />
              </View>
              {!formState.inputValidities["password"] && displayErrors && (
                <Text style={styles.errorText}>Please enter a password.</Text>
              )}
              <View style={{ alignItems: "center" }}>
                <LongButton
                  isLoading={isLoading}
                  onPress={authHandler}
                  text="LOG IN"
                  containerStyle={{
                    backgroundColor: Colors.blue1,
                    width: "100%",
                    borderRadius: 20,
                  }}
                  textStyle={{ color: "white" }}
                />
                <TouchableOpacity style={{ marginTop: 10 }} onPress={() => {}}>
                  <Text>Forgot your password?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              props.navigation.navigate("Register");
            }}
          >
            <Text style={{ color: Colors.blue1, paddingRight: 10 }}>
              Register for a new account
            </Text>
            <Ionicons name="md-arrow-forward" size={18} color={Colors.blue1} />
          </TouchableOpacity>
        </Content>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

LoginScreen.navigationOptions = {
  headerTitle: "Authenticate",
};

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    height: 40,
    paddingLeft: 20,
    paddingRight: 10,
    marginVertical: 10,
    borderColor: Colors.red1,
  },
  screen: {
    flex: 1,
  },
  gradient: {
    // paddingTop: 120,
    // flex: 1,
    // alignItems: "center",
    // paddingBottom: 50,
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 600,
    padding: 20,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: 150,
    width: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: Colors.blue4,
  },
  loginForm: {
    marginTop: 40,
  },
  errorText: {
    fontSize: 13,
    color: Colors.red1,
    marginTop: -10,
    paddingLeft: 20,
    marginBottom: 10,
  },
});

export default LoginScreen;
