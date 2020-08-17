import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Avatar from "./Avatar";

const AvatarName = (props) => {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", ...props.style }}
    >
      <View style={props.avatarContainerStyle}>
        <Avatar style={props.avatarStyle} />
      </View>

      <Text style={props.textStyle}>{props.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default AvatarName;
