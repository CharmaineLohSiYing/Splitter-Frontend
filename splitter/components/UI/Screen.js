import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  View,
  StyleSheet,
} from "react-native";


const Screen = (props) => {

  return (
    <View style={{...styles.screen, ...props.style}}>
        {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
    screen: {
        backgroundColor:'white',
        flex: 1,
        alignItems: "center", 
    }
});

export default Screen;
