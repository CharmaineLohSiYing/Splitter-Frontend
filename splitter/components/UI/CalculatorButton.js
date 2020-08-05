import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesome5, Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from '../../constants/Colors'

const CalculatorButton = (props) => {
  let iconName;
  let iconType;
  if (!props.digit) {
    switch (props.value) {
      case "Delete":
        iconName = "delete";
        iconType = "Feather";
        break;
      case "Clear":
        iconName = "cancel";
        iconType = "MaterialCommunityIcons";
        break;
    }
  }
  return (
    <TouchableOpacity
        onPress={() => props.onPress(props.value)}
      style={[
        { ...styles.button, ...props.style },
      ]}
    >
      {!props.digit && iconType == "Feather" && (
        <Feather name={iconName} size={20} color={Colors.blue1}/>
      )}
      {!props.digit && iconType == "MaterialCommunityIcons" && (
        <MaterialCommunityIcons name={iconName} size={20} color={Colors.blue1} />
      )}
      {props.digit && <Text style={{...styles.buttonText, fontSize: props.fontSize}}>{props.value}</Text>}
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
  buttonText:{
    color: Colors.blue1,
  }
});

export default React.memo(CalculatorButton);
