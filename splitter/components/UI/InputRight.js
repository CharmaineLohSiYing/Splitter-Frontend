import React from "react";
import { View, StyleSheet } from "react-native";

const InputRight = (props) => {
  return (
    <View style={{ ...styles.inputRight, ...props.style }}>{props.children}</View>
  );
};

const styles = StyleSheet.create({
    inputRight: {
      flex: 1,
      flexDirection:'row',
      alignItems:'center'
    },
  });
export default InputRight;
