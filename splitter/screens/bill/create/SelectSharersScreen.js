import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  FlatList,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import SharerDisplay from "../../../components/SharerDisplay";
import ProceedBottomButton from "../../../components/UI/ProceedBottomButton";

import Input from "../../../components/UI/Input";
import Card from "../../../components/UI/Card";
import Colors from "../../../constants/Colors";
import * as authActions from "../../../store/actions/auth";

const SelectSharersScreen = (props) => {
  props.navigation.setOptions({
    headerTitle: "Select Sharers",
    headerTitleStyle: {
      fontFamily: "roboto-regular",
      flex: 1,
      alignSelf: "center",
    },
  });

  const attendees = useSelector((state) => state.bill.attendees);
  const allSelectedArray = [];
  Object.keys(attendees).forEach((key) => allSelectedArray.push(key));
  var sharerParams = [];
  if (props.route.params && props.route.params.sharers) {
    sharerParams = props.route.params.sharers;
  } else {
    sharerParams = allSelectedArray;
  }

  const [sharers, setSharers] = useState(sharerParams);
  const [selectAll, setSelectAll] = useState(true);

  const toggleSelectAll = () => {
    if (selectAll) {
      // unselect everything
      setSharers([]);
      // Object.values(attendees).forEach(attendee => attendee['isSharer'] = false)
    } else {
      // select everything
      setSharers(allSelectedArray);
      // Object.values(attendees).forEach(attendee => attendee['isSharer'] = true)
    }
    setSelectAll((state) => !state);
  };

  const toggleSharerHandler = async (id) => {
    // console.log(attendees[id])
    if (sharers.includes(id)) {
      setSharers(sharers.filter((sharer) => sharer !== id));
    } else {
      setSharers(sharers.concat(id));
    }
  };

  const proceedHandler = () => {
    if (sharers.length < 2) {
      Alert.alert("Error", "Select at least 2 people", [{ text: "Okay" }]);
      return;
    }

    if (props.route.params && props.route.params.updateSharedOrder) {
      props.navigation.navigate("Calculator", {
        sharers,
        updateSharedOrder: true,
        orderId: props.route.params.orderId,
      });
    } else {
      props.navigation.navigate("Calculator", { sharers });
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.selectorHeader}>
          <View style={styles.numSelected}>
            <Text>{Object.keys(sharers).length} selected</Text>
          </View>
          <TouchableOpacity
            onPress={toggleSelectAll}
            activeOpacity={0.8}
            style={styles.handleAllButton}
          >
            <Text>{selectAll ? "Unselect All" : "Select All"}</Text>
          </TouchableOpacity>
        </View>

        <View>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={Object.keys(attendees)}
            initialNumToRender={10}
            renderItem={({ item }) => (
              <SharerDisplay
                name={attendees[item].name}
                selected={sharers.includes(item)}
                id={item}
                onSelect={toggleSharerHandler}
              />
            )}
          />
        </View>
        <ProceedBottomButton
          proceedHandler={proceedHandler}
          style={{ marginTop: 10 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    borderWidth: 1,
    borderColor: Colors.blue2,
    marginVertical: 10,
    width: "90%",
    padding: 10,
  },
  selectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    marginBottom: 10,
  },
  handleAllButton: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 100,
    height: 30,
    backgroundColor: Colors.blue2,
  },
});

export default SelectSharersScreen;
