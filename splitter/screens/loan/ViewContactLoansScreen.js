import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import moment from 'moment'

import EventItemDisplay from "../../components/EventItemDisplay";
import * as authActions from "../../store/actions/auth";
import Colors from "../../constants/Colors";

const ViewContactLoansScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [debt, setDebt] = useState();
  const [loans, setLoans] = useState({});
  const dispatch = useDispatch();

  const { matchedName, friendUserId } = props.route.params;
  const currUserId = useSelector((state) => state.auth.userId);
  const loadLoans = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const response = await fetch(
        "http://192.168.1.190:5000/loan/friend/" +
          currUserId +
          "/" +
          friendUserId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorResData = await response.json();
        console.log("errorResData", errorResData);

        let message = "Something went wrong!";
        if (errorResData) {
          message = errorResData;
        }
        throw new Error(message);
      }

      const resData = await response.json();
      // console.log(resData.loans)
      setLoans(resData.loans);
      setDebt(resData.debt)
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

  // var contactsFromStore = useSelector((state) => state.auth.contacts);

  const viewEventHandler = (eventId) => {
    props.navigation.navigate("Events", {
      screen: "ViewEvent",
      params: { eventId },
      initial: true,
    });
    // props.navigation.push("Events", {
    //   screen: "ViewEvent",
    //   params: { eventId },
    // });
    
  };

  const LoanDisplay = (date, amount, matchedName, toId, payerId, isCancelled, eventId) => {
    
    if (payerId){
      // display loan
      return (
        <View style={styles.loanContainer}>
          <Text>{moment(date).format("D MMM YYYY")}</Text>
          {payerId === currUserId ? (
            <Text>
              You owe {matchedName} ${amount}
            </Text>
          ) : (
            <Text>
              {matchedName} owes you ${amount}
            </Text>
          )}
          {eventId && (
            <Button
              title="View event"
              onPress={() => viewEventHandler(eventId)}
            />
          )}
        </View>
      );
    }
    else{
      // display transaction
      return (
        <View style={styles.loanContainer}>
          <Text>{moment(date).format("D MMM YYYY")}</Text>
          {toId === currUserId ? (
            <Text>
              {matchedName} paid you ${amount}
            </Text>
          ) : (
            <Text>
              You paid {matchedName} ${amount}
            </Text>
          )}
         
        </View>
      );
    }
    
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button title="Try again" onPress={loadLoans} color={Colors.primary} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && Object.keys(loans) === 0) {
    return (
      <View style={styles.centered}>
        <Text>No loans found</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerContainer}>
        <Text>{matchedName}</Text>
          {debt < 0 && <Text>{matchedName} owes you ${-debt}</Text>}
          {debt > 0 && <Text>You owe {matchedName} ${debt}</Text>}
          {debt === 0 && <Text>No debt</Text>}
      </View>
      <View style={styles.headerButtons}>
          <Button title="Settle Up" onPress={() => props.navigation.navigate("CreateTransaction", {matchedName, debt, friendUserId })}/>
          <Button title="New Loan" onPress={() => props.navigation.navigate("CreateLoan", {matchedName, friendUserId })}/>
        </View>

      <View style={styles.loansContainer}>
        <FlatList
          onRefresh={loadLoans}
          refreshing={isRefreshing}
          keyExtractor={(item, index) => index.toString()}
          // data={loans.slice(0, 3)}
          data={loans}
          renderItem={({ item }) =>
            LoanDisplay(
              item.date,
              item.amount,
              matchedName,
              item.from,
              item.payer,
              item.isCancelled,
              item.event
            )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loansContainer: {
    flex: 1
  },
  headerContainer:{
    textAlign:'center',
    alignItems:'center',
    backgroundColor: Colors.lightBlue
  },
  loanContainer:{
    backgroundColor:'#ccc',
    margin:10,
    height: 40,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  headerButtons:{
    backgroundColor: Colors.lightBlue,
    flexDirection:'row',
    justifyContent:'space-evenly'
  }
});

export default ViewContactLoansScreen;
