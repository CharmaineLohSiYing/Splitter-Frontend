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
import { useSelector, useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import * as authActions from "../../../store/actions/auth"


import Card from "../../../components/UI/Card";

const SettingsScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user)
  const options = (text, screenName) => {
    var param = {};
    switch (screenName) {
      case "UpdateDetails":
        param = {
          firstName: user.firstName,
          lastName: user.lastName
        }
        break;
      case "UpdateEmail":
        param = {
          email: user.email,
        };
        break;
      case "UpdateMobileNumber":
        param = {
          mobileNumber: user.mobileNumber,
        };
        break;
      default:
        param = {};
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
        <TouchableOpacity onPress={() => {dispatch(authActions.logout())}} style={{height: 50, width: '100%'}}>
          <Text>Log Out</Text>
        </TouchableOpacity>
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
