import React from "react";
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Colors from "../../constants/Colors"

const LongButton = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.container, props.containerStyle]} disabled={props.disabled}>
      {!props.isLoading ? <Text style={[styles.text, props.textStyle]}>{props.text}</Text> : <ActivityIndicator size="small" color={props.textStyle.color ? props.textStyle.color : Colors.blue1} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.blue3,
  },
  text: {
    color: Colors.blue1,
    fontWeight: "bold",
  },
});

export default LongButton;
