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
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Avatar from '../components/Avatar'
const avatarHalfWidth = 15

const OverlappingAvatar = (props) => {
  const {num} = props
  return (
    <View style={styles.overlappingAvatars}>
      {num > 3 && <Avatar style={{ left: 35, ...styles.avatar }} numExcess={num-3}/>}
      {num >= 3 && <Avatar style={{ left: 2 * avatarHalfWidth, ...styles.avatar}}/>}
      <Avatar style={{ left: avatarHalfWidth, ...styles.avatar }}/>
      <Avatar style={styles.avatar}/>
    </View>
  );
};

const styles = StyleSheet.create({
    avatar: {
        height: 2 * avatarHalfWidth,
        width: 2 * avatarHalfWidth,
        borderRadius: avatarHalfWidth,
        marginRight:0,
        borderWidth: 1,
        borderColor: 'white'
      },
      overlappingAvatars: {
        flexDirection: "row-reverse",
        alignItems: "flex-start",
        justifyContent: "flex-end",
      },
});

export default OverlappingAvatar;
