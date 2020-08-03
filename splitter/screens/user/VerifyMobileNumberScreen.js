import React, { useState, useEffect } from "react";
import {
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

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/auth";

const VerifyMobileNumberScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [inputMobileNumber, setInputMobileNumber] = useState("");
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const mobileNumberSubmitHandler = async () => {
    setError(null);
    setIsLoading(true);
    try {
        
      const response = await fetch(
        'http://192.168.1.190:5000/auth/requestOTP',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber: inputMobileNumber,
            userId,
          }),
        }
      );


      if (!response.ok) {
        const errorResData = await response.json();

        let message = "Something went wrong!";
        if (errorResData) {
          message = errorResData;
        }
        setIsLoading(false);
        setError(message);
      }
      setIsLoading(false);
      props.navigation.navigate("OTP");
    } catch (err) {
      setIsLoading(false);
      setError(err);
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
          <Text>Enter Mobile Number: </Text>
          <TextInput
            value={inputMobileNumber}
            onChangeText={setInputMobileNumber}
          />
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.blue1} />
            ) : (
              <Button
                title="Submit"
                color={Colors.blue1}
                onPress={mobileNumberSubmitHandler}
              />
            )}
          </View>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

VerifyMobileNumberScreen.navigationOptions = {
  headerTitle: "Verify Mobile Number",
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

export default VerifyMobileNumberScreen;
