import React, { useState, useEffect, useReducer, useCallback, useMemo } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Button,
  Text,
} from "react-native";
import Colors from '../constants/Colors'

const FlashMessage = (props) => {
    let color;
    let backgroundColor;
    
    switch (props.type){
        case 'error':
            color = Colors.red1;
            backgroundColor = Colors.red3;
            break;
        case 'success':
            color = Colors.green1;
            backgroundColor = Colors.green2;
            break;
        default:
            color = Colors.blue1;
            backgroundColor = Colors.blue4Rgba;
            break;
    }
  return (
      <View style={[styles.container, {backgroundColor},props.style]}>
        <Text style={[styles.text, {color}]}>{props.text}</Text>
      </View>
  )
};

const styles = StyleSheet.create({
  container: {
    position:"absolute",
    bottom: 5,
    width: '90%',
    height: 50,
    borderRadius: 15,
    margin: 10,
    alignItems:'center',
    justifyContent:'center',
    elevation: 1,
    zIndex: 2
  },
  
});

export default FlashMessage;
