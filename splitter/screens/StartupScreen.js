import React, { useEffect } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
  Text,
} from "react-native";
import { useDispatch } from "react-redux";

import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";
import * as Contacts from "expo-contacts";
import { matchUsersWithContacts } from "../utils/initialiseContacts";

const StartupScreen = (props) => {
  const dispatch = useDispatch();
  console.log("startup screen");

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        dispatch(authActions.setDidTryAutoLogin());
        return;
      }
      const transformedData = JSON.parse(userData);
      const {
        token,
        userId,
        accessTokenExpiration,
        firstName,
        lastName,
        email,
        mobileNumber,
      } = transformedData;
      const expirationDate = new Date(accessTokenExpiration);
      console.log('token expiration date', expirationDate)

      if (expirationDate <= new Date() || !token || !userId) {
        dispatch(authActions.setDidTryAutoLogin());
        return;
      }

      const expirationTime = expirationDate.getTime() - new Date().getTime();
      const user = {
        firstName,
        lastName,
        email,
        mobileNumber,
      };
      dispatch(authActions.authenticate(userId, token, user));
    };
    setTimeout(() => {
      tryLogin();
    }, 2000);
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>SPLITTER</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.blue4,
  },
  text: {
    letterSpacing: 5,
    fontSize: 25,
    color: Colors.blue1,
    fontWeight:'bold'
  },
});

export default StartupScreen;
