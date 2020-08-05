import React from "react";
import { View, StyleSheet, Text } from "react-native";

const AmountButton = (props) => {
  const { amount, color, backgroundColor } = props;
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor,
        borderColor: backgroundColor,
      }}
    >
      <Text style={{ ...styles.amount, color }}>${amount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 5,
    borderRadius: 15,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    minWidth: 80,
    height: 30
  },
  amount: {},
});

export default AmountButton;
