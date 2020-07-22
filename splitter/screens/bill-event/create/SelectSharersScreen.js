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
import SharerDisplay from '../../../components/SharerDisplay'

import Input from "../../../components/UI/Input";
import Card from "../../../components/UI/Card";
import Colors from "../../../constants/Colors";
import * as authActions from "../../../store/actions/auth";



const SelectSharersScreen = (props) => {
  const attendees = useSelector((state) => state.billEvent.attendees);
  var sharerParams = []
  if (props.route.params && props.route.params.sharers){
    sharerParams = props.route.params.sharers
    console.log('sharerParams', sharerParams)
  }
  
  const tempArray = []
  Object.keys(attendees).forEach((attendee) => tempArray.push(attendee))
  const [sharers, setSharers] = useState(sharerParams);
  const [selectAll, setSelectAll] = useState(true);


  const toggleSelectAll = () => {
    if (selectAll) {
      // unselect everything
      setSharers([])
      // Object.values(attendees).forEach(attendee => attendee['isSharer'] = false)
    } else {
      // select everything
      setSharers(tempArray)
      // Object.values(attendees).forEach(attendee => attendee['isSharer'] = true)
    }
    setSelectAll(state => !state)
  };

  const toggleSharerHandler = async (id) => {
    // console.log(attendees[id])
    if (sharers.includes(id)){
      setSharers(sharers.filter((sharer) => sharer !==  id))
    } else {
      setSharers(sharers.concat(id))
    }
  }

  const proceedHandler = () => {
    if (sharers.length < 2){
      Alert.alert('Error', 'Select at least 2 people', [{ text: 'Okay' }]);
      return;
    }

    if (props.route.params && props.route.params.updateSharedOrder){
      props.navigation.navigate('Calculator', {sharers, updateSharedOrder: true, orderId: props.route.params.orderId})
    } else {
      props.navigation.navigate('Calculator', {sharers})
    }
  }

  return (
    <View style={styles.screen}>
      <Text>Shared Among</Text>
      <View style={styles.selectorHeader}>
        <View>
          <Text>{Object.keys(sharers).length} selected</Text>
        </View>
        <View>
          <Button
            onPress={toggleSelectAll}
            title={selectAll ? "Unselect All" : "Select All"}
          />
        </View>
        <View>
          <Button title="Next" onPress={proceedHandler}/>
        </View>
      </View>

      <View>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={Object.keys(attendees)}
          initialNumToRender={10}
          renderItem={({ item }) => (
            <SharerDisplay name={attendees[item].name} selected={sharers.includes(item)} id={item} onSelect={toggleSharerHandler}/>
          )}
        />
      </View>
    </View>
  );
};

SelectSharersScreen.navigationOptions = {
  headerTitle: "Select Sharers",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  selectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default SelectSharersScreen;
