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
import * as authActions from '../../../store/actions/auth'


const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const AccountOTPScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [inputOTP, setInputOTP] = useState("");
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);


  const otpSubmitHandler = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(authActions.updateMobileNumber(inputOTP))
      setIsLoading(false)
      props.navigation.navigate('Settings')
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
          <Text>Enter OTP: </Text>
          <TextInput value={inputOTP} onChangeText={setInputOTP} />
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Button
                title="Verify OTP"
                color={Colors.primary}
                onPress={otpSubmitHandler}
              />
            )}
          </View>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AccountOTPScreen.navigationOptions = {
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

export default AccountOTPScreen;
