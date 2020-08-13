import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
  SectionList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import LoanSectionDisplay from "../../components/LoanSectionDisplay";
import { Ionicons } from "@expo/vector-icons";


import AddOrdersSubSectionHeader from "../../components/AddOrdersSubSectionHeader";

import LoanDisplay from "../../components/LoanDisplay";
import * as authActions from "../../store/actions/auth";
import * as loanActions from "../../store/actions/loan";
import { matchUsersWithContacts } from "../../utils/initialiseContacts";


const LoansScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [query, setQuery] = useState("")
  const { borrowedFrom, loanedTo, borrowed, loaned } = useSelector(
    (state) => state.loan.loans
  )
  const netDebt = useSelector((state) => state.loan.netDebt);
  const dispatch = useDispatch();

  const loadLoans = useCallback(async () => {
    console.log("load loans");
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(loanActions.fetchLoans());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const listenerCreated = props.navigation.addListener("focus", loadLoans);

    return () => {
      // calling this function will remove the listener
      listenerCreated();
    };
  }, [loadLoans]);

  useEffect(() => {
    setIsLoading(true);
    loadLoans().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadLoans]);

  var contactsFromStore = useSelector((state) => state.auth.contacts);

  useEffect(() => {
    async function initialiseContacts() {
      var matched = await matchUsersWithContacts();
      dispatch(authActions.setContacts(matched));
    }

    if (!contactsFromStore) {
      console.log("calling initialiseContacts");
      initialiseContacts();
    }
  }, [contactsFromStore]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button title="Try again" onPress={loadLoans} color={Colors.blue1} />
      </View>
    );
  }

  if (isLoading || !borrowedFrom) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.blue1} />
      </View>
    );
  }

  // if (!isLoading && Object.keys(loans) === 0) {
  //   return (
  //     <View style={styles.centered}>
  //       <Text>No loans found</Text>
  //     </View>
  //   );
  // }

  const handleSearch = (text) => {
    setQuery(text)
  }

  return (
    <View style={{ alignItems: "center", paddingVertical: 20, flex: 1 }}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {props.navigation.navigate("ContactsList")}}
        style={styles.floatingButton}
      >
        <Ionicons name="md-add" size={24} color="white" />
      </TouchableOpacity>
      <View style={{ width: "90%", flex: 1}}>
        <View style={styles.searchbar}>
          <View style={styles.icon}></View>
          <TextInput value={query} onChangeText={handleSearch} placeholder="Finding someone?"/>
        </View>
        <SectionList
          onRefresh={loadLoans}
          refreshing={isRefreshing}
          // ListHeaderComponent={headerComponent}
          sections={[
            {
              type: "borrowedFrom",
              data: [Object.keys(borrowedFrom)],
            },
            {
              type: "loanedTo",
              data: [Object.keys(loanedTo)],
            },
          ]}
          keyExtractor={(item, index) => item.toString()}
          renderItem={({ item, section: { type } }) => (
            <LoanSectionDisplay item={item} type={type} navigation={props.navigation} query={query}/>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  searchbar:{
    height: 40,
    borderRadius: 20,
    alignItems:"center",
    backgroundColor: '#fff',
    flexDirection:'row',
    paddingHorizontal:10,
    borderWidth:1,
    borderColor: Colors.gray,
    marginBottom: 10
    },
    floatingButton: {
      backgroundColor: Colors.blue1,
      position: "absolute",
      width: 60,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      right: 30,
      bottom: 30,
      borderRadius: 30,
      zIndex: 1,
      flexDirection: "row",
    },
});

export default React.memo(LoansScreen);
