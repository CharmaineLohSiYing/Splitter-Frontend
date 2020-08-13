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
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import CurrencyInput from "./UI/CurrencyInput";
import loan from "../store/reducers/loan";
import Colors from "../constants/Colors";
import LoanDisplay from "./LoanDisplay";
import { SearchableFlatList } from "react-native-searchable-list";
const ITEM_HEIGHT = 50;

const LoanSectionDisplay = (props) => {
  const { item, type, query } = props;
    const data = item;
    let loans;
    let total; 
    if (type === "borrowedFrom"){
        loans = useSelector(state => state.loan.loans.borrowedFrom);
        total = useSelector(state => state.loan.loans.borrowed);
    } else {
        loans = useSelector(state => state.loan.loans.loanedTo);
        total = useSelector(state => state.loan.loans.loaned);
    }
    const { contacts } = useSelector((state) => state.auth);
    const [dataArr, setDataArr] = useState([]) 


  useEffect(() => {
    const tempArr = []
    for (const key of Object.keys(loans)){
        if (key in contacts){
            loans[key].name = contacts[key].name
        } else {
            loans[key].name = key
        }
        tempArr.push(loans[key])
    }
    setDataArr(tempArr)
  }, [])

  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <View>
          <Text style={{fontWeight: 'bold', fontSize: 16, color: Colors.gray}}>
            {type === "borrowedFrom"
              ? "You owe people..."
              : "They still owe you..."}
          </Text>
        </View>
        <View style={[styles.totalContainer, {backgroundColor: type === "borrowedFrom" ? Colors.lightRed : Colors.blue3}]}>
          <Text style={styles.total}>
            ${total.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SearchableFlatList
        keyboardShouldPersistTaps={"handled"}
        searchTerm={query}
        searchAttribute="name"
        ignoreCase={false}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      style={[
        styles.container,
        {
          backgroundColor:
            type === "borrowedFrom" ? Colors.lightestRed : Colors.blue5,
        },
      ]}
      ListHeaderComponent={Header}
      // ItemSeparatorComponent={ItemSeparator}
      keyExtractor={(item, index) => index.toString()}
      data={dataArr}
      initialNumToRender={5}
      renderItem={({ item }) => (
        <LoanDisplay
          nameColor={type === "borrowedFrom" ? Colors.darkRed : Colors.blue1}
          friendName={item.name}
          debt={item.debt}
          friendUserId={item.userId}
          navigate={props.navigation.navigate}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    margin: 5,
    elevation: 2,
  },
  friend: {
    textDecorationStyle: "solid",
  },
  headerContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalContainer: {
    borderRadius: 20,
    minWidth: 80,
    padding: 5,
    alignItems:'center'
  }
});

export default LoanSectionDisplay;
