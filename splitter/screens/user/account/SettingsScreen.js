import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
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

const SettingsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [inputOTP, setInputOTP] = useState("");
  const [user, setUser] = useState({});
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.userId);

  const loadUser = useCallback(async () => {
    setError(null);
    try {
      console.log("fetching user");
      const response = await fetch("http://192.168.1.190:5000/user/" + userId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await response.json()
      setUser(resData.user)
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const listenerCreated = props.navigation.addListener("focus", loadUser);

    return () => {
      // calling this function will remove the listener
      listenerCreated();
    };
  }, [loadUser]);

  useEffect(() => {
    setIsLoading(true);
    loadUser().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadUser]);

  const options = (text, screenName) => {

    var param = {}; 
    switch (screenName) {
      case 'UpdateDetails':
        param['firstName'] = user.firstName;
        param['lastName'] = user.lastName
        break;
      case 'UpdateEmail':
        param = {
          email: user.email
        }
        break;
      case 'UpdateMobileNumber':
        param = {
          mobileNumber: user.mobileNumber
        }
        break;
      default:
        param = {}
        break;
    }

    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate(screenName, param)}
        style={styles.buttonContainer}
      >
        <Card style={styles.authContainer}>
          <View>
            <Text>{text}</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      // behavior="padding"
      keyboardVerticalOffset={0}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Text>Account Settings</Text>
        {options("Update Details", "UpdateDetails")}
        {options("Update Password", "UpdatePassword")}
        {options("Update Mobile Number", "UpdateMobileNumber")}
        {options("Update Email", "UpdateEmail")}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

SettingsScreen.navigationOptions = {
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
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {
    width: "90%",
    marginTop: 10,
    justifyContent: "center",
  },
});

export default SettingsScreen;
