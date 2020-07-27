import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesome5, Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from '../../constants/Colors'

const CalculatorButton = (props) => {
  let iconName;
  let iconType;
  if (!props.digit) {
    switch (props.value) {
      case "Add":
        iconName = "plus";
        iconType = "FontAwesome5";
        break;
      case "Subtract":
        iconName = "minus";
        iconType = "FontAwesome5";
        break;
      case "Multiply":
        iconName = "times";
        iconType = "FontAwesome5";
        break;
      case "Divide":
        iconName = "divide";
        iconType = "FontAwesome5";
        break;
      case "Equal":
        iconName = "equals";
        iconType = "FontAwesome5";
        break;
      case "Decimal":
        iconName = "dot-single";
        iconType = "Entypo";
        break;
      case "Delete":
        iconName = "delete";
        iconType = "Feather";
        break;
      case "Clear":
        iconName = "cancel";
        iconType = "MaterialCommunityIcons";
        break;
      case "Percent":
        iconName = "percent";
        iconType = "FontAwesome5";
        break;
    }
  }

  return (
    <TouchableOpacity
        onPress={() => props.onPress(props.value)}
      activeOpacity={0.8}
      style={[
        { ...styles.button, ...props.style },
        { backgroundColor: props.grey ? "#ccc" : Colors.lightBlue },
      ]}
    >
      {!props.digit && iconType == "Entypo" && (
        <Entypo name={iconName} size={24} color="black" />
      )}
      {!props.digit && iconType == "FontAwesome5" && (
        <FontAwesome5 name={iconName} size={24} color="black" />
      )}
      {!props.digit && iconType == "Feather" && (
        <Feather name={iconName} size={24} color="black" />
      )}
      {!props.digit && iconType == "MaterialCommunityIcons" && (
        <MaterialCommunityIcons name={iconName} size={24} color="black" />
      )}
      {props.digit && <Text>{props.value}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor:'white',
    borderWidth:1

  },
});

export default CalculatorButton;
