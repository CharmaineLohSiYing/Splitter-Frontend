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
import * as authActions from "../../../store/actions/auth";
import Screen from "../../../components/UI/Screen";
import AvatarName from "../../../components/AvatarName";
import FlashMessage from "../../../components/FlashMessage";

import Card from "../../../components/UI/Card";
import Avatar from "../../../components/Avatar";
import Content from "../../../components/UI/Content";
import Colors from "../../../constants/Colors";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import LongButton from "../../../components/UI/LongButton";

const SettingsScreen = (props) => {
  const [flashMessage, setFlashMessage] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const options = (text, screenName) => {
    var param = {};
    switch (screenName) {
      case "UpdateDetails":
        param = {
          firstName: user.firstName,
          lastName: user.lastName,
        };
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

    useEffect(() => {
      if (flashMessage) {
        setTimeout(() => {
          setFlashMessage(null);
        }, 3000);
      }
    }, [flashMessage]);

    useEffect(() => {
      if (props.route.params) {
        const {
          editDetailsSuccess,
          editEmailSuccess,
          editMobileNumberSuccess,
          editPasswordSuccess,
        } = props.route.params;
        if (editDetailsSuccess) {
          setFlashMessage("Account details have been updated successfully");
        } else if (editEmailSuccess) {
          setFlashMessage("Your email address has been updated successfully");
        } else if (editMobileNumberSuccess) {
          setFlashMessage("Your mobile number has been updated successfully");
        } else if (editPasswordSuccess) {
          setFlashMessage("Your password has been updated successfully");
        }
      }
    }, [props.route.params]);

    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate(screenName, param)}
        style={styles.buttonContainer}
      >
        <View style={styles.optionContainer}>
          <Ionicons
            name="md-person"
            size={22}
            color="black"
            style={{ flex: 1 }}
          />
          <Text style={styles.nameText}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Screen
      // behavior="padding"
      keyboardVerticalOffset={0}
      style={styles.screen}
    >
      <Content>
        <AvatarName
          name={user.firstName + " " + user.lastName}
          style={{ padding: 10, width: "100%", marginTop: 10 }}
          avatarContainerStyle={{ flex: 1 }}
          textStyle={{
            fontStyle: "italic",
            fontWeight: "bold",
            fontSize: 20,
            flex: 4,
          }}
        />
        {options("Update Account Details", "UpdateDetails")}
        {options("Change Password", "UpdatePassword")}
        {options("Change Mobile Number", "UpdateMobileNumber")}
        {options("Change Email Address", "UpdateEmail")}
        <LongButton
          onPress={() => {
            dispatch(authActions.logout());
          }}
          text="Log Out"
        />
      </Content>
      {flashMessage && <FlashMessage text={flashMessage} type={"success"} />}
    </Screen>
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
    marginTop: 10,
    justifyContent: "center",
  },
  optionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray3,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  nameText: {
    flex: 4,
  },
});

export default SettingsScreen;
