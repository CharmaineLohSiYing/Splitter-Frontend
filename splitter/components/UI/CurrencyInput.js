import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";

const CurrencyInput = (props) => {

  const textChangeHandler = (text) => {
    // allows commas and decimals
    var currencyRegex = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/
    if(currencyRegex.test(text) || text === ''){
        props.onChangeValue(text)
    }
  };

  return (
    <TextInput 
      {...props}
      style={{ ...styles.currency, ...props.style }}
      keyboardType="decimal-pad"
      value={props.value}
      onChangeText={textChangeHandler}
    ></TextInput>
  );
};

const styles = StyleSheet.create({
  currency: {
    flex: 1,
  },
});
export default CurrencyInput;
