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
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { BoxShadow } from "react-native-shadow";
import AddBillProgress from "./AddBillProgress";
import MyAppText from "./UI/MyAppText";
import Colors from '../constants/Colors'
import { MaterialIcons, Ionicons } from "@expo/vector-icons";


const screenWidth = Dimensions.get("window").width;
const HEADER_HEIGHT = 160;

const shadowOpt = {
  width: screenWidth,
  height: HEADER_HEIGHT,
  color: "#000",
  border: 2,
  radius: 3,
  opacity: 0.1,
  x: 0,
  y: 1,
};

const CreateBillHeader = (props) => {
  return (
    <BoxShadow setting={shadowOpt}>
      <View style={styles.header}>
        <AddBillProgress progress={props.progress} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <MyAppText style={styles.numSelectedText}>
            {props.title}
          </MyAppText>
          {props.displayProceed && <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              width: 50,
            }}
            onPress={props.proceedHandler}
          >
            <Text style={{ fontStyle: "italic", color: Colors.blue1 }}>
              Next
            </Text>
            <Ionicons name="md-arrow-forward" size={16} color={Colors.blue1} />
          </TouchableOpacity>}
        </View>
        {props.subtitle && <View style={{marginVertical:5}}>
            <MyAppText style={{fontSize: 12, fontStyle:"italic"}}>
                {props.subtitle}
            </MyAppText>
        </View>}
        {props.children}
      </View>
    </BoxShadow>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "relative",
    width: "100%",
    height: HEADER_HEIGHT,
    overflow: "hidden",
    backgroundColor: "#fff",
    paddingHorizontal: 20
  },
  numSelectedText: {
    fontSize: 18,
  },
});

export default CreateBillHeader;
