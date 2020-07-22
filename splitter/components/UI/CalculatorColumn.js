import React from 'react';
import { View, StyleSheet } from 'react-native';

const CalculatorColumn = props => {
  return <View style={{...styles.vertical, ...props.style}}>{props.children}</View>;
};

const styles = StyleSheet.create({
vertical: {
    flex: 1
  }
});

export default CalculatorColumn;
