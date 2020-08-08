import React from "react";
import { View, StyleSheet } from "react-native";
import Colors from '../../constants/Colors'

const FormRow = (props) => {
  return (
    <View style={{ ...styles.formRow, ...props.style }}>{props.children}</View>
  );
};

const styles = StyleSheet.create({
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    alignItems:'center'
  },
});

export default FormRow;
