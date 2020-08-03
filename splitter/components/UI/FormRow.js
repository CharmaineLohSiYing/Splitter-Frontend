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
    borderBottomWidth: 1,
    borderColor: Colors.blue2,
    height: 50,
    alignItems:'center'
  },
});

export default FormRow;
