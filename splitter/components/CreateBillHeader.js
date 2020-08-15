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
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { BoxShadow } from "react-native-shadow";
import AddBillProgress from "./AddBillProgress";
import MyAppText from "./UI/MyAppText";
import Colors from "../constants/Colors";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;


const CreateBillHeader = (props) => {
  const {children, subtitle, progress, displayProceed, title, proceedHandler} = props

  const [headerHeight, setHeaderHeight] = useState(160)

  useEffect(() => {
    if (!children && !subtitle){
      setHeaderHeight(120)
      console.log('set height to 120', progress)
    }
  }, [])

  

  const shadowOpt = {
    width: screenWidth,
    height: headerHeight,
    color: "#000",
    border: 2,
    radius: 3,
    opacity: 0.1,
    x: 0,
    y: 1,
  };
  return (
    <BoxShadow setting={shadowOpt}>
      <View style={{...styles.header, height: headerHeight, ...props.headerStyle}}>
        <AddBillProgress progress={progress} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <MyAppText style={styles.numSelectedText}>{title}</MyAppText>
          {displayProceed && (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                width: 50,
              }}
              onPress={proceedHandler}
            >
              <Text style={{ fontStyle: "italic", color: Colors.blue1 }}>
                {progress < 4 ? "Next" : "Create"}
              </Text>
              {progress != 4 && (
                <Ionicons
                  name="md-arrow-forward"
                  size={16}
                  color={Colors.blue1}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
        {subtitle && (
          <View style={{ marginVertical: 5 }}>
            <MyAppText style={{ fontSize: 12, fontStyle: "italic" }}>
              {subtitle}
            </MyAppText>
          </View>
        )}
        {children}
      </View>
    </BoxShadow>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  numSelectedText: {
    fontSize: 18,
  },
});

export default CreateBillHeader;
