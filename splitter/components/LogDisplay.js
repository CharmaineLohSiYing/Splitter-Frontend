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
import Colors from "../constants/Colors"

const ViewLogDisplay = (props) => {
  const date = moment(new Date(props.updatedAt)).format("D MMM YYYY");

  return (
    <View style={styles.container}>
      <Text>{date}</Text>
      <Text>
        {props.matchedName} {props.details}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    height: 30,
    borderRadius: 15,
    borderColor:Colors.blue3,
    alignItems:'center',
    padding:10,
    flexDirection:'row',
    justifyContent:'space-between'
  },
});

export default ViewLogDisplay;
