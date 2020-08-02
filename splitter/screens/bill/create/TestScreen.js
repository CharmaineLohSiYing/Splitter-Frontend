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

const ViewLogDisplay = (props) => {

  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    height: 30,
    borderColor:'#ccc',
    alignItems:'center',
    marginHorizontal:10,
    paddingHorizontal:10,
    flexDirection:'row',
    justifyContent:'space-between'
  },
});

export default ViewLogDisplay;
