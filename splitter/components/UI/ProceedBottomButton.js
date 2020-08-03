import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from '../../constants/Colors'
const ProceedBottomButton = (props) => {

  return (
    <TouchableOpacity
      onPress={props.proceedHandler}
      style={[styles.proceedButton, props.style]}
      activeOpacity={0.8}
    >
      <Text style={styles.proceedText}>Proceed</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  proceedButton: {
    width: "100%",
    height: 40,
    backgroundColor: Colors.blue1,
    alignItems: "center",
    justifyContent: "center",
  },
  proceedText: {
    color: "white",
    fontSize: 16,
  },
});

export default React.memo(ProceedBottomButton);
