import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Badge } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const SelectedContactDisplay = (props) => {
  const handleSelect = () => {
    props.onPress(props.mobileNumber);
  };

  return (
    <TouchableOpacity style={styles.nameContainer} onPress={handleSelect}>
      <Text style={styles.name}>{props.name}</Text>
      <View style={styles.iconContainer}>
        <Ionicons name="md-close" size={10} color="white" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: "row",
    borderRadius: 15,
    backgroundColor: "rgba(221, 235, 255, 0.62)",
    height: 30,
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 15,
    width: 15,
    borderRadius: 7.5,
    backgroundColor: Colors.blue2,
  },
  name: {
    color: Colors.blue2,
    paddingRight: 5,
  },
});

export default SelectedContactDisplay;
