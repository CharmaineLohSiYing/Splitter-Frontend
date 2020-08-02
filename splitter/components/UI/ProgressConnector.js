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
import Colors from "../../constants/Colors";

const ProgressConnector = (props) => {
    const {active} = props;
  return (
    <View style={{ ...styles.connector, backgroundColor: active ? Colors.primary : Colors.gray }}>
    </View>
  );
};

const styles = StyleSheet.create({
  connector: {
    width: 30,
    height: 2,
    backgroundColor: "#ccc",
  },
});

export default ProgressConnector;
