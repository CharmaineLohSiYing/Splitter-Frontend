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

const STEP_WIDTH = 40;
const STEP_X_MARGIN = 15; 
const CONTAINER_Y_PADDING = 20; 

const AddBillProgress = (props) => {
 
  const progress = props.progress;
  // total length of both connectors = 3 x (spacing between steps = 15 + 15) + 2 x (width of each step = 40) = 140
  const totalConnectorLength = 3 * (2 * STEP_X_MARGIN) + 2 * (STEP_WIDTH);
  let activeLength = totalConnectorLength;
  switch (progress){
    case 1:
      activeLength = 0;
      break;
    case 2:
      activeLength = (2 * STEP_X_MARGIN);
      break;
    case 3: 
      activeLength = (4 * STEP_X_MARGIN) + STEP_WIDTH;
      break;
    case 4:
      activeLength = totalConnectorLength;
      break;
    default:
      activeLength = totalConnectorLength;
  }


  
  return (
    <View style={styles.container}>
      <View style={styles.connectorContainer}>
        <ProgressConnector active={true} width={activeLength}/>
        <ProgressConnector active={false} width={totalConnectorLength - activeLength}/>
      </View>
      <ProgressStep number={1} active={progress >= 1 ? true : false} title="Attendees" style={styles.progressStep}/>
      <ProgressStep number={2} active={progress >= 2 ? true : false} title="Orders" style={styles.progressStep}/>
      <ProgressStep number={3} active={progress >= 3 ? true : false} title="Bill Details" style={styles.progressStep}/>
      <ProgressStep number={4} active={progress >= 4 ? true : false} title="Payment" style={styles.progressStep}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    paddingVertical: CONTAINER_Y_PADDING,
    borderColor: "#ccc",
    alignItems: "center",
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  connectorContainer:{
    position:'absolute',
    flexDirection:'row',
    top: CONTAINER_Y_PADDING + (STEP_WIDTH / 2)
  },
  progressStep:{
    marginHorizontal: STEP_X_MARGIN,
    width: STEP_WIDTH,
    height: STEP_WIDTH, 
    borderRadius: STEP_WIDTH / 2
  }
});

export default AddBillProgress;
