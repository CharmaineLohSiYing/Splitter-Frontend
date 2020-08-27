import React, { useState, useEffect, useReducer, useCallback } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../constants/Colors";

const PlaceholderImage = (props) => {
  return (
    <>
      {props.topText && (
        <Text style={{ fontStyle: "italic", fontWeight: "bold", fontSize: 18 }}>
          {props.topText}
        </Text>
      )}
      <View style={{ height: "40%", marginTop: -30}}>
        <Image
          source={props.imageName}
          style={{ flex: 1, resizeMode: "contain" }}
        />
      </View>
      <TouchableOpacity
        onPress={props.onPress}
        style={{ alignItems: "center" }}
      >
        <Text style={{ marginTop: -20 }}>{props.mainText}</Text>
        {props.actionText && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text
              style={{ color: props.error ? Colors.red1 : Colors.blue1, paddingRight: 5, fontSize: 14 }}
            >
              {props.actionText}
            </Text>
            <Ionicons name="md-arrow-forward" size={20} color={props.error ? Colors.red1 : Colors.blue1} />
          </View>
        )}
      </TouchableOpacity>
    </>
  );
};

export default PlaceholderImage;
