import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  View,
  StyleSheet,
} from "react-native";


const Content = (props) => {

  return (
    <View style={{...styles.content, ...props.style}}>
        {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        width: '90%'
    }
});

export default Content;
