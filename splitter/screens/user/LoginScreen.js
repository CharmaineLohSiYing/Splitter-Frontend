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
  const dispatch = useDispatch();

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
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = async () => {
    let action;

    action = authActions.login(
      formState.inputValues.email,
      formState.inputValues.password
    );

    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
    } catch (err) {
      // console.log('catch error', err)
      setIsLoading(false);
      if (err.message === "NOT_VERIFIED") {
        return props.navigation.navigate("Verify");
      } else {
        setError(err.message);
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
    <KeyboardAvoidingView
      // behavior="padding"
      keyboardVerticalOffset={0}
      style={styles.screen}
    >
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
        style={styles.gradient}
      >
        <Content style={{ justifyContent: "space-between", width: "80%" }}>
          <View>
            <View style={styles.logoContainer}>
              <View style={styles.logo}></View>
            </View>
            <View style={styles.loginForm}>
              <View style={styles.field}>
                <Ionicons
                  name="md-phone-portrait"
                  size={18}
                  color={Colors.blue1}
                  style={{ width: "10%" }}
                />
                <Input
                  style={{ flex: 1 }}
                  login
                  id="email"
                  label="E-Mail"
                  keyboardType="email-address"
                  required
                  email
                  autoCapitalize="none"
                  errorText="Please enter a valid email address."
                  onInputChange={inputChangeHandler}
                  initialValue=""
                />
              </View>
              <View style={styles.field}>
                <Ionicons
                  name="md-key"
                  size={18}
                  color={Colors.blue1}
                  style={{ width: "10%" }}
                />
                <Input
                  style={{ flex: 1 }}
                  login
                  id="password"
                  label="Password"
                  keyboardType="default"
                  secureTextEntry
                  required
                  minLength={5}
                  autoCapitalize="none"
                  errorText="Please enter a valid password."
                  onInputChange={inputChangeHandler}
                  initialValue=""
                />
              </View>
              <View style={{ alignItems: "center"}}>
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
                <TouchableOpacity style={{marginTop: 10}} onPress={()=> {}}>
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
      </LinearGradient>
    </KeyboardAvoidingView> 
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
    marginVertical: 10,
  },
  screen: {
    flex: 1,
  },
  gradient: {
    paddingTop: 120,
    flex: 1,
    alignItems: "center",
    paddingBottom: 50,
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
});

export default LoginScreen;
