import React from "react";
import { View, StyleSheet } from "react-native";

const FormRow = (props) => {
  return (
    <View style={{ ...styles.formRow, ...props.style }}>{props.children}</View>
  );
};

const styles = StyleSheet.create({
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default FormRow;
