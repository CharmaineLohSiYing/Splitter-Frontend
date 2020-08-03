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
    <View style={styles.container}>
      <View
        style={{
          ...styles.step,
          ...props.style,
          backgroundColor: active ? Colors.blue1 : Colors.lightGray,
        }}
      >
        <Text style={styles.number}>{number}</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  step: {
    alignItems: "center",
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  number: {
    color: "white",
  },
  title: {
    color: Colors.lightGray,
    fontSize: 10
  },
  titleContainer:{
    paddingTop: 5
  },
  container:{
    alignItems:'center'
  }
});

export default ProgressStep;
