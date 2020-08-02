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

const ProgressStep = (props) => {
  const { number, title, active } = props;

  return (
    <View>
      <View
        style={{
          ...styles.container,
          backgroundColor: active ? Colors.primary : Colors.gray,
        }}
      >
        <Text style={styles.number}>{number}</Text>
      </View>
      {/* <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: "#ccc",
    alignItems: "center",
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  number: {
    color: "white",
  },
  title: {
    color: Colors.gray,
  },
});

export default ProgressStep;
