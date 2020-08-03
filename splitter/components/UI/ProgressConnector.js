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
    const {active, width} = props;
    console.log(active, width)
  return (
    <View style={{ ...styles.connector, backgroundColor: active ? Colors.primary : Colors.gray, width: width }}>
    </View>
  );
};

const styles = StyleSheet.create({
  connector: {
    height: 2,
  },
});

export default ProgressConnector;
