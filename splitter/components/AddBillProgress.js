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
import ProgressStep from "./UI/ProgressStep";
import ProgressConnector from "./UI/ProgressConnector";

const AddBillProgress = (props) => {
  const progress = props.progress;

  return (
    <View style={styles.container}>
      <ProgressStep number={1} active={progress >= 1 ? true : false} title="Attendees"/>
      <ProgressConnector active={progress >= 2 ? true : false} />
      <ProgressStep number={2} active={progress >= 2 ? true : false} title="Orders"/>
      <ProgressConnector active={progress >= 3 ? true : false} />
      <ProgressStep number={3} active={progress >= 3 ? true : false} title="Bill Details"/>
      <ProgressConnector active={progress >= 4 ? true : false} />
      <ProgressStep number={4} active={progress >= 4 ? true : false} title="Payment"/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    height: 60,
    borderColor: "#ccc",
    alignItems: "center",
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default AddBillProgress;
